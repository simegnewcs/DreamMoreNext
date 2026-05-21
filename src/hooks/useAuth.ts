"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolve = () => {
      // 1. Check localStorage first (email login)
      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          setUser(JSON.parse(raw));
          setLoading(false);
          return;
        }
      } catch {}

      // 2. Fall back to NextAuth Google session
      if (status === "loading") return;
      if (status === "authenticated" && session?.user) {
        const u = session.user as any;
        const userData = {
          id: u.id,
          name: u.name,
          email: u.email,
          avatar: u.image,
          role: u.role || "student",
          provider: "google",
        };
        // Write to localStorage so other components pick it up
        localStorage.setItem("user", JSON.stringify(userData));
        if (u.dbToken) localStorage.setItem("token", u.dbToken);
        window.dispatchEvent(new Event("userUpdated"));
        setUser(userData);
      }
      setLoading(false);
    };

    resolve();

    window.addEventListener("userUpdated", resolve);
    return () => window.removeEventListener("userUpdated", resolve);
  }, [status, session]);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("userUpdated"));
    setUser(null);
  };

  return { user, loading, isLoggedIn: !!user };
}
