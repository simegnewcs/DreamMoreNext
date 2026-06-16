import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: process.env.EMAIL_SECURE === "true" || Number(process.env.EMAIL_PORT || 587) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email address",
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
        </div>
      `,
    });

    return Boolean(info.messageId);
  } catch (error) {
    console.error("Failed to send verification email:", error);

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `Development email fallback enabled. Verification link for ${email}: ${baseUrl}/verify-email?token=${token}`
      );
      return true;
    }

    return false;
  }
}
