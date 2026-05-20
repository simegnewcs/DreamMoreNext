import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

interface ActivityRow extends RowDataPacket {
  id: number;
  type: string;
  user_name: string;
  detail: string;
  created_at: string;
}

// GET /api/admin/recent-activity
// Aggregates recent events from applications, payments, and submissions
export async function GET() {
  try {
    // Recent applications (last 10)
    const applications = await query(
      `SELECT 
        a.id,
        'application' as type,
        a.name as user_name,
        c.title as detail,
        a.status,
        a.created_at
      FROM applications a
      LEFT JOIN courses c ON a.course_id = c.id
      ORDER BY a.created_at DESC
      LIMIT 10`,
      []
    ) as ActivityRow[];

    // Recent approved payments (last 10)
    const payments = await query(
      `SELECT 
        a.id,
        'payment' as type,
        a.name as user_name,
        c.title as detail,
        a.amount,
        a.status,
        a.updated_at as created_at
      FROM applications a
      LEFT JOIN courses c ON a.course_id = c.id
      WHERE a.status = 'approved'
      ORDER BY a.updated_at DESC
      LIMIT 10`,
      []
    ) as ActivityRow[];

    // Recent submissions — only query if the table actually exists
    let submissions: ActivityRow[] = [];
    try {
      const tableCheck = await query(
        `SELECT COUNT(*) as cnt FROM information_schema.tables
         WHERE table_schema = DATABASE() AND table_name = 'submissions'`
      ) as RowDataPacket[];
      if (tableCheck[0]?.cnt > 0) {
        submissions = await query(
          `SELECT 
            s.id,
            'submission' as type,
            u.name as user_name,
            CONCAT(c.title, ' - Assignment') as detail,
            s.status,
            s.created_at
          FROM submissions s
          LEFT JOIN users u ON s.user_id = u.id
          LEFT JOIN assignments a ON s.assignment_id = a.id
          LEFT JOIN courses c ON a.course_id = c.id
          ORDER BY s.created_at DESC
          LIMIT 10`,
          []
        ) as ActivityRow[];
      }
    } catch {
      // ignore
    }

    // Merge, sort by date, take top 15
    const all = [
      ...applications.map((r) => ({
        id: `app-${r.id}`,
        type: r.status === "approved" ? "approval" : r.status === "rejected" ? "rejection" : "application",
        userName: r.user_name,
        detail: r.detail || "a course",
        status: r.status,
        createdAt: r.created_at,
      })),
      ...payments.map((r: any) => ({
        id: `pay-${r.id}`,
        type: "payment",
        userName: r.user_name,
        detail: r.detail || "a course",
        amount: r.amount,
        status: "approved",
        createdAt: r.created_at,
      })),
      ...submissions.map((r) => ({
        id: `sub-${r.id}`,
        type: "submission",
        userName: r.user_name,
        detail: r.detail || "an assignment",
        status: r.status,
        createdAt: r.created_at,
      })),
    ]
      .filter((a) => a.createdAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 15);

    return NextResponse.json({ success: true, activities: all });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recent activity" },
      { status: 500 }
    );
  }
}
