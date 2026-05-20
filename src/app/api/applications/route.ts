import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/applications - Get all applications (Admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const courseId = searchParams.get("courseId");

    let sql = `
      SELECT 
        a.*,
        c.title as course_title,
        c.slug as course_slug
      FROM applications a
      LEFT JOIN courses c ON a.course_id = c.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (status) {
      sql += ` AND a.status = ?`;
      params.push(status);
    }

    if (courseId) {
      sql += ` AND a.course_id = ?`;
      params.push(courseId);
    }

    sql += ` ORDER BY a.created_at DESC`;

    const applications = await query(sql, params);

    return NextResponse.json({ 
      success: true, 
      applications 
    });

  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// POST /api/applications - Create new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      course_id,
      name,
      email,
      phone,
      education,
      experience,
      motivation,
      amount,
      payment_method,
      payment_screenshot
    } = body;

    // Validate required fields
    if (!course_id || !name || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert application
    const result = await query(
      `INSERT INTO applications (course_id, name, email, phone, education, experience, 
       motivation, amount, payment_method, payment_screenshot, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [course_id, name, email, phone, education, experience, motivation, 
       amount, payment_method, payment_screenshot]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Application submitted successfully",
      applicationId: (result as any).insertId
    });

  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
