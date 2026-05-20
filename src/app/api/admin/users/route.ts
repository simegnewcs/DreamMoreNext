import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/admin/users - Get all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const limitVal = searchParams.get("limit");
    const offsetVal = searchParams.get("offset");
    let limit = limitVal ? parseInt(limitVal) : 100;
    let offset = offsetVal ? parseInt(offsetVal) : 0;
    
    // Ensure valid numbers
    if (isNaN(limit) || limit < 1) limit = 100;
    if (isNaN(offset) || offset < 0) offset = 0;
    if (limit > 1000) limit = 1000;

    // Build WHERE clause dynamically
    const whereConditions: string[] = [];
    const params: any[] = [];

    if (role) {
      whereConditions.push("role = ?");
      params.push(role);
    }

    if (status) {
      whereConditions.push("status = ?");
      params.push(status);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const countResult = await query(countSql, [...params]);
    const total = (countResult as any[])[0]?.total || 0;

    // Get users with pagination - use string interpolation for LIMIT/OFFSET to avoid prepared statement issues
    const usersSql = `
      SELECT 
        id, 
        email, 
        name, 
        role, 
        phone,
        avatar,
        status,
        created_at,
        updated_at
      FROM users 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;

    const users = await query(usersSql, [...params]);

    return NextResponse.json({
      success: true,
      users: users,
      total: total,
      pagination: {
        limit,
        offset,
        total
      }
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new user (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role = 'student', phone } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Hash password
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (email, password, name, role, phone, status) VALUES (?, ?, ?, ?, ?, 'active')`,
      [email, hashedPassword, name, role, phone]
    );

    const userId = (result as any).insertId;

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      userId
    });

  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
