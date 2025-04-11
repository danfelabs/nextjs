import { NextRequest, NextResponse } from "next/server";
import storage from "@/lib/connectStorage";
import { randomUUID } from "crypto";

const BUCKET = process.env.MINIO_BUCKET || "uploads";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = file.name.split(".").pop();
    const filename = `${randomUUID()}.${extension}`;

    await storage.putObject(BUCKET, filename, buffer, buffer.length);

    return NextResponse.json({ url: `/api/images/${filename}` });
  } catch (err) {
    console.error("MinIO upload error:", err);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}

export const GET = () =>
  NextResponse.json({ message: "POST an image as multipart/form-data with key 'file'" });
