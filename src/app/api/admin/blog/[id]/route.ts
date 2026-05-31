import { NextRequest, NextResponse } from "next/server";
import { getBlogById, updateBlog, deleteBlog } from "@/lib/db/blogs";

// PUT - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const blogId = parseInt(id);

    // Check if blog exists
    const existingBlog = await getBlogById(blogId);
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    // Update the blog post in database
    const updatedBlog = await updateBlog(blogId, body);

    return NextResponse.json({
      success: true,
      blog: updatedBlog,
      message: "Blog post updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating blog:", error);
    
    // Handle duplicate slug error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, message: "A blog post with this title already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blogId = parseInt(id);

    // Check if blog exists
    const existingBlog = await getBlogById(blogId);
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    // Delete the blog post from database
    const deleted = await deleteBlog(blogId);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Failed to delete blog post" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
