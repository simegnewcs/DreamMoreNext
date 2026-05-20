import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

async function ensureTable() {
  await query(`CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    bio TEXT,
    specialties JSON,
    image VARCHAR(500),
    linkedin VARCHAR(500),
    twitter VARCHAR(500),
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order (order_index),
    INDEX idx_active (is_active)
  )`);
}

function parse(row: any) {
  return {
    ...row,
    specialties: typeof row.specialties === "string"
      ? JSON.parse(row.specialties || "[]")
      : (row.specialties || []),
  };
}

// GET /api/admin/team
export async function GET() {
  try {
    await ensureTable();
    const rows = await query(`SELECT * FROM team_members ORDER BY order_index ASC, created_at ASC`) as RowDataPacket[];
    const stats = await query(`SELECT COUNT(*) as total, SUM(is_active) as active, SUM(!is_active) as hidden FROM team_members`) as RowDataPacket[];
    return NextResponse.json({ success: true, members: rows.map(parse), stats: stats[0] || { total: 0, active: 0, hidden: 0 } });
  } catch (error) {
    console.error("Team GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

// POST /api/admin/team
export async function POST(request: NextRequest) {
  try {
    await ensureTable();
    const { name, position, bio, specialties, image, linkedin, twitter, order_index, is_active } = await request.json();
    if (!name) return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    const result = await query(
      `INSERT INTO team_members (name, position, bio, specialties, image, linkedin, twitter, order_index, is_active) VALUES (?,?,?,?,?,?,?,?,?)`,
      [name, position || null, bio || null, JSON.stringify(specialties || []), image || null, linkedin || null, twitter || null, order_index ?? 0, is_active !== false ? 1 : 0]
    ) as any;
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Team POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create" }, { status: 500 });
  }
}

// PATCH /api/admin/team?id=X
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "id required" }, { status: 400 });
    const { name, position, bio, specialties, image, linkedin, twitter, order_index, is_active } = await request.json();
    await query(
      `UPDATE team_members SET name=?, position=?, bio=?, specialties=?, image=?, linkedin=?, twitter=?, order_index=?, is_active=? WHERE id=?`,
      [name, position || null, bio || null, JSON.stringify(specialties || []), image || null, linkedin || null, twitter || null, order_index ?? 0, is_active !== false ? 1 : 0, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Team PATCH error:", error);
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}

// DELETE /api/admin/team?id=X
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "id required" }, { status: 400 });
    await query(`DELETE FROM team_members WHERE id=?`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Team DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}
