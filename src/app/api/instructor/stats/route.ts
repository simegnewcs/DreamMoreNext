import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// GET /api/instructor/stats?instructor_id=X
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const instructor_id = searchParams.get("instructor_id");
    if (!instructor_id) {
      return NextResponse.json({ success: false, error: "instructor_id required" }, { status: 400 });
    }

    const [coursesRow] = await query(
      `SELECT COUNT(*) as total FROM instructor_assignments WHERE instructor_id = ?`,
      [instructor_id]
    ) as RowDataPacket[];

    const [studentsRow] = await query(
      `SELECT COUNT(DISTINCT a.email) as total
       FROM instructor_assignments ia
       JOIN applications a ON a.course_id = ia.course_id AND a.status = 'approved'
       WHERE ia.instructor_id = ?`,
      [instructor_id]
    ) as RowDataPacket[];

    const recentEnrollments = await query(
      `SELECT a.name, a.email, c.title as course_title, a.updated_at as verified_at
       FROM instructor_assignments ia
       JOIN applications a ON a.course_id = ia.course_id AND a.status = 'approved'
       JOIN courses c ON c.id = ia.course_id
       WHERE ia.instructor_id = ?
       ORDER BY a.updated_at DESC LIMIT 5`,
      [instructor_id]
    ) as RowDataPacket[];

    return NextResponse.json({
      success: true,
      stats: {
        total_courses: coursesRow?.total || 0,
        total_students: studentsRow?.total || 0,
      },
      recent_enrollments: recentEnrollments,
    });
  } catch (error) {
    console.error("Instructor stats GET error:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
