import type { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "@/components/auth/LoginClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your DreamMore account",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <LoginClient />
    </Suspense>
  );
}
