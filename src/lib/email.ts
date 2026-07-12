import nodemailer from "nodemailer";

interface ContactMessagePayload {
  fullName: string;
  subject: string;
  message: string;
  userEmail?: string;
  isLoggedIn?: boolean;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: process.env.EMAIL_SECURE === "true" || Number(process.env.EMAIL_PORT || 587) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const senderAddress = process.env.EMAIL_FROM || `DreamMore <${process.env.EMAIL_USER}>`;

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  try {
    const info = await transporter.sendMail({
      from: senderAddress,
      replyTo: senderAddress,
      to: email,
      subject: "DreamMore: Please verify your email address",
      text: `Hi ${name},\n\nPlease verify your email address by visiting this link:\n${verificationUrl}\n\nThis link is valid for 24 hours.\n\nThanks,\nDreamMore Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a;">Welcome, ${name}!</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <p style="margin: 24px 0;">
            <a href="${verificationUrl}" style="background: #f47822; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 8px; display: inline-block;">
              Verify Email
            </a>
          </p>
          <p>This link is valid for 24 hours.</p>
          <p style="font-size: 12px; color: #64748b;">DreamMore Team</p>
        </div>
      `,
      headers: {
        "Auto-Submitted": "auto-generated",
      },
    });

    return Boolean(info.messageId);
  } catch (error) {
    console.error("Failed to send verification email:", error);

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `Development email fallback enabled. Verification link for ${email}: ${verificationUrl}`
      );
      return true;
    }

    return false;
  }
}

export async function sendContactMessage(payload: ContactMessagePayload): Promise<boolean> {
  const toAddress = process.env.CONTACT_TO_EMAIL || "dreammoreschool@gmail.com";
  const fromAddress = senderAddress;

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      replyTo: payload.userEmail || fromAddress,
      to: toAddress,
      subject: `DreamMore Contact Form: ${payload.subject}`,
      text: `New contact form message from ${payload.fullName}\n\nEmail: ${payload.userEmail || "Not provided"}\nLogged in: ${payload.isLoggedIn ? "Yes" : "No"}\n\nSubject: ${payload.subject}\n\nMessage:\n${payload.message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
          <h2 style="color: #0f172a;">New Contact Form Message</h2>
          <p><strong>Name:</strong> ${payload.fullName}</p>
          <p><strong>Email:</strong> ${payload.userEmail || "Not provided"}</p>
          <p><strong>Logged in:</strong> ${payload.isLoggedIn ? "Yes" : "No"}</p>
          <p><strong>Subject:</strong> ${payload.subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${payload.message}</div>
        </div>
      `,
      headers: {
        "Auto-Submitted": "auto-generated",
      },
    });

    return Boolean(info.messageId);
  } catch (error) {
    console.error("Failed to send contact message email:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  try {
    const info = await transporter.sendMail({
      from: senderAddress,
      replyTo: senderAddress,
      to: email,
      subject: "DreamMore: Reset your password",
      text: `Hi ${name},\n\nYou requested a password reset.\nPlease use this link to set a new password:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.\n\nThanks,\nDreamMore Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a;">Reset your password</h2>
          <p>Hello ${name},</p>
          <p>You requested a password reset. Click the button below to choose a new password:</p>
          <p style="margin: 24px 0;">
            <a href="${resetUrl}" style="background: #f47822; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 8px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p>If you did not request this, you can ignore this email.</p>
          <p style="font-size: 12px; color: #64748b;">DreamMore Team</p>
        </div>
      `,
      headers: {
        "Auto-Submitted": "auto-generated",
      },
    });

    return Boolean(info.messageId);
  } catch (error) {
    console.error("Failed to send password reset email:", error);

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `Development password reset fallback enabled. Reset link for ${email}: ${resetUrl}`
      );
      return true;
    }

    return false;
  }
}
