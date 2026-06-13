import { NextResponse } from "next/server";
import { getAllBrands } from "@/lib/db/trustedBrands";

export async function GET() {
  try {
    const brands = await getAllBrands();
    return NextResponse.json({
      success: true,
      brands,
    });
  } catch (error) {
    console.error("Error fetching trusted brands dynamically:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch trusted brands" },
      { status: 500 }
    );
  }
}
