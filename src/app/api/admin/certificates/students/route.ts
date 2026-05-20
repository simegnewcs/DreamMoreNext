import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// GET /api/admin/certificates/students?courseId=X
// Returns approved students for a course who don't have an active certificate yet
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    if (!courseId) return NextResponse.json({ success: false, error: "courseId required" }, { status: 400 });

    const students = await query(`
      SELECT u.id, u.name, u.email, u.avatar,
        (SELECT cert.id FROM certificates cert WHERE cert.user_id = u.id AND cert.course_id = ? AND cert.status = 'active' LIMIT 1) as has_cert
      FROM users u
      JOIN applications a ON a.user_id = u.id
      WHERE a.course_id = ? AND a.status = 'approved'
      ORDER BY u.name ASC
    `, [courseId, courseId]) as RowDataPacket[];

    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error("Certificate students error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch students" }, { status: 500 });
  }
}
