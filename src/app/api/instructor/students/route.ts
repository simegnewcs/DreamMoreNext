import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// GET /api/instructor/students?instructor_id=X
// Returns students enrolled in courses assigned to this instructor
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const instructor_id = searchParams.get("instructor_id");
    if (!instructor_id) {
      return NextResponse.json({ success: false, error: "instructor_id required" }, { status: 400 });
    }

    const students = await query(
      `SELECT
         a.id        AS application_id,
         a.name,
         a.email,
         a.phone,
         a.amount,
         a.payment_method,
         a.status    AS enrollment_status,
         a.updated_at AS enrolled_at,
         a.created_at,
         c.title     AS course_title,
         c.slug      AS course_slug,
         u.id        AS user_id,
         u.avatar,
         u.status    AS user_status
       FROM instructor_assignments ia
       JOIN courses c ON c.id = ia.course_id
       JOIN applications a ON a.course_id = c.id AND a.status = 'approved'
       LEFT JOIN users u ON u.id = a.user_id OR (a.user_id IS NULL AND u.email = a.email)
       WHERE ia.instructor_id = ?
       ORDER BY a.updated_at DESC`,
      [instructor_id]
    ) as RowDataPacket[];

    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error("Instructor students GET error:", error);
    return NextResponse.json({ success: false, students: [] }, { status: 500 });
  }
}
