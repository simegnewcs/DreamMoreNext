import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

interface CourseRow extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  level: string;
  category: string;
  instructor: string;
  duration: string;
  price: number;
  status: string;
  total_enrolled: number;
  total_phases: number;
  total_weeks: number;
  total_videos: number;
  total_notes: number;
  total_assignments: number;
  created_at: string;
}

interface EnrolledStudentRow extends RowDataPacket {
  application_id: number;
  student_name: string;
  student_email: string;
  course_id: number;
  course_title: string;
  course_slug: string;
  amount: number;
  enrolled_at: string;
  status: string;
}

// GET /api/admin/lms — full LMS management overview
export async function GET() {
  try {
    // Courses with LMS content counts
    const courses = await query(
      `SELECT 
        c.id,
        c.slug,
        c.title,
        c.level,
        c.category,
        c.instructor,
        c.duration,
        c.price,
        c.status,
        c.created_at,
        COUNT(DISTINCT a.id) as total_enrolled,
        COUNT(DISTINCT cp.id) as total_phases,
        COUNT(DISTINCT wc.id) as total_weeks,
        COUNT(DISTINCT cv.id) as total_videos,
        COUNT(DISTINCT cn.id) as total_notes,
        COUNT(DISTINCT asn.id) as total_assignments
      FROM courses c
      LEFT JOIN applications a ON c.id = a.course_id AND a.status = 'approved'
      LEFT JOIN course_phases cp ON c.id = cp.course_id
      LEFT JOIN weekly_content wc ON cp.id = wc.phase_id
      LEFT JOIN class_videos cv ON wc.id = cv.week_id
      LEFT JOIN class_notes cn ON wc.id = cn.week_id
      LEFT JOIN assignments asn ON wc.id = asn.week_id
      GROUP BY c.id
      ORDER BY c.created_at DESC`,
      []
    ) as CourseRow[];

    // Enrolled students list
    const enrolledStudents = await query(
      `SELECT
        a.id as application_id,
        a.name as student_name,
        a.email as student_email,
        c.id as course_id,
        c.title as course_title,
        c.slug as course_slug,
        a.amount,
        a.updated_at as enrolled_at,
        a.status
      FROM applications a
      JOIN courses c ON a.course_id = c.id
      WHERE a.status = 'approved'
      ORDER BY a.updated_at DESC
      LIMIT 50`,
      []
    ) as EnrolledStudentRow[];

    // Summary stats
    const totalEnrolled = enrolledStudents.length;
    const totalCourses = courses.length;
    const totalVideos = courses.reduce((s, c) => s + (c.total_videos || 0), 0);
    const totalAssignments = courses.reduce((s, c) => s + (c.total_assignments || 0), 0);

    return NextResponse.json({
      success: true,
      summary: { totalCourses, totalEnrolled, totalVideos, totalAssignments },
      courses: courses.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        level: c.level,
        category: c.category,
        instructor: c.instructor,
        duration: c.duration,
        price: c.price,
        status: c.status,
        createdAt: c.created_at,
        stats: {
          enrolled: Number(c.total_enrolled),
          phases: Number(c.total_phases),
          weeks: Number(c.total_weeks),
          videos: Number(c.total_videos),
          notes: Number(c.total_notes),
          assignments: Number(c.total_assignments),
        },
      })),
      enrolledStudents: enrolledStudents.map((s) => ({
        applicationId: s.application_id,
        name: s.student_name,
        email: s.student_email,
        courseId: s.course_id,
        courseTitle: s.course_title,
        courseSlug: s.course_slug,
        amount: s.amount,
        enrolledAt: s.enrolled_at,
        status: s.status,
      })),
    });
  } catch (error) {
    console.error("Error fetching LMS data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch LMS data" },
      { status: 500 }
    );
  }
}
