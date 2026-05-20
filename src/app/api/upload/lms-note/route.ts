import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file)
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });

    const ext = ALLOWED_TYPES[file.type];
    if (!ext)
      return NextResponse.json(
        { success: false, error: "Unsupported file type. Allowed: PDF, DOCX, PPT, PPTX, images." },
        { status: 400 }
      );

    if (file.size > MAX_SIZE)
      return NextResponse.json({ success: false, error: "File size must be under 20 MB" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, "dreammore/lms-notes", {
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
    });

    const sizeMb = parseFloat((file.size / (1024 * 1024)).toFixed(2));
    return NextResponse.json({
      success: true,
      url: result.url,
      sizeMb,
      originalName: file.name,
    });
  } catch (error) {
    console.error("LMS note upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
