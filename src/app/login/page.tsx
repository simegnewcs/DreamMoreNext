import type { Metadata } from "next";
import LoginClient from "@/components/auth/LoginClient";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your DreamMore account",
};

export default function LoginPage() {
  return <LoginClient />;
}
