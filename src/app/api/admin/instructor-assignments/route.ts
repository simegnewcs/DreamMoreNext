import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

async function ensureTable() {
  await query(`CREATE TABLE IF NOT EXISTS instructor_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    instructor_id INT NOT NULL,
    course_id INT NOT NULL,
    assigned_by INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_instructor_course (instructor_id, course_id),
    INDEX idx_instructor (instructor_id),
    INDEX idx_course (course_id)
  )`);
}

// GET /api/admin/instructor-assignments
// Returns all instructors with their assigned courses, plus all courses list
export async function GET() {
  try {
    await ensureTable();

    const instructors = await query(
      `SELECT id, name, email, avatar, status, created_at FROM users WHERE role = 'instructor' ORDER BY name ASC`
    ) as RowDataPacket[];

    const courses = await query(
      `SELECT id, title, slug, category, level, status FROM courses ORDER BY title ASC`
    ) as RowDataPacket[];

    const assignments = await query(
      `SELECT ia.instructor_id, ia.course_id, ia.assigned_at,
              u.name AS assigned_by_name
       FROM instructor_assignments ia
       LEFT JOIN users u ON u.id = ia.assigned_by
       ORDER BY ia.assigned_at DESC`
    ) as RowDataPacket[];

    return NextResponse.json({ success: true, instructors, courses, assignments });
  } catch (error) {
    console.error("Instructor assignments GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

// POST /api/admin/instructor-assignments
// Body: { instructor_id, course_ids: number[], assigned_by? }
export async function POST(request: NextRequest) {
  try {
    await ensureTable();
    const { instructor_id, course_ids, assigned_by } = await request.json();
    if (!instructor_id || !Array.isArray(course_ids)) {
      return NextResponse.json({ success: false, error: "instructor_id and course_ids required" }, { status: 400 });
    }

    // Remove all current assignments for this instructor, then re-insert
    await query(`DELETE FROM instructor_assignments WHERE instructor_id = ?`, [instructor_id]);

    if (course_ids.length > 0) {
      for (const cid of course_ids) {
        await query(
          `INSERT IGNORE INTO instructor_assignments (instructor_id, course_id, assigned_by) VALUES (?, ?, ?)`,
          [instructor_id, cid, assigned_by || null]
        );
      }
    }

    return NextResponse.json({ success: true, assigned: course_ids.length });
  } catch (error) {
    console.error("Instructor assignments POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 });
  }
}
