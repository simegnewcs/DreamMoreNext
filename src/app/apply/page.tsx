import type { Metadata } from "next";
import ApplyClient from "@/components/apply/ApplyClient";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply for a DreamMore Academy course.",
};

export default function ApplyPage() {
  return <ApplyClient />;
}
