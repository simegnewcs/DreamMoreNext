import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// PUT /api/applications/[id] - Update application status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, admin_notes } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status is required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'under_review'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    await query(
      `UPDATE applications SET status = ?, admin_notes = ? WHERE id = ?`,
      [status, admin_notes || null, id]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Application updated successfully" 
    });

  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update application" },
      { status: 500 }
    );
  }
}

// GET /api/applications/[id] - Get single application
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const applications = await query(
      `SELECT 
        a.*,
        c.title as course_title,
        c.slug as course_slug
      FROM applications a
      LEFT JOIN courses c ON a.course_id = c.id
      WHERE a.id = ?`,
      [id]
    );

    if ((applications as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      application: (applications as any[])[0] 
    });

  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}
