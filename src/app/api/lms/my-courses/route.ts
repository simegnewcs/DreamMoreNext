import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";
import jwt from "jsonwebtoken";

interface CourseRow extends RowDataPacket {
  id: number;
  title: string;
  slug: string;
  description: string;
  duration: string;
  level: string;
  image: string;
  application_id: number;
  application_status: string;
  created_at: string;
}

// GET /api/lms/my-courses - Get approved courses for logged-in user
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    let userEmail: string;
    let userId: number | null = null;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret") as { email: string; id?: number };
      userEmail = decoded.email;
      userId = decoded.id || null;
    } catch {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    // Resolve userId from email if not in token
    if (!userId) {
      const users = await query(`SELECT id FROM users WHERE email = ? LIMIT 1`, [userEmail]) as RowDataPacket[];
      if (users.length) userId = users[0].id;
    }

    // Fetch approved applications with course details
    const courses = await query(
      `SELECT 
        c.id, c.title, c.slug, c.description, c.duration, c.level, c.image,
        a.id as application_id, a.status as application_status, a.created_at
       FROM applications a
       JOIN courses c ON a.course_id = c.id
       WHERE a.email = ? AND a.status = 'approved'
       ORDER BY a.created_at DESC`,
      [userEmail]
    ) as CourseRow[];

    if (!courses.length) {
      return NextResponse.json({ success: true, courses: [] });
    }

    const courseIds = courses.map((c) => c.id);
    const inCourse = courseIds.map(() => "?").join(",");

    // Fetch phase counts per course
    const phaseCounts = await query(
      `SELECT course_id, COUNT(*) as phase_count FROM course_phases WHERE course_id IN (${inCourse}) GROUP BY course_id`,
      courseIds
    ) as RowDataPacket[];

    // Fetch total week counts per course (via phases)
    const weekCounts = await query(
      `SELECT cp.course_id, COUNT(wc.id) as week_count
       FROM course_phases cp
       LEFT JOIN weekly_content wc ON wc.phase_id = cp.id
       WHERE cp.course_id IN (${inCourse})
       GROUP BY cp.course_id`,
      courseIds
    ) as RowDataPacket[];

    // Fetch real progress per course for this user
    const progressRows: RowDataPacket[] = userId
      ? await query(
          `SELECT course_id,
                  COUNT(DISTINCT video_id) as completed_videos
           FROM student_progress
           WHERE user_id = ? AND course_id IN (${inCourse}) AND is_completed = 1 AND video_id IS NOT NULL
           GROUP BY course_id`,
          [userId, ...courseIds]
        ) as RowDataPacket[]
      : [];

    // Fetch total video counts per course
    const videoCounts = await query(
      `SELECT cp.course_id, COUNT(cv.id) as video_count
       FROM course_phases cp
       JOIN weekly_content wc ON wc.phase_id = cp.id
       JOIN class_videos cv ON cv.week_id = wc.id
       WHERE cp.course_id IN (${inCourse})
       GROUP BY cp.course_id`,
      courseIds
    ) as RowDataPacket[];

    const phaseMap = Object.fromEntries(phaseCounts.map((r) => [r.course_id, r.phase_count]));
    const weekMap = Object.fromEntries(weekCounts.map((r) => [r.course_id, r.week_count]));
    const videoMap = Object.fromEntries(videoCounts.map((r) => [r.course_id, r.video_count]));
    const progressMap = Object.fromEntries(progressRows.map((r) => [r.course_id, r.completed_videos]));

    return NextResponse.json({
      success: true,
      courses: courses.map((course) => {
        const totalVideos = videoMap[course.id] || 0;
        const completedVideos = progressMap[course.id] || 0;
        const progress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
        return {
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          duration: course.duration,
          level: course.level,
          image: course.image,
          applicationId: course.application_id,
          status: "approved",
          enrolledAt: course.created_at,
          phases: phaseMap[course.id] || 0,
          weeks: weekMap[course.id] || 0,
          totalVideos,
          completedVideos,
          progress,
        };
      }),
    });
  } catch (error) {
    console.error("Error fetching my courses:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch courses" }, { status: 500 });
  }
}
