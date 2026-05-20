import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

interface PaymentRow extends RowDataPacket {
  total_revenue: number;
  total_paid_students: number;
}

interface StudentPaymentRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  course_title: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

// GET /api/admin/payment-stats
export async function GET() {
  try {
    // Get total revenue and paid students count
    const stats = await query(
      `SELECT 
        COALESCE(SUM(amount), 0) as total_revenue,
        COUNT(DISTINCT id) as total_paid_students
      FROM applications 
      WHERE status = 'approved' AND amount > 0`,
      []
    ) as PaymentRow[];

    // Get list of paid students with details
    const paidStudents = await query(
      `SELECT 
        a.id,
        a.name,
        a.email,
        c.title as course_title,
        a.amount,
        a.payment_method,
        a.status,
        a.created_at
      FROM applications a
      JOIN courses c ON a.course_id = c.id
      WHERE a.status = 'approved' AND a.amount > 0
      ORDER BY a.created_at DESC`,
      []
    ) as StudentPaymentRow[];

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue: stats[0]?.total_revenue || 0,
        totalPaidStudents: stats[0]?.total_paid_students || 0,
      },
      paidStudents: paidStudents.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        course: student.course_title,
        amount: student.amount,
        paymentMethod: student.payment_method || 'N/A',
        status: student.status,
        date: student.created_at,
      })),
    });
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch payment stats" },
      { status: 500 }
    );
  }
}
