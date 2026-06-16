import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface UserRow {
  id: number;
  email: string;
  verification_token: string | null;
  verification_expires_at: string | Date | null;
  email_verified: number | boolean;
}

// POST /api/auth/verify-email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { token?: string };
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Verification token is required" },
        { status: 400 }
      );
    }

    const users = await query(
      `SELECT id, email, verification_token, verification_expires_at, email_verified FROM users WHERE verification_token = ?`,
      [token]
    ) as UserRow[];

    if (!users.length) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification link" },
        { status: 400 }
      );
    }

    const user = users[0];

    if (user.email_verified === true || user.email_verified === 1) {
      return NextResponse.json(
        { success: true, message: "Email already verified" }
      );
    }

    if (!user.verification_expires_at || new Date(user.verification_expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: "Verification link has expired" },
        { status: 400 }
      );
    }

    await query(
      `UPDATE users SET email_verified = 1, verification_token = NULL, verification_expires_at = NULL WHERE id = ?`,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      message: "Email verified successfully"
    });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
