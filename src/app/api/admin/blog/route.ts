import { NextRequest, NextResponse } from "next/server";
import { getAllBlogs, createBlog } from "@/lib/db/blogs";

// GET - Fetch all blog posts from database
export async function GET() {
  try {
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

// POST - Create new blog post in database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, description, category, author, date, readTime, image, video, featured, promotion } = body;

    // Validation
    if (!title || !excerpt || !category || !author || !date || !readTime) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Create new blog post in database
    const newBlog = await createBlog({
      slug,
      title,
      excerpt,
      description: description || '',
      category,
      author,
      date,
      readTime,
      image: image || "/images/blog/default.jpg",
      video: video || null,
      featured: featured || false,
      promotion: promotion || false,
    });

    return NextResponse.json({
      success: true,
      blog: newBlog,
      message: "Blog post created successfully",
    });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    
    // Handle duplicate slug error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, message: "A blog post with this title already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
