import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// Auto-create table on first use
async function ensureTable() {
  await query(`CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    issued_by INT,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    status ENUM('active','revoked') DEFAULT 'active',
    revoked_at TIMESTAMP NULL,
    revoke_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_course (course_id),
    INDEX idx_status (status),
    INDEX idx_cert_number (certificate_number)
  )`);
}

function generateCertNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).toUpperCase().slice(2, 8);
  return `DM-${year}-${rand}`;
}

// GET /api/admin/certificates — list all with filters
export async function GET(request: NextRequest) {
  try {
    await ensureTable();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const courseId = searchParams.get("courseId") || "all";

    let sql = `
      SELECT
        c.id, c.certificate_number, c.status, c.issued_at, c.revoked_at,
        c.revoke_reason, c.notes, c.expires_at,
        u.id as user_id, u.name as student_name, u.email as student_email, u.avatar as student_avatar,
        co.id as course_id, co.title as course_title, co.slug as course_slug, co.image as course_image
      FROM certificates c
      JOIN users u ON c.user_id = u.id
      JOIN courses co ON c.course_id = co.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      sql += ` AND (u.name LIKE ? OR u.email LIKE ? OR c.certificate_number LIKE ? OR co.title LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    if (status !== "all") {
      sql += ` AND c.status = ?`;
      params.push(status);
    }
    if (courseId !== "all") {
      sql += ` AND c.course_id = ?`;
      params.push(courseId);
    }

    sql += ` ORDER BY c.issued_at DESC`;

    const certificates = await query(sql, params) as RowDataPacket[];

    // Stats
    const statsRows = await query(`
      SELECT
        COUNT(*) as total,
        SUM(status = 'active') as active,
        SUM(status = 'revoked') as revoked,
        COUNT(DISTINCT course_id) as courses_with_certs
      FROM certificates
    `) as RowDataPacket[];
    const stats = statsRows[0] || { total: 0, active: 0, revoked: 0, courses_with_certs: 0 };

    // All courses that have at least one approved student (for issue form)
    const courses = await query(`
      SELECT DISTINCT co.id, co.title, co.slug
      FROM courses co
      JOIN applications a ON a.course_id = co.id
      WHERE a.status = 'approved'
      ORDER BY co.title ASC
    `) as RowDataPacket[];

    return NextResponse.json({ success: true, certificates, stats, courses });
  } catch (error) {
    console.error("Certificates GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch certificates" }, { status: 500 });
  }
}

// POST /api/admin/certificates — issue certificate
export async function POST(request: NextRequest) {
  try {
    await ensureTable();
    const body = await request.json();
    const { user_id, course_id, notes, expires_at } = body;

    if (!user_id || !course_id) {
      return NextResponse.json({ success: false, error: "user_id and course_id are required" }, { status: 400 });
    }

    // Check not already issued and active
    const existing = await query(
      `SELECT id FROM certificates WHERE user_id = ? AND course_id = ? AND status = 'active'`,
      [user_id, course_id]
    ) as RowDataPacket[];
    if (existing.length) {
      return NextResponse.json({ success: false, error: "Certificate already issued for this student and course" }, { status: 409 });
    }

    let certNumber = generateCertNumber();
    // Ensure uniqueness
    let attempts = 0;
    while (attempts < 5) {
      const check = await query(`SELECT id FROM certificates WHERE certificate_number = ?`, [certNumber]) as RowDataPacket[];
      if (!check.length) break;
      certNumber = generateCertNumber();
      attempts++;
    }

    const result = await query(
      `INSERT INTO certificates (certificate_number, user_id, course_id, notes, expires_at) VALUES (?, ?, ?, ?, ?)`,
      [certNumber, user_id, course_id, notes || null, expires_at || null]
    ) as any;

    return NextResponse.json({ success: true, id: result.insertId, certificate_number: certNumber });
  } catch (error) {
    console.error("Certificates POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to issue certificate" }, { status: 500 });
  }
}

// DELETE /api/admin/certificates?id=X — revoke
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const reason = searchParams.get("reason") || null;

    if (!id) return NextResponse.json({ success: false, error: "id required" }, { status: 400 });

    await query(
      `UPDATE certificates SET status = 'revoked', revoked_at = NOW(), revoke_reason = ? WHERE id = ?`,
      [reason, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Certificates DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to revoke certificate" }, { status: 500 });
  }
}
