import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/admin/notifications - Get admin notifications
export async function GET(request: NextRequest) {
  try {
    const notifications: any[] = [];
    let totalCount = 0;

    // 1. Pending applications
    const pendingAppsRes = await query(
      `SELECT COUNT(*) as count FROM applications WHERE status = 'pending'`
    );
    const pendingAppsCount = (pendingAppsRes as any[])[0]?.count || 0;
    
    if (pendingAppsCount > 0) {
      notifications.push({
        id: 'pending-apps',
        type: 'application',
        title: `${pendingAppsCount} Pending Application${pendingAppsCount > 1 ? 's' : ''}`,
        message: `${pendingAppsCount} student${pendingAppsCount > 1 ? 's' : ''} waiting for approval`,
        link: '/admin?section=applications',
        timestamp: new Date().toISOString(),
        icon: 'FileText',
        priority: 'high'
      });
      totalCount += pendingAppsCount;
    }

    // 2. Payments pending verification
    const pendingPaymentsRes = await query(
      `SELECT COUNT(*) as count FROM payments WHERE status = 'pending_verification'`
    );
    const pendingPaymentsCount = (pendingPaymentsRes as any[])[0]?.count || 0;
    
    if (pendingPaymentsCount > 0) {
      notifications.push({
        id: 'pending-payments',
        type: 'payment',
        title: `${pendingPaymentsCount} Payment${pendingPaymentsCount > 1 ? 's' : ''} to Verify`,
        message: `${pendingPaymentsCount} payment receipt${pendingPaymentsCount > 1 ? 's' : ''} awaiting verification`,
        link: '/admin?section=payments',
        timestamp: new Date().toISOString(),
        icon: 'CreditCard',
        priority: 'high'
      });
      totalCount += pendingPaymentsCount;
    }

    // 3. Recent payments (last 24 hours)
    const recentPaymentsRes = await query(
      `SELECT COUNT(*) as count FROM payments 
       WHERE status = 'verified' 
       AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)`
    );
    const recentPaymentsCount = (recentPaymentsRes as any[])[0]?.count || 0;
    
    if (recentPaymentsCount > 0) {
      notifications.push({
        id: 'recent-payments',
        type: 'success',
        title: `${recentPaymentsCount} New Payment${recentPaymentsCount > 1 ? 's' : ''}`,
        message: `Received in the last 24 hours`,
        link: '/admin?section=payments',
        timestamp: new Date().toISOString(),
        icon: 'DollarSign',
        priority: 'normal'
      });
    }

    // 4. New users (last 24 hours)
    const newUsersRes = await query(
      `SELECT COUNT(*) as count FROM users 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)`
    );
    const newUsersCount = (newUsersRes as any[])[0]?.count || 0;
    
    if (newUsersCount > 0) {
      notifications.push({
        id: 'new-users',
        type: 'user',
        title: `${newUsersCount} New User${newUsersCount > 1 ? 's' : ''}`,
        message: `Registered in the last 24 hours`,
        link: '/admin?section=users',
        timestamp: new Date().toISOString(),
        icon: 'Users',
        priority: 'normal'
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        totalCount,
        unreadCount: notifications.filter(n => n.priority === 'high').length
      }
    });

  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
