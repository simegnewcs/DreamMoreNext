import { NextRequest, NextResponse } from "next/server";
import { getAllBrands, createBrand } from "@/lib/db/trustedBrands";

// GET - Fetch all trusted brands
export async function GET() {
  try {
    const brands = await getAllBrands();
    return NextResponse.json({
      success: true,
      brands,
    });
  } catch (error) {
    console.error("Error fetching trusted brands:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch trusted brands" },
      { status: 500 }
    );
  }
}

// POST - Create new trusted brand
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, logo } = body;

    // Validation
    if (!name || !logo) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: name and logo" },
        { status: 400 }
      );
    }

    const newBrand = await createBrand({ name, logo });

    return NextResponse.json({
      success: true,
      brand: newBrand,
      message: "Trusted brand created successfully",
    });
  } catch (error) {
    console.error("Error creating trusted brand:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create trusted brand" },
      { status: 500 }
    );
  }
}
