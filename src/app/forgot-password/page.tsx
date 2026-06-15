import type { Metadata } from "next";
import { Suspense } from "react";
import ForgotPasswordClient from "@/components/auth/ForgotPasswordClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your DreamMore account password",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <ForgotPasswordClient />
    </Suspense>
  );
}
