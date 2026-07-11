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
      const user = session.user as any;
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.image,
        role: user.role || "student",
        provider: "google",
      };

      // Only sync if not already set from email login
      if (!existingParsed || existingParsed.provider === "google") {
        localStorage.setItem("user", JSON.stringify(userData));
        if (user.dbToken) {
          localStorage.setItem("token", user.dbToken);
        }

        const cookieOptions = [
          "path=/",
          "max-age=604800",
          "SameSite=Lax",
        ];
        if (window.location.protocol === "https:") {
          cookieOptions.push("Secure");
        }

        document.cookie = `user=${encodeURIComponent(JSON.stringify(userData))}; ${cookieOptions.join("; ")}`;
        if (user.dbToken) {
          document.cookie = `token=${encodeURIComponent(user.dbToken)}; ${cookieOptions.join("; ")}`;
        }

        window.dispatchEvent(new Event("userUpdated"));
      }
    } catch (error) {
      console.error("GoogleAuthSync error:", error);
    }
  }, [status, session, router]);

  return null;
}
