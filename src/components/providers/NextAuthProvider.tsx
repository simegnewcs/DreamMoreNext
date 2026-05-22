"use client";

import { SessionProvider } from "next-auth/react";
import GoogleAuthSync from "@/components/auth/GoogleAuthSync";

export default function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <GoogleAuthSync />
      {children}
    </SessionProvider>
  );
}
