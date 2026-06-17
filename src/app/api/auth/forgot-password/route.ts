import { NextRequest, NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/auth";

// POST /api/auth/forgot-password
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

    const success = await requestPasswordReset(email);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Unable to send reset email" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset email sent successfully"
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}
