import { NextRequest, NextResponse } from "next/server";
import { getBrandById, updateBrand, deleteBrand } from "@/lib/db/trustedBrands";

// PUT - Update trusted brand
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const brandId = parseInt(id);

    // Check if brand exists
    const existingBrand = await getBrandById(brandId);
    if (!existingBrand) {
      return NextResponse.json(
        { success: false, message: "Trusted brand not found" },
        { status: 404 }
      );
    }

    // Update the brand in database
    const updatedBrand = await updateBrand(brandId, body);

    return NextResponse.json({
      success: true,
      brand: updatedBrand,
      message: "Trusted brand updated successfully",
    });
  } catch (error) {
    console.error("Error updating trusted brand:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update trusted brand" },
      { status: 500 }
    );
  }
}

// DELETE - Delete trusted brand
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brandId = parseInt(id);

    // Check if brand exists
    const existingBrand = await getBrandById(brandId);
    if (!existingBrand) {
      return NextResponse.json(
        { success: false, message: "Trusted brand not found" },
        { status: 404 }
      );
    }

    // Delete the brand from database
    const deleted = await deleteBrand(brandId);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Failed to delete trusted brand" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Trusted brand deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting trusted brand:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete trusted brand" },
      { status: 500 }
    );
  }
}
