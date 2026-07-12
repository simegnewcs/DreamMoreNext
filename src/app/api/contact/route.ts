import { NextResponse } from "next/server";
import { sendContactMessage } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const userEmail = typeof body?.userEmail === "string" ? body.userEmail.trim() : "";
    const isLoggedIn = Boolean(body?.isLoggedIn);

    if (!fullName || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Full name, subject, and message are required." },
        { status: 400 }
      );
    }

    const sent = await sendContactMessage({
      fullName,
      subject,
      message,
      userEmail,
      isLoggedIn,
    });

    if (!sent) {
      return NextResponse.json(
        { success: false, error: "We could not send your message right now. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact form submission failed", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong while sending your message." },
      { status: 500 }
    );
  }
}
