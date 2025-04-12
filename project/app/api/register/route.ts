import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Offer from "@/models/Offer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const location = formData.get("location") as string;
    const mobile = formData.get("mobile") as string;
    const serial = formData.get("serial") as string;
    const image = formData.get("image") as string;  // This will be a URL string

    // Check if the serial number already exists
    const existingOffer = await Offer.findOne({ serial });

    if (existingOffer) {
      return NextResponse.json(
        { success: false, error: "Serial number already exists" },
        { status: 400 }
      );
    }

    // Save the offer along with the image URL
    await Offer.create({ name, email, location, mobile, serial, image });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Offer registration error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
