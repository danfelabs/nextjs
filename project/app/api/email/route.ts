import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Offer from "@/models/Offer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const existing = await Offer.findOne({ email: email.toLowerCase() });

    return NextResponse.json({ exists: !!existing });
  } catch (error) {
    console.error("Email check error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
