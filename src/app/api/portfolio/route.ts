import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// GET /api/portfolio — public, returns only active projects
export async function GET() {
  try {
    const projects = await query(
      `SELECT id, title, category, description, technologies, image, live_url, case_study_url
       FROM portfolio
       WHERE is_active = 1
       ORDER BY created_at DESC`
    ) as RowDataPacket[];

    const parsed = projects.map((p: any) => ({
      id: p.id,
      title: p.title,
      category: p.category || "",
      description: p.description || "",
      technologies: typeof p.technologies === "string"
        ? JSON.parse(p.technologies || "[]")
        : (p.technologies || []),
      image: p.image || null,
      liveUrl: p.live_url || null,
      caseStudyUrl: p.case_study_url || null,
    }));

    return NextResponse.json({ success: true, projects: parsed });
  } catch (error) {
    console.error("Public portfolio GET error:", error);
    return NextResponse.json({ success: false, projects: [] }, { status: 500 });
  }
}
