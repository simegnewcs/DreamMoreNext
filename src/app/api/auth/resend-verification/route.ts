import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

// POST /api/auth/resend-verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email (Removed the non-existent 'status' column check)
    const users = await query(
      `SELECT id, email, name, email_verified FROM users WHERE email = ?`,
      [email]
    );

    if ((users as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const user = (users as any[])[0];

    // Check if email is already verified (Handles both Boolean and MySQL TINYINT 1/0)
    if (user.email_verified === true || user.email_verified === 1) {
      return NextResponse.json(
        { success: false, error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Format JavaScript Date into a MySQL-compatible TIMESTAMP string (YYYY-MM-DD HH:MM:SS)
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    // Update user with new verification token
    await query(
      `UPDATE users SET verification_token = ?, verification_expires_at = ? WHERE id = ?`,
      [verificationToken, verificationExpiresAt, user.id]
    );

    // Send verification email
    const emailSent = await sendVerificationEmail(user.email, user.name, verificationToken);

    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully"
    });

  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}