import type { Metadata } from "next";
import { Suspense } from "react";
import ApplyClient from "@/components/apply/ApplyClient";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply for a DreamMore Academy course.",
};

export default function ApplyPage() {
  return (
    <Suspense>
      <ApplyClient />
    </Suspense>
  );
}
