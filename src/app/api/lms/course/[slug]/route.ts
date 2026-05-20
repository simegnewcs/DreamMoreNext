import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// GET /api/lms/course/[slug]
// Returns full CourseStructure (phases → weeks → videos/notes/assignments) from DB
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  try {
    // 1. Fetch course
    const courses = await query(
      `SELECT c.*, u.name as instructor_name, u.avatar as instructor_image
       FROM courses c
       LEFT JOIN users u ON u.role = 'admin' OR u.id = 1
       WHERE c.slug = ?
       LIMIT 1`,
      [slug]
    ) as RowDataPacket[];

    if (!courses.length) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }
    const course = courses[0];

    // 2. Fetch phases
    const phases = await query(
      `SELECT * FROM course_phases WHERE course_id = ? ORDER BY order_index ASC, phase_number ASC`,
      [course.id]
    ) as RowDataPacket[];

    if (!phases.length) {
      return NextResponse.json({ success: true, course: null, empty: true });
    }

    const phaseIds = phases.map((p) => p.id);
    const inPhase = phaseIds.map(() => "?").join(",");

    // 3. Fetch weeks
    const weeks = await query(
      `SELECT * FROM weekly_content WHERE phase_id IN (${inPhase}) ORDER BY order_index ASC, week_number ASC`,
      phaseIds
    ) as RowDataPacket[];

    const weekIds = weeks.map((w) => w.id);

    let videos: RowDataPacket[] = [];
    let notes: RowDataPacket[] = [];
    let assignments: RowDataPacket[] = [];

    if (weekIds.length) {
      const inWeek = weekIds.map(() => "?").join(",");
      videos = await query(
        `SELECT * FROM class_videos WHERE week_id IN (${inWeek}) ORDER BY order_index ASC`,
        weekIds
      ) as RowDataPacket[];
      notes = await query(
        `SELECT * FROM class_notes WHERE week_id IN (${inWeek}) ORDER BY order_index ASC`,
        weekIds
      ) as RowDataPacket[];
      assignments = await query(
        `SELECT * FROM assignments WHERE week_id IN (${inWeek}) ORDER BY order_index ASC`,
        weekIds
      ) as RowDataPacket[];
    }

    // 4. Fetch student progress if userId provided
    let completedVideoIds = new Set<number>();
    let completedWeekIds = new Set<number>();
    let completedPhaseIds = new Set<number>();

    if (userId) {
      const progress = await query(
        `SELECT * FROM student_progress WHERE user_id = ? AND course_id = ?`,
        [userId, course.id]
      ) as RowDataPacket[];
      progress.forEach((p) => {
        if (p.is_completed && p.video_id) completedVideoIds.add(p.video_id);
        if (p.is_completed && p.week_id && !p.video_id) completedWeekIds.add(p.week_id);
        if (p.is_completed && p.phase_id && !p.week_id && !p.video_id) completedPhaseIds.add(p.phase_id);
      });
    }

    // 5. Build CourseStructure tree
    const safeParse = (val: any, fallback: any[] = []) => {
      if (Array.isArray(val)) return val;
      try { return JSON.parse(val || "[]"); } catch { return fallback; }
    };

    let totalVideos = 0;
    let totalWeeks = weeks.length;
    let completedWeeksCount = 0;

    const builtPhases = phases.map((p, pi) => {
      const phaseWeeks = weeks.filter((w) => w.phase_id === p.id);
      const isPhaseCompleted = completedPhaseIds.has(p.id);
      const isFirstPhase = pi === 0;

      const builtWeeks = phaseWeeks.map((w, wi) => {
        const weekVideos = videos.filter((v) => v.week_id === w.id);
        const weekNotes = notes.filter((n) => n.week_id === w.id);
        const weekAssignments = assignments.filter((a) => a.week_id === w.id);

        totalVideos += weekVideos.length;

        const completedVids = weekVideos.filter((v) => completedVideoIds.has(v.id)).length;
        const weekProgress = weekVideos.length > 0 ? Math.round((completedVids / weekVideos.length) * 100) : 0;
        const isWeekCompleted = completedWeekIds.has(w.id) || (weekVideos.length > 0 && completedVids === weekVideos.length);
        if (isWeekCompleted) completedWeeksCount++;

        // First week of first phase is always unlocked
        const isWeekLocked = !isFirstPhase ? true : wi !== 0 && !completedWeekIds.has(phaseWeeks[wi - 1]?.id);

        return {
          id: String(w.id),
          weekNumber: w.week_number,
          title: w.title,
          description: w.description || "",
          learningTopics: safeParse(w.learning_topics),
          isLocked: Boolean(w.is_locked) || (pi > 0 && !isFirstPhase),
          isCompleted: isWeekCompleted,
          orderIndex: w.order_index,
          progressPercentage: weekProgress,
          videos: weekVideos.map((v) => ({
            id: String(v.id),
            videoNumber: v.video_number || "",
            title: v.title,
            description: v.description || "",
            thumbnailUrl: v.thumbnail_url || "",
            videoUrl: v.video_url,
            durationMinutes: v.duration_minutes || 0,
            isCompleted: completedVideoIds.has(v.id),
            progressSeconds: 0,
            orderIndex: v.order_index,
          })),
          notes: weekNotes.map((n) => ({
            id: String(n.id),
            title: n.title,
            description: n.description || "",
            pdfUrl: n.pdf_url,
            fileSizeMb: Number(n.file_size_mb) || 0,
            isDownloaded: false,
            orderIndex: n.order_index,
          })),
          assignments: weekAssignments.map((a) => ({
            id: String(a.id),
            title: a.title,
            description: a.description || "",
            assignmentType: a.assignment_type as "practice" | "assignment" | "quiz",
            deadline: a.deadline ? String(a.deadline).split("T")[0] : undefined,
            isSubmitted: Boolean(a.is_submitted),
            maxScore: a.max_score || 100,
            orderIndex: a.order_index,
          })),
        };
      });

      const phaseCompletedWeeks = builtWeeks.filter((w) => w.isCompleted).length;
      const phaseProgress = builtWeeks.length > 0 ? Math.round((phaseCompletedWeeks / builtWeeks.length) * 100) : 0;

      return {
        id: String(p.id),
        phaseNumber: p.phase_number,
        title: p.title,
        description: p.description || "",
        durationWeeks: p.duration_weeks || builtWeeks.length,
        learningObjectives: safeParse(p.learning_objectives),
        isLocked: pi > 0 ? Boolean(p.is_locked) : false,
        isCompleted: isPhaseCompleted,
        orderIndex: p.order_index,
        progressPercentage: phaseProgress,
        weeks: builtWeeks,
      };
    });

    const overallProgress = totalWeeks > 0 ? Math.round((completedWeeksCount / totalWeeks) * 100) : 0;

    const courseStructure = {
      id: String(course.id),
      slug: course.slug,
      title: course.title,
      description: course.description || "",
      shortDescription: course.short_description || course.description?.slice(0, 120) || "",
      image: course.image || course.thumbnail || "/images/course-default.jpg",
      instructor: course.instructor || course.instructor_name || "DreamMore Instructor",
      instructorImage: course.instructor_image || course.instructor_avatar || "",
      totalPhases: builtPhases.length,
      totalWeeks,
      totalVideos,
      totalDuration: course.duration || `${totalWeeks} weeks`,
      level: (course.level as any) || "Beginner",
      price: Number(course.price) || 0,
      currency: "ETB",
      phases: builtPhases,
      overallProgress,
      isEnrolled: true,
      certificateEnabled: true,
    };

    return NextResponse.json({ success: true, course: courseStructure });
  } catch (error) {
    console.error("LMS course fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch course" }, { status: 500 });
  }
}
