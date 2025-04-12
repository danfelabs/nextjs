"use client";

import { useState, useEffect } from "react";

interface Props {
  data: any;
  onChange: (name: string, value: string) => void;
  submit: () => void;
  back: () => void;
}

export default function PhaseThree({ data, onChange, submit, back }: Props) {
  const [mobile, setMobile] = useState<string>(data.mobile || "");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [isRequestingOtp, setIsRequestingOtp] = useState<boolean>(false);

  // Handle mobile number change
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobile(e.target.value);
    onChange("mobile", e.target.value);
  };

  // Handle OTP field change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleRequestOtp = async () => {
    if (mobile.length === 10 && !isRequestingOtp) {
      const response = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, action: "generate" }),
      });

      const data = await response.json();

      // If OTP is sent successfully, enable the OTP field
      if (data.success) {
        setOtpSent(true);
        setIsRequestingOtp(true);
        setTimer(60); // Start countdown from 60 seconds
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } else {
      alert("Please enter a valid 10-digit mobile number.");
    }
  };

  const handleVerifyOtp = async () => {
    const response = await fetch("/api/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, otp, action: "verify" }),
    });

    const data = await response.json();
    if (data.success) {
      setOtpVerified(true);
      alert("OTP verified successfully!");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  // Countdown timer for disabling the "Request OTP" button for 60 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRequestingOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsRequestingOtp(false);
    }

    return () => clearInterval(interval);
  }, [isRequestingOtp, timer]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Phase 3: Contact</h2>

      {/* Mobile number input */}
      <input
        type="text"
        placeholder="Mobile Number"
        value={mobile}
        onChange={handleMobileChange}
        className="w-full border p-2 rounded"
      />

      {/* Request OTP button */}
      {mobile.length === 10 && !otpSent && (
        <button
          onClick={handleRequestOtp}
          disabled={isRequestingOtp}
          className={`bg-blue-500 text-white px-4 py-2 rounded mt-4 ${isRequestingOtp ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isRequestingOtp ? `Resend in ${timer}s` : 'Request OTP'}
        </button>
      )}

      {/* OTP input */}
      {(otpSent || otpVerified) && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleOtpChange}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={handleVerifyOtp}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4"
          >
            Verify OTP
          </button>
        </div>
      )}

      {/* Submit button */}
      {otpVerified && (
        <button
          onClick={submit}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Submit
        </button>
      )}

      {/* Back button */}
      <div className="flex justify-between mt-4">
        <button onClick={back} className="px-4 py-2 border rounded">
          Back
        </button>
      </div>
    </div>
  );
}
