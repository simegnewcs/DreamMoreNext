import type { Metadata } from "next";
import BlogClient from "@/components/blog/BlogClient";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on technology, AI, startups, and digital innovation from DreamMore.",
};

export default function BlogPage() {
  return <BlogClient />;
}
