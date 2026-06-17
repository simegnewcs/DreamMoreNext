"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent");
    if (!stored) {
      setIsVisible(true);
    }
  }, []);

  const handleChoice = (choice: "accepted" | "rejected") => {
    localStorage.setItem("cookie-consent", choice);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end bg-black/50 p-4 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0f1020] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-white">We use cookies</h3>
            <p className="mt-1 text-sm text-white/70">
              We use cookies to improve your experience, remember your preferences, and understand how the site is used.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleChoice("rejected")}
            className="rounded-lg p-1 text-white/50 hover:bg-white/5 hover:text-white"
            aria-label="Close cookie notice"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <a href="/cookies" className="text-sm text-orange-400 hover:text-orange-300">
            Learn more about cookies
          </a>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleChoice("rejected")}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => handleChoice("accepted")}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
