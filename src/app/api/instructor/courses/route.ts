import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// GET /api/instructor/courses?instructor_id=X
// Returns only courses assigned to this instructor
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const instructor_id = searchParams.get("instructor_id");
    if (!instructor_id) {
      return NextResponse.json({ success: false, error: "instructor_id required" }, { status: 400 });
    }

    const courses = await query(
      `SELECT c.id, c.title, c.slug, c.description, c.short_description,
              c.image, c.duration, c.level, c.category, c.status,
              c.students_count, c.rating, c.price, c.currency,
              ia.assigned_at
       FROM instructor_assignments ia
       JOIN courses c ON c.id = ia.course_id
       WHERE ia.instructor_id = ?
       ORDER BY c.title ASC`,
      [instructor_id]
    ) as RowDataPacket[];

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error("Instructor courses GET error:", error);
    return NextResponse.json({ success: false, courses: [] }, { status: 500 });
  }
}
