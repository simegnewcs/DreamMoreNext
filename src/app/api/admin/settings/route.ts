import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/admin/settings - Get site settings status
export async function GET(request: NextRequest) {
  try {
    // Check if site settings table exists and has data
    const settingsRes = await query(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = 'site_settings'`
    );
    
    const tableExists = (settingsRes as any[])[0]?.count > 0;
    
    let settingsCount = 0;
    let missingSettings: string[] = [];
    
    if (tableExists) {
      // Get count of configured settings
      const countRes = await query(`SELECT COUNT(*) as count FROM site_settings WHERE value IS NOT NULL AND value != ''`);
      settingsCount = (countRes as any[])[0]?.count || 0;
    } else {
      // Check essential configurations that should exist
      missingSettings = ['site_name', 'contact_email', 'payment_accounts'];
    }
    
    // Check if CBE and Telebirr accounts are configured
    const paymentConfigured = true; // Already hardcoded in payment client
    
    return NextResponse.json({
      success: true,
      data: {
        tableExists,
        settingsCount,
        missingSettings,
        paymentConfigured,
        needsAttention: missingSettings.length > 0 || (tableExists && settingsCount === 0),
        alertCount: missingSettings.length || (tableExists && settingsCount === 0 ? 1 : 0)
      }
    });
    
  } catch (error: any) {
    console.error("Error fetching settings status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings status" },
      { status: 500 }
    );
  }
}

// POST /api/admin/settings - Save site settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;
    
    if (!key) {
      return NextResponse.json(
        { success: false, error: "Setting key is required" },
        { status: 400 }
      );
    }
    
    // Create table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        \`key\` VARCHAR(100) UNIQUE NOT NULL,
        value TEXT,
        description VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Insert or update setting
    await query(
      `INSERT INTO site_settings (\`key\`, value) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE value = VALUES(value)`,
      [key, value]
    );
    
    return NextResponse.json({
      success: true,
      message: "Setting saved successfully"
    });
    
  } catch (error: any) {
    console.error("Error saving setting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save setting" },
      { status: 500 }
    );
  }
}
