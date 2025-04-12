import { NextRequest, NextResponse } from "next/server";
import axios from "axios"; // Import Axios
import { randomInt } from "crypto"; // For generating OTP

// Configuration for BiraSMS
const config = {
  BIRASMS_API_URL: "https://user.birasms.com/api/smsapi",
  BIRASMS_API_KEY: "8EB4212649769CADB2CE340DD3FB2026",
  BIRASMS_CAMPAIGN: "youthcongressnepal",
  BIRASMS_routeId: "SI_Alert",
};

// Store the OTP temporarily in memory (for simplicity)
let generatedOtp: string | null = null;

export async function POST(req: NextRequest) {
  const { mobile, action } = await req.json();

  // If the action is to generate OTP
  if (action === "generate") {
    if (!mobile || mobile.length !== 10) {
      return NextResponse.json({ success: false, error: "Invalid mobile number" }, { status: 400 });
    }

    // Generate a random 6-digit OTP
    generatedOtp = randomInt(100000, 999999).toString(); // 6-digit OTP

    const message = `Your verification OTP code is ${generatedOtp}.  - Youth Congress Nepal, Communication Department`;

    try {
      // Send OTP via BiraSMS API using Axios POST method
      const response = await axios.post(config.BIRASMS_API_URL, null, {
        params: {
          key: config.BIRASMS_API_KEY,
          campaign: config.BIRASMS_CAMPAIGN,
          contacts: mobile,
          routeid: config.BIRASMS_routeId,
          msg: message,
        },
      });

      // Log the response from the BiraSMS API
      console.log("BiraSMS Response:", response.data);

      if (response.data.success) {
        return NextResponse.json({ success: true });
      } else {
        console.error("Failed to send OTP:", response.data);
        return NextResponse.json({ success: false, error: "Failed to send OTP" }, { status: 500 });
      }
    } catch (error) {
      console.error("Error in sending OTP:", error);
      return NextResponse.json({ success: false, error: "Error sending OTP" }, { status: 500 });
    }
  }

  // If the action is to verify OTP
  else if (action === "verify") {
    const { otp } = await req.json();

    // Validate OTP
    if (otp === generatedOtp) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 400 });
    }
  }

  // If the action is invalid
  return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
}
