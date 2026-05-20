import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// GET /api/admin/portfolio
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const status = searchParams.get("status") || "all";

    let sql = `SELECT * FROM portfolio WHERE 1=1`;
    const params: any[] = [];

    if (search) {
      sql += ` AND (title LIKE ? OR description LIKE ? OR category LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    if (category !== "all") {
      sql += ` AND category = ?`;
      params.push(category);
    }
    if (status === "active") { sql += ` AND is_active = 1`; }
    else if (status === "inactive") { sql += ` AND is_active = 0`; }

    sql += ` ORDER BY created_at DESC`;

    const projects = await query(sql, params) as RowDataPacket[];

    // Parse JSON technologies field
    const parsed = projects.map((p: any) => ({
      ...p,
      technologies: typeof p.technologies === "string"
        ? JSON.parse(p.technologies || "[]")
        : (p.technologies || []),
    }));

    const categories = await query(
      `SELECT DISTINCT category FROM portfolio WHERE category IS NOT NULL ORDER BY category ASC`
    ) as RowDataPacket[];

    const stats = await query(
      `SELECT COUNT(*) as total, SUM(is_active) as active, SUM(!is_active) as inactive FROM portfolio`
    ) as RowDataPacket[];

    return NextResponse.json({
      success: true,
      projects: parsed,
      categories: categories.map((c: any) => c.category),
      stats: stats[0] || { total: 0, active: 0, inactive: 0 },
    });
  } catch (error) {
    console.error("Portfolio GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch portfolio" }, { status: 500 });
  }
}

// POST /api/admin/portfolio — create
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, description, technologies, image, live_url, case_study_url, is_active } = body;
    if (!title) return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });

    const result = await query(
      `INSERT INTO portfolio (title, category, description, technologies, image, live_url, case_study_url, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        category || null,
        description || null,
        JSON.stringify(technologies || []),
        image || null,
        live_url || null,
        case_study_url || null,
        is_active !== false ? 1 : 0,
      ]
    ) as any;

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("Portfolio POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 });
  }
}

// PATCH /api/admin/portfolio?id=X — update
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "id required" }, { status: 400 });

    const body = await request.json();
    const { title, category, description, technologies, image, live_url, case_study_url, is_active } = body;

    await query(
      `UPDATE portfolio SET title=?, category=?, description=?, technologies=?, image=?, live_url=?, case_study_url=?, is_active=? WHERE id=?`,
      [
        title,
        category || null,
        description || null,
        JSON.stringify(technologies || []),
        image || null,
        live_url || null,
        case_study_url || null,
        is_active !== false ? 1 : 0,
        id,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Portfolio PATCH error:", error);
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE /api/admin/portfolio?id=X
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "id required" }, { status: 400 });
    await query(`DELETE FROM portfolio WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Portfolio DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 });
  }
}
