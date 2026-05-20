import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/courses - Get all courses or filter by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : null;
    const featured = searchParams.get("featured");

    let sql = `
      SELECT 
        c.*,
        GROUP_CONCAT(DISTINCT t.name) as technologies,
        (SELECT COUNT(*) FROM applications WHERE course_id = c.id AND status = 'pending') as pending_applications
      FROM courses c
      LEFT JOIN technologies t ON c.id = t.course_id
      WHERE c.status = 'active'
    `;

    const params: any[] = [];

    if (category) {
      sql += ` AND c.category = ?`;
      params.push(category);
    }

    sql += ` GROUP BY c.id ORDER BY c.created_at DESC`;

    if (limit) {
      sql += ` LIMIT ?`;
      params.push(limit);
    }

    const courses = await query(sql, params);

    // Parse technologies string to array
    const formattedCourses = (courses as any[]).map(course => ({
      ...course,
      technologies: course.technologies ? course.technologies.split(',') : [],
      certificate: course.certificate === 1,
      price: parseFloat(course.price),
      rating: parseFloat(course.rating)
    }));

    return NextResponse.json({ 
      success: true, 
      courses: formattedCourses 
    });

  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create new course (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      title,
      description,
      short_description,
      image,
      duration,
      level,
      instructor,
      instructor_bio,
      instructor_image,
      price,
      currency = "ETB",
      category,
      language = "English / Amharic",
      schedule,
      certificate = true,
      technologies = [],
      outcomes = [],
      requirements = [],
      faqs = [],
      modules = []
    } = body;

    // Validate required fields
    if (!slug || !title || !price || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert course - convert undefined to null for optional fields
    const courseResult = await query(
      `INSERT INTO courses (slug, title, description, short_description, image, duration, level, 
       instructor, instructor_bio, instructor_image, price, currency, category, language, 
       schedule, certificate) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug, 
        title, 
        description || null, 
        short_description || null, 
        image || null, 
        duration || null, 
        level || null, 
        instructor || null, 
        instructor_bio || null, 
        instructor_image || null, 
        price, 
        currency, 
        category, 
        language, 
        schedule || null, 
        certificate ? 1 : 0
      ]
    );

    const courseId = (courseResult as any).insertId;

    // Insert technologies
    if (technologies.length > 0) {
      for (const tech of technologies) {
        await query(`INSERT INTO technologies (course_id, name) VALUES (?, ?)`, [courseId, tech]);
      }
    }

    // Insert outcomes
    if (outcomes.length > 0) {
      for (let i = 0; i < outcomes.length; i++) {
        await query(`INSERT INTO outcomes (course_id, outcome, order_index) VALUES (?, ?, ?)`, 
          [courseId, outcomes[i], i]);
      }
    }

    // Insert requirements
    if (requirements.length > 0) {
      for (let i = 0; i < requirements.length; i++) {
        await query(`INSERT INTO requirements (course_id, requirement, order_index) VALUES (?, ?, ?)`, 
          [courseId, requirements[i], i]);
      }
    }

    // Insert FAQs
    if (faqs.length > 0) {
      for (let i = 0; i < faqs.length; i++) {
        await query(`INSERT INTO faqs (course_id, question, answer, order_index) VALUES (?, ?, ?, ?)`, 
          [courseId, faqs[i].question, faqs[i].answer, i]);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Course created successfully",
      courseId 
    });

  } catch (error: any) {
    console.error("Error creating course:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, error: "Course with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create course" },
      { status: 500 }
    );
  }
}
