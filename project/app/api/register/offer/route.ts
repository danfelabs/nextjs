import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Offer from "@/models/Offer";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const location = formData.get("location") as string;
    const mobile = formData.get("mobile") as string;
    const serial = formData.get("serial") as string;
    const image = formData.get("image") as File;

    let imagePath = "";
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}_${image.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", filename);
      await writeFile(filePath, buffer);
      imagePath = `/uploads/${filename}`;
    }

    await Offer.create({ name, email, location, mobile, serial, image: imagePath });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Offer registration error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}