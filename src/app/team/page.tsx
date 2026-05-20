import type { Metadata } from "next";
import TeamClient from "@/components/team/TeamClient";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the DreamMore team — the innovators, designers, and educators driving Africa's digital transformation.",
};

export default function TeamPage() {
  return <TeamClient />;
}
