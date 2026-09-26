import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
const imageTypes: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "image/gif": "gif" };
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Sign in before uploading images." }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "Connect a Vercel Blob store to this project first." }, { status: 503 });
  const form = await request.formData(); const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image file to upload." }, { status: 400 });
  const extension = imageTypes[file.type];
  if (!extension) return NextResponse.json({ error: "Use a JPG, PNG, WebP, AVIF, or GIF image." }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: "Image must be 4 MB or smaller." }, { status: 413 });
  try {
    const blob = await put(`project-banners/${randomUUID()}.${extension}`, file, { access: "public", addRandomSuffix: false, contentType: file.type, cacheControlMaxAge: 31536000 });
    return NextResponse.json({ url: blob.url });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Image upload failed." }, { status: 500 }); }
}
