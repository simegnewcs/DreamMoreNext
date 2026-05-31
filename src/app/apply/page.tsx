import type { Metadata } from "next";
import { Suspense } from "react";
import ApplyClient from "@/components/apply/ApplyClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply for a DreamMore Academy course.",
};

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <ApplyClient />
    </Suspense>
  );
}
