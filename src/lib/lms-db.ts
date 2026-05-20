import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { CourseStructure, Phase, Week } from "@/types/lms";

const safeParse = (val: any): string[] => {
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val || "[]"); } catch { return []; }
};

export async function fetchCourseFromDB(
  slug: string,
  userId?: number
): Promise<CourseStructure | null> {
  try {
    const courses = await query(
      `SELECT * FROM courses WHERE slug = ? LIMIT 1`,
      [slug]
    ) as RowDataPacket[];

    if (!courses.length) return null;
    const course = courses[0];

    const phases = await query(
      `SELECT * FROM course_phases WHERE course_id = ? ORDER BY order_index ASC, phase_number ASC`,
      [course.id]
    ) as RowDataPacket[];

    if (!phases.length) {
      // Course exists but no LMS content added yet — return shell so UI can show empty state
      return {
        id: String(course.id), slug: course.slug,
        title: course.title, description: course.description || "",
        shortDescription: course.short_description || (course.description || "").slice(0, 120),
        image: course.image || course.thumbnail || "/images/course-default.jpg",
        instructor: course.instructor || "DreamMore Instructor", instructorImage: "",
        totalPhases: 0, totalWeeks: 0, totalVideos: 0,
        totalDuration: course.duration || "—",
        level: (course.level || "Beginner") as "Beginner" | "Intermediate" | "Advanced" | "All Levels",
        price: Number(course.price) || 0, currency: "ETB",
        phases: [], overallProgress: 0, isEnrolled: true, certificateEnabled: true,
      };
    }

    const phaseIds = phases.map((p) => p.id);
    const inPhase = phaseIds.map(() => "?").join(",");

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
      [videos, notes, assignments] = await Promise.all([
        query(`SELECT * FROM class_videos WHERE week_id IN (${inWeek}) ORDER BY order_index ASC`, weekIds) as Promise<RowDataPacket[]>,
        query(`SELECT * FROM class_notes WHERE week_id IN (${inWeek}) ORDER BY order_index ASC`, weekIds) as Promise<RowDataPacket[]>,
        query(`SELECT * FROM assignments WHERE week_id IN (${inWeek}) ORDER BY order_index ASC`, weekIds) as Promise<RowDataPacket[]>,
      ]);
    }

    const completedVideoIds = new Set<number>();
    const completedWeekIds = new Set<number>();
    const completedPhaseIds = new Set<number>();
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

    let totalVideos = 0;
    let totalWeeks = weeks.length;
    let completedWeeksCount = 0;

    const builtPhases: Phase[] = phases.map((p, pi) => {
      const phaseWeeks = weeks.filter((w) => w.phase_id === p.id);

      const builtWeeks: Week[] = phaseWeeks.map((w) => {
        const wVideos = videos.filter((v) => v.week_id === w.id);
        const wNotes = notes.filter((n) => n.week_id === w.id);
        const wAssignments = assignments.filter((a) => a.week_id === w.id);
        totalVideos += wVideos.length;

        const doneVids = wVideos.filter((v) => completedVideoIds.has(v.id)).length;
        const wProgress = wVideos.length > 0 ? Math.round((doneVids / wVideos.length) * 100) : 0;
        const wDone = completedWeekIds.has(w.id) || (wVideos.length > 0 && doneVids === wVideos.length);
        if (wDone) completedWeeksCount++;

        return {
          id: String(w.id),
          weekNumber: w.week_number,
          title: w.title,
          description: w.description || "",
          learningTopics: safeParse(w.learning_topics),
          isLocked: Boolean(w.is_locked),
          isCompleted: wDone,
          orderIndex: w.order_index,
          progressPercentage: wProgress,
          videos: wVideos.map((v) => ({
            id: String(v.id), videoNumber: v.video_number || "",
            title: v.title, description: v.description || "",
            thumbnailUrl: v.thumbnail_url || "", videoUrl: v.video_url,
            durationMinutes: v.duration_minutes || 0,
            isCompleted: completedVideoIds.has(v.id),
            progressSeconds: 0, orderIndex: v.order_index,
          })),
          notes: wNotes.map((n) => ({
            id: String(n.id), title: n.title, description: n.description || "",
            pdfUrl: n.pdf_url, fileSizeMb: Number(n.file_size_mb) || 0,
            isDownloaded: false, orderIndex: n.order_index,
          })),
          assignments: wAssignments.map((a) => ({
            id: String(a.id), title: a.title, description: a.description || "",
            assignmentType: a.assignment_type as "practice" | "assignment" | "quiz",
            deadline: a.deadline ? String(a.deadline).split("T")[0] : undefined,
            isSubmitted: Boolean(a.is_submitted),
            maxScore: a.max_score || 100, orderIndex: a.order_index,
          })),
        };
      });

      const pDone = builtWeeks.filter((w) => w.isCompleted).length;
      const pProgress = builtWeeks.length > 0 ? Math.round((pDone / builtWeeks.length) * 100) : 0;

      return {
        id: String(p.id), phaseNumber: p.phase_number,
        title: p.title, description: p.description || "",
        durationWeeks: p.duration_weeks || builtWeeks.length,
        learningObjectives: safeParse(p.learning_objectives),
        isLocked: pi === 0 ? false : Boolean(p.is_locked),
        isCompleted: completedPhaseIds.has(p.id),
        orderIndex: p.order_index, progressPercentage: pProgress,
        weeks: builtWeeks,
      };
    });

    const overallProgress = totalWeeks > 0 ? Math.round((completedWeeksCount / totalWeeks) * 100) : 0;

    return {
      id: String(course.id),
      slug: course.slug,
      title: course.title,
      description: course.description || "",
      shortDescription: course.short_description || (course.description || "").slice(0, 120),
      image: course.image || course.thumbnail || "/images/course-default.jpg",
      instructor: course.instructor || "DreamMore Instructor",
      instructorImage: "",
      totalPhases: builtPhases.length,
      totalWeeks,
      totalVideos,
      totalDuration: course.duration || `${totalWeeks} weeks`,
      level: (course.level || "Beginner") as "Beginner" | "Intermediate" | "Advanced" | "All Levels",
      price: Number(course.price) || 0,
      currency: "ETB",
      phases: builtPhases,
      overallProgress,
      isEnrolled: true,
      certificateEnabled: true,
    };
  } catch (err) {
    console.error("fetchCourseFromDB error:", err);
    return null;
  }
}
