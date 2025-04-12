import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { randomInt } from "crypto";

const config = {
  BIRASMS_API_URL: "https://user.birasms.com/api/smsapi",
  BIRASMS_API_KEY: "8EB4212649769CADB2CE340DD3FB2026",
  BIRASMS_CAMPAIGN: "youthcongressnepal",
  BIRASMS_routeId: "SI_Alert",
};

let otpStore: { otp: string } = { otp: "" };

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.action === "generate") {
    if (!body.mobile || body.mobile.length !== 10) {
      return NextResponse.json({ success: false });
    }

    otpStore.otp = randomInt(100000, 999999).toString();

    await axios.post(config.BIRASMS_API_URL, null, {
      params: {
        key: config.BIRASMS_API_KEY,
        campaign: config.BIRASMS_CAMPAIGN,
        contacts: body.mobile,
        routeid: config.BIRASMS_routeId,
        msg: `Your OTP is ${otpStore.otp}`,
      },
    });

    return NextResponse.json({ success: true });
  }

  if (body.action === "verify") {
    return NextResponse.json({ success: body.otp === otpStore.otp });
  }

  return NextResponse.json({ success: false });
}
