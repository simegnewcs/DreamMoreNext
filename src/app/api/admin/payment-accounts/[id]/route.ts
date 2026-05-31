import { NextRequest, NextResponse } from "next/server";
import { 
  getPaymentAccountById,
  updatePaymentAccount,
  deletePaymentAccount,
  PaymentAccountInput 
} from "@/lib/db/paymentAccounts";

// GET - Fetch single payment account
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const account = await getPaymentAccountById(parseInt(id));
    
    if (!account) {
      return NextResponse.json(
        { success: false, message: "Payment account not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      account
    });
  } catch (error) {
    console.error("Error fetching payment account:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch payment account" },
      { status: 500 }
    );
  }
}

// PUT - Update payment account
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const updateData: Partial<PaymentAccountInput> = {};
    
    if (data.method !== undefined) updateData.method = data.method;
    if (data.accountNumber !== undefined) updateData.accountNumber = data.accountNumber;
    if (data.accountHolder !== undefined) updateData.accountHolder = data.accountHolder;
    if (data.bankName !== undefined) updateData.bankName = data.bankName;
    if (data.instructions !== undefined) updateData.instructions = data.instructions;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;

    const updatedAccount = await updatePaymentAccount(parseInt(id), updateData);
    
    if (!updatedAccount) {
      return NextResponse.json(
        { success: false, message: "Payment account not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      account: updatedAccount,
      message: "Payment account updated successfully"
    });
  } catch (error) {
    console.error("Error updating payment account:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update payment account" },
      { status: 500 }
    );
  }
}

// DELETE - Delete payment account
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deletePaymentAccount(parseInt(id));
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Payment account not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Payment account deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting payment account:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete payment account" },
      { status: 500 }
    );
  }
}
