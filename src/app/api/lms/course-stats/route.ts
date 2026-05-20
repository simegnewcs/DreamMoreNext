import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

interface StatsRow extends RowDataPacket {
  total_students: number;
  instructor_name: string;
  instructor_email: string;
  instructor_avatar: string;
  course_title: string;
  duration: string;
  level: string;
}

// GET /api/lms/course-stats?courseId=123
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: "Missing courseId" },
        { status: 400 }
      );
    }

    // Get course stats (only using existing tables)
    const stats = await query(
      `SELECT 
        c.title as course_title,
        c.instructor_name,
        c.instructor_email,
        c.instructor_avatar,
        c.duration,
        c.level,
        COUNT(DISTINCT a.id) as total_students
      FROM courses c
      LEFT JOIN applications a ON c.id = a.course_id AND a.status = 'approved'
      WHERE c.id = ?
      GROUP BY c.id`,
      [courseId]
    ) as StatsRow[];

    if (stats.length === 0) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    const data = stats[0];

    return NextResponse.json({
      success: true,
      stats: {
        courseTitle: data.course_title,
        totalStudents: data.total_students,
        instructor: {
          name: data.instructor_name || "TBD",
          email: data.instructor_email,
          avatar: data.instructor_avatar,
        },
        duration: data.duration,
        level: data.level,
      },
    });
  } catch (error) {
    console.error("Error fetching course stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch course stats" },
      { status: 500 }
    );
  }
}
