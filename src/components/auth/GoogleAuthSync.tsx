"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function GoogleAuthSync() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    try {
      const existing = localStorage.getItem("user");
      const existingParsed = existing ? JSON.parse(existing) : null;

      // Only sync if not already set from email login
      if (!existingParsed || existingParsed.provider === "google") {
        const user = session.user as any;
        localStorage.setItem("user", JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.image,
          role: user.role || "student",
          provider: "google",
        }));
        if (user.dbToken) {
          localStorage.setItem("token", user.dbToken);
        }
        window.dispatchEvent(new Event("userUpdated"));
      }
    } catch {}
  }, [status, session, router]);

  return null;
}
