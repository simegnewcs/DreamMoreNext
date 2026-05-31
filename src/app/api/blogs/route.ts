import { NextResponse } from "next/server";
import { getAllBlogs } from "@/lib/db/blogs";

// GET - Fetch all blog posts from database (public endpoint)
export async function GET() {
  try {
    // Fetch from database - already sorted by date descending
    const blogs = await getAllBlogs();

    return NextResponse.json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
