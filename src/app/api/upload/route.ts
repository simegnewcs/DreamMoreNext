import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

// POST /api/upload — uploads payment screenshot to Cloudinary, returns URL
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file)
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });

    if (!ALLOWED.includes(file.type))
      return NextResponse.json({ success: false, error: "Only image files are allowed" }, { status: 400 });

    if (file.size > 5 * 1024 * 1024)
      return NextResponse.json({ success: false, error: "File size must be under 5 MB" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, "dreammore/payments", {
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    });

    return NextResponse.json({ success: true, url: result.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
