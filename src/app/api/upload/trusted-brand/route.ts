import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    
    if (!ALLOWED.includes(file.type))
      return NextResponse.json({ success: false, error: "Only images allowed (JPEG, PNG, WebP, GIF, SVG)" }, { status: 400 });
      
    if (file.size > MAX_SIZE)
      return NextResponse.json({ success: false, error: "Image must be under 5 MB" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, "dreammore/brands", {
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "svg"],
    });

    return NextResponse.json({ success: true, url: result.url });
  } catch (error) {
    console.error("Brand logo upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
