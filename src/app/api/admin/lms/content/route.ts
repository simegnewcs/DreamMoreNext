import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// GET /api/admin/lms/content?courseId=X
// Returns full phase + week + video/note/assignment tree for a course
export async function GET(request: NextRequest) {
  const courseId = new URL(request.url).searchParams.get("courseId");
  if (!courseId) return NextResponse.json({ success: false, error: "Missing courseId" }, { status: 400 });

  try {
    const phases = await query(
      `SELECT * FROM course_phases WHERE course_id = ? ORDER BY order_index ASC`,
      [courseId]
    ) as RowDataPacket[];

    const weeks = phases.length
      ? await query(
          `SELECT * FROM weekly_content WHERE phase_id IN (${phases.map(() => "?").join(",")}) ORDER BY order_index ASC`,
          phases.map((p) => p.id)
        ) as RowDataPacket[]
      : [];

    const weekIds = weeks.map((w) => w.id);
    let videos: RowDataPacket[] = [];
    let notes: RowDataPacket[] = [];
    let assignments: RowDataPacket[] = [];

    if (weekIds.length) {
      const inClause = weekIds.map(() => "?").join(",");
      videos = await query(`SELECT * FROM class_videos WHERE week_id IN (${inClause}) ORDER BY order_index ASC`, weekIds) as RowDataPacket[];
      notes = await query(`SELECT * FROM class_notes WHERE week_id IN (${inClause}) ORDER BY order_index ASC`, weekIds) as RowDataPacket[];
      assignments = await query(`SELECT * FROM assignments WHERE week_id IN (${inClause}) ORDER BY order_index ASC`, weekIds) as RowDataPacket[];
    }

    // Build tree
    const tree = phases.map((p) => ({
      ...p,
      learning_objectives: (() => { try { return JSON.parse(p.learning_objectives || "[]"); } catch { return []; } })(),
      weeks: weeks
        .filter((w) => w.phase_id === p.id)
        .map((w) => ({
          ...w,
          learning_topics: (() => { try { return JSON.parse(w.learning_topics || "[]"); } catch { return []; } })(),
          videos: videos.filter((v) => v.week_id === w.id),
          notes: notes.filter((n) => n.week_id === w.id),
          assignments: assignments.filter((a) => a.week_id === w.id),
        })),
    }));

    return NextResponse.json({ success: true, phases: tree });
  } catch (error) {
    console.error("LMS content GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch LMS content" }, { status: 500 });
  }
}

// POST /api/admin/lms/content
// body: { action, courseId, ...fields }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "add_phase") {
      const { course_id, title, description, duration_weeks, learning_objectives, order_index } = body;
      if (!course_id || !title) return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
      const result = await query(
        `INSERT INTO course_phases (course_id, phase_number, title, description, duration_weeks, learning_objectives, order_index, is_locked)
         VALUES (
           ?,
           (SELECT COALESCE(MAX(phase_number),0)+1 FROM course_phases cp2 WHERE cp2.course_id = ?),
           ?, ?, ?, ?, ?, FALSE
         )`,
        [course_id, course_id, title, description || null, duration_weeks || 1, JSON.stringify(learning_objectives || []), order_index ?? 99]
      ) as any;
      return NextResponse.json({ success: true, id: result.insertId });
    }

    if (action === "add_week") {
      const { phase_id, title, description, learning_topics, order_index } = body;
      if (!phase_id || !title) return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
      const result = await query(
        `INSERT INTO weekly_content (phase_id, week_number, title, description, learning_topics, order_index, is_locked)
         VALUES (
           ?,
           (SELECT COALESCE(MAX(week_number),0)+1 FROM weekly_content wc2 WHERE wc2.phase_id = ?),
           ?, ?, ?, ?, FALSE
         )`,
        [phase_id, phase_id, title, description || null, JSON.stringify(learning_topics || []), order_index ?? 99]
      ) as any;
      return NextResponse.json({ success: true, id: result.insertId });
    }

    if (action === "add_video") {
      const { week_id, title, description, video_url, thumbnail_url, duration_minutes, order_index } = body;
      if (!week_id || !title || !video_url) return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
      // Compute video_number safely without GROUP BY issues
      const weekMeta = await query(
        `SELECT cp.phase_number, wc.week_number, COALESCE(MAX(cv2.order_index), 0) + 1 as next_idx
         FROM weekly_content wc
         JOIN course_phases cp ON wc.phase_id = cp.id
         LEFT JOIN class_videos cv2 ON cv2.week_id = wc.id
         WHERE wc.id = ?
         GROUP BY cp.phase_number, wc.week_number`,
        [week_id]
      ) as any[];
      const videoNumber = weekMeta.length
        ? `${weekMeta[0].phase_number}.${weekMeta[0].week_number}.${weekMeta[0].next_idx}`
        : "1.1.1";
      const result = await query(
        `INSERT INTO class_videos (week_id, video_number, title, description, thumbnail_url, video_url, duration_minutes, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [week_id, videoNumber, title, description || null, thumbnail_url || null, video_url, duration_minutes || null, order_index ?? 99]
      ) as any;
      return NextResponse.json({ success: true, id: result.insertId });
    }

    if (action === "add_note") {
      const { week_id, title, description, pdf_url, file_size_mb, order_index } = body;
      if (!week_id || !title || !pdf_url) return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
      const result = await query(
        `INSERT INTO class_notes (week_id, title, description, pdf_url, file_size_mb, order_index) VALUES (?, ?, ?, ?, ?, ?)`,
        [week_id, title, description || null, pdf_url, file_size_mb || null, order_index ?? 99]
      ) as any;
      return NextResponse.json({ success: true, id: result.insertId });
    }

    if (action === "add_assignment") {
      const { week_id, title, description, assignment_type, deadline, max_score, order_index } = body;
      if (!week_id || !title) return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
      const result = await query(
        `INSERT INTO assignments (week_id, title, description, assignment_type, deadline, max_score, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [week_id, title, description || null, assignment_type || "assignment", deadline || null, max_score || 100, order_index ?? 99]
      ) as any;
      return NextResponse.json({ success: true, id: result.insertId });
    }

    if (action === "delete_phase") {
      await query(`DELETE FROM course_phases WHERE id = ?`, [body.id]);
      return NextResponse.json({ success: true });
    }
    if (action === "delete_week") {
      await query(`DELETE FROM weekly_content WHERE id = ?`, [body.id]);
      return NextResponse.json({ success: true });
    }
    if (action === "delete_video") {
      await query(`DELETE FROM class_videos WHERE id = ?`, [body.id]);
      return NextResponse.json({ success: true });
    }
    if (action === "delete_note") {
      await query(`DELETE FROM class_notes WHERE id = ?`, [body.id]);
      return NextResponse.json({ success: true });
    }
    if (action === "delete_assignment") {
      await query(`DELETE FROM assignments WHERE id = ?`, [body.id]);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("LMS content POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to save LMS content" }, { status: 500 });
  }
}
