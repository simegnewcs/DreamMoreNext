import { NextRequest, NextResponse } from "next/server";
import { 
  getAllPaymentAccounts, 
  createPaymentAccount,
  PaymentAccountInput 
} from "@/lib/db/paymentAccounts";

// GET - Fetch all payment accounts
export async function GET() {
  try {
    const accounts = await getAllPaymentAccounts();
    
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

// POST - Create new payment account
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.method || !data.accountNumber || !data.accountHolder) {
      return NextResponse.json(
        { success: false, message: "Method, account number, and account holder are required" },
        { status: 400 }
      );
    }

    const accountData: PaymentAccountInput = {
      method: data.method,
      accountNumber: data.accountNumber,
      accountHolder: data.accountHolder,
      bankName: data.bankName,
      instructions: data.instructions,
      isActive: data.isActive,
      displayOrder: data.displayOrder
    };

    const newAccount = await createPaymentAccount(accountData);
    
    return NextResponse.json({
      success: true,
      account: newAccount,
      message: "Payment account created successfully"
    });
  } catch (error) {
    console.error("Error creating payment account:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create payment account" },
      { status: 500 }
    );
  }
}
