import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

interface ApplicationRow extends RowDataPacket {
  id: number;
  status: string;
  created_at: string;
}

// GET /api/applications/check?courseId=123&email=user@example.com
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const email = searchParams.get("email");

    if (!courseId || !email) {
      return NextResponse.json(
        { success: false, error: "Missing courseId or email" },
        { status: 400 }
      );
    }

    // Check for existing application
    const applications = await query(
      `SELECT id, status, created_at FROM applications 
       WHERE course_id = ? AND email = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [courseId, email]
    ) as ApplicationRow[];

    if (applications.length > 0) {
      const application = applications[0];
      return NextResponse.json({
        success: true,
        hasApplied: true,
        application: {
          id: application.id,
          status: application.status,
          createdAt: application.created_at,
        },
      });
    }

    return NextResponse.json({
      success: true,
      hasApplied: false,
      application: null,
    });
  } catch (error) {
    console.error("Error checking application status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check application status" },
      { status: 500 }
    );
  }
}
