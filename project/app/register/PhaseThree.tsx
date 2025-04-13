"use client";

import { useState, useEffect } from "react";

interface Props {
  data: any;
  onChange: (name: string, value: string) => void;
  submit: () => void;
  back: () => void;
}

export default function PhaseThree({ data, onChange, submit, back }: Props) {
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const requestOtp = async () => {
    const res = await fetch("/api/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate", mobile: data.mobile }),
    });

    if (res.ok) setSent(true);
  };

  useEffect(() => {
    if (otp.length === 6) {
      fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", otp }),
      })
        .then((r) => r.json())
        .then((d) => d.success && setVerified(true));
    }
  }, [otp]);

  return (
    <div className="space-y-6 p-6 bg-base-200 dark:bg-base-900 rounded-lg shadow-md">
      <div className="flex items-center justify-between text-sm font-semibold text-gray-400 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 text-gray-400">1</div>
          <span className="hidden sm:inline">Personal Information</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 text-gray-400">2</div>
          <span className="hidden sm:inline">Serial Number Verification</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-base-900 font-bold border border-base-300">3</div>
          <span className="text-white">Mobile Number Verification</span>
        </div>
      </div>

      <p className="text-sm text-gray-400">Verify your mobile number:</p>
      <input
        type="text"
        placeholder="Mobile Number"
        value={data.mobile}
        onChange={(e) => {
          onChange("mobile", e.target.value);
          setSent(false);
          setOtp("");
          setVerified(false);
        }}
        className="input input-bordered w-full dark:bg-base-800 dark:text-white"
      />

      {!sent && (
        <button onClick={requestOtp} className="btn btn-primary w-full">
          Request OTP
        </button>
      )}

      {sent && !verified && (
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="input input-bordered w-full dark:bg-base-800 dark:text-white"
          placeholder="Enter OTP"
          maxLength={6}
        />
      )}

      <div className="bg-base-100 p-4 rounded text-sm text-white border border-base-300 max-h-40 overflow-y-auto">
        By registering, you confirm that the product and its serial number you provided belong to you. Any attempt to register someone else's product will be considered invalid. This information is collected to ensure ownership verification. We do not share your personal data with third parties. Misuse of this system may result in disqualification from offers or services associated with the registered serial number. Ensure all the details are correct before submitting. Contact support in case of any discrepancies.
      </div>

      <div className="form-control">
        <label className="cursor-pointer label">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="checkbox checkbox-success"
          />
          <span className="label-text ml-2 text-sm text-white">
            I agree to the above terms and conditions.
          </span>
        </label>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={back} className="btn btn-ghost dark:text-white">
          BACK
        </button>
        {verified && agreed && (
          <button onClick={submit} className="btn btn-success animate-pulse">
            Register
          </button>
        )}
      </div>
    </div>
  );
}
