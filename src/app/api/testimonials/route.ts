import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// GET /api/testimonials — public, active only
export async function GET() {
  try {
    const rows = await query(
      `SELECT id, name, company, role, content, rating, image FROM testimonials WHERE is_active = 1 ORDER BY created_at DESC`
    ) as RowDataPacket[];
    return NextResponse.json({ success: true, testimonials: rows });
  } catch (error) {
    console.error("Testimonials GET error:", error);
    return NextResponse.json({ success: false, testimonials: [] }, { status: 500 });
  }
}
