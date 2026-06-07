import type { Metadata } from "next";
import { getAllBlogs } from "@/lib/db/blogs";
import BlogClient from "@/components/blog/BlogClient";

// Force dynamic rendering to get fresh data
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on technology, AI, startups, and digital innovation from DreamMore.",
};

async function fetchAllBlogs() {
  try {
    // Fetch directly from database
    const blogs = await getAllBlogs();
    return blogs;
  } catch (error) {
    console.error('Error fetching blogs from database:', error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await fetchAllBlogs();
  return <BlogClient initialBlogs={blogs} />;
}
