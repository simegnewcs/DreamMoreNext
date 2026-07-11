import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("x-auth-token") || request.headers.get("authorization")?.replace("Bearer ", "") || request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded?.id) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size must be under 5 MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, "dreammore/avatars", {
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    const avatarUrl = result.url;

    await query(`UPDATE users SET avatar = ? WHERE id = ?`, [avatarUrl, decoded.id]);

    return NextResponse.json({ success: true, avatar: avatarUrl });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json({ success: false, error: "Avatar upload failed" }, { status: 500 });
  }
}
