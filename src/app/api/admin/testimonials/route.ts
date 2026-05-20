import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// GET /api/admin/testimonials
export async function GET() {
  try {
    const rows = await query(
      `SELECT * FROM testimonials ORDER BY created_at DESC`
    ) as RowDataPacket[];
    const stats = await query(
      `SELECT COUNT(*) as total, SUM(is_active) as active, SUM(!is_active) as hidden FROM testimonials`
    ) as RowDataPacket[];
    return NextResponse.json({ success: true, testimonials: rows, stats: stats[0] || { total: 0, active: 0, hidden: 0 } });
  } catch (error) {
    console.error("Admin testimonials GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

// POST /api/admin/testimonials — create
export async function POST(request: NextRequest) {
  try {
    const { name, company, role, content, rating, image, is_active } = await request.json();
    if (!name || !content) return NextResponse.json({ success: false, error: "Name and content required" }, { status: 400 });
    const result = await query(
      `INSERT INTO testimonials (name, company, role, content, rating, image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, company || null, role || null, content, rating ?? 5, image || null, is_active !== false ? 1 : 0]
    ) as any;
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Admin testimonials POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create" }, { status: 500 });
  }
}

// PATCH /api/admin/testimonials?id=X — update
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "id required" }, { status: 400 });
    const { name, company, role, content, rating, image, is_active } = await request.json();
    await query(
      `UPDATE testimonials SET name=?, company=?, role=?, content=?, rating=?, image=?, is_active=? WHERE id=?`,
      [name, company || null, role || null, content, rating ?? 5, image || null, is_active !== false ? 1 : 0, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin testimonials PATCH error:", error);
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}

// DELETE /api/admin/testimonials?id=X
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "id required" }, { status: 400 });
    await query(`DELETE FROM testimonials WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin testimonials DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}
