import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/courses/[slug] - Get single course by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get course with all related data
    const courses = await query(
      `SELECT * FROM courses WHERE slug = ? AND status = 'active'`,
      [slug]
    );

    if ((courses as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    const course = (courses as any[])[0];

    // Get technologies
    const techs = await query(
      `SELECT name FROM technologies WHERE course_id = ?`,
      [course.id]
    );

    // Get outcomes
    const outs = await query(
      `SELECT outcome FROM outcomes WHERE course_id = ? ORDER BY order_index`,
      [course.id]
    );

    // Get requirements
    const reqs = await query(
      `SELECT requirement FROM requirements WHERE course_id = ? ORDER BY order_index`,
      [course.id]
    );

    // Get FAQs
    const faqList = await query(
      `SELECT question, answer FROM faqs WHERE course_id = ? ORDER BY order_index`,
      [course.id]
    );

    // Get modules
    const mods = await query(
      `SELECT title, lessons_count as lessons FROM modules WHERE course_id = ? ORDER BY order_index`,
      [course.id]
    );

    // Format course data
    const formattedCourse = {
      ...course,
      technologies: (techs as any[]).map(t => t.name),
      outcomes: (outs as any[]).map(o => o.outcome),
      requirements: (reqs as any[]).map(r => r.requirement),
      faqs: (faqList as any[]).map(f => ({ q: f.question, a: f.answer })),
      modules: (mods as any[]).map(m => ({ title: m.title, lessons: m.lessons })),
      certificate: course.certificate === 1,
      price: parseFloat(course.price),
      rating: parseFloat(course.rating),
      students: course.students_count
    };

    return NextResponse.json({ 
      success: true, 
      course: formattedCourse 
    });

  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[slug] - Update course
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const courses = await query(`SELECT id FROM courses WHERE slug = ?`, [slug]);
    
    if ((courses as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    const courseId = (courses as any[])[0].id;

    // Update course fields
    const updateFields = [];
    const values = [];

    const allowedFields = [
      'title', 'description', 'short_description', 'image', 'duration',
      'level', 'instructor', 'instructor_bio', 'instructor_image',
      'price', 'category', 'language', 'schedule', 'certificate', 'status'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        values.push(body[field]);
      }
    }

    if (updateFields.length > 0) {
      await query(
        `UPDATE courses SET ${updateFields.join(', ')} WHERE id = ?`,
        [...values, courseId]
      );
    }

    // Update related data if provided
    if (body.technologies) {
      await query(`DELETE FROM technologies WHERE course_id = ?`, [courseId]);
      for (const tech of body.technologies) {
        await query(`INSERT INTO technologies (course_id, name) VALUES (?, ?)`, [courseId, tech]);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Course updated successfully" 
    });

  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[slug] - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const courses = await query(`SELECT id FROM courses WHERE slug = ?`, [slug]);
    
    if ((courses as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    const courseId = (courses as any[])[0].id;

    // Soft delete by setting status to archived
    await query(`UPDATE courses SET status = 'archived' WHERE id = ?`, [courseId]);

    return NextResponse.json({ 
      success: true, 
      message: "Course deleted successfully" 
    });

  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
