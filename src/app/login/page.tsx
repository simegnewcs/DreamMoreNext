import type { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "@/components/auth/LoginClient";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your DreamMore account",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}
