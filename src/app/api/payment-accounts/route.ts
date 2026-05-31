import { NextResponse } from "next/server";
import { getActivePaymentAccounts } from "@/lib/db/paymentAccounts";

// GET - Fetch active payment accounts (public endpoint)
export async function GET() {
  try {
    const accounts = await getActivePaymentAccounts();
    
    return NextResponse.json({
      success: true,
      accounts
    });
  } catch (error) {
    console.error("Error fetching payment accounts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch payment accounts" },
      { status: 500 }
    );
  }
}
