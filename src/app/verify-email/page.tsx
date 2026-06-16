"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    let isCancelled = false;

    const verify = async () => {
      if (!token) {
        if (!isCancelled) {
          setStatus("error");
          setMessage("Missing verification token.");
        }
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (!isCancelled) {
          if (response.ok && result.success) {
            setStatus("success");
            setMessage("Your email has been verified successfully. Redirecting to login...");
          } else {
            setStatus("error");
            setMessage(result.error || "Verification failed or the link has expired.");
          }
        }
      } catch {
        if (!isCancelled) {
          setStatus("error");
          setMessage("Something went wrong while verifying your email.");
        }
      }
    };

    verify();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (status !== "success") return;

    const timer = window.setTimeout(() => {
      router.replace("/login");
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold mb-3">Email Verification</h1>
        <p className={status === "success" ? "text-green-600" : status === "error" ? "text-red-600" : "text-gray-600"}>
          {message}
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Verifying your email...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
