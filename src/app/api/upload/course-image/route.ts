import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ success: false, error: "No file" }, { status: 400 });
    if (!ALLOWED.includes(file.type))
      return NextResponse.json({ success: false, error: "Only JPEG/PNG/WebP allowed" }, { status: 400 });
    if (file.size > MAX_SIZE)
      return NextResponse.json({ success: false, error: "Max 5 MB" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, "dreammore/courses", {
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1200, height: 675, crop: "fill" }],
    });

    return NextResponse.json({ success: true, url: result.url });
  } catch (error) {
    console.error("Course image upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
