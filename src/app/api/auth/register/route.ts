import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";
import dns from "dns";

async function isValidEmailDomain(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  const domain = normalizedEmail.split("@")[1];

  if (!domain) return false;

  const domainLabels = domain.split(".");
  if (domainLabels.length < 2 || domainLabels.some((label) => !label || !/^[a-z0-9-]+$/i.test(label))) {
    return false;
  }

  // 1. List of common disposable email domains
  const disposableDomains = new Set([
    "mailinator.com", "yopmail.com", "guerrillamail.com", "tempmail.com",
    "temp-mail.org", "10minutemail.com", "sharklasers.com", "dispostable.com",
    "maildrop.cc", "getnada.com", "burnermail.io", "trashmail.com",
    "generator.email", "fakemailgenerator.com", "mailnesia.com", "boun.cr",
    "yopmail.fr", "yopmail.net", "cool.fr.nf", "jetable.fr.nf", "courriel.fr.nf",
    "moncourrier.fr.nf", "monemail.fr.nf", "monadadresse.fr.nf"
  ]);

  if (disposableDomains.has(domain)) {
    return false;
  }

  // 2. Verify domain has active MX records
  const dnsCheck = dns.promises.resolveMx(domain)
    .then((records) => Boolean(records && records.length > 0))
    .catch(() => false);

  // Prevent slow or failing DNS lookups from unintentionally allowing registrations
  const timeout = new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(false), 1500);
  });

  return Promise.race([dnsCheck, timeout]);
}

// POST /api/auth/register
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role = 'student' } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate email domain
    const isValidDomain = await isValidEmailDomain(normalizedEmail);
    if (!isValidDomain) {
      return NextResponse.json(
        { success: false, error: "Suspicious or invalid email domain. Please use a valid email address." },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const result = await registerUser(normalizedEmail, password, name, role);

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Registration failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email to verify your account."
    });

  } catch (error: unknown) {
    console.error("Registration error:", error);
    if (error instanceof Error && error.message === 'Email already exists') {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}
