"use client";

import { SessionProvider } from "next-auth/react";
import GoogleAuthSync from "@/components/auth/GoogleAuthSync";

export default function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GoogleAuthSync />
      {children}
    </SessionProvider>
  );
}
