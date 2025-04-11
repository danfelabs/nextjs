import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  name: String,
  email: String,
  location: String,
  serialNumbers: [String],
  mobile: String,
}, { timestamps: true });

const Offer = mongoose.models.Offer || mongoose.model("Offer", offerSchema);

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const offer = await Offer.create(body);
    return NextResponse.json({ success: true, offer });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: "Unknown error" }, { status: 500 });
  }
}
