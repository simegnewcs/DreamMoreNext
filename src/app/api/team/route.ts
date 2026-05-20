import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// GET /api/team — public, active only
export async function GET() {
  try {
    const rows = await query(
      `SELECT id, name, position, bio, specialties, image, linkedin, twitter, order_index
       FROM team_members WHERE is_active = 1 ORDER BY order_index ASC, created_at ASC`
    ) as RowDataPacket[];

    const members = rows.map((r: any) => ({
      ...r,
      specialties: typeof r.specialties === "string"
        ? JSON.parse(r.specialties || "[]")
        : (r.specialties || []),
    }));

    return NextResponse.json({ success: true, members });
  } catch (error) {
    console.error("Public team GET error:", error);
    return NextResponse.json({ success: false, members: [] }, { status: 500 });
  }
}
