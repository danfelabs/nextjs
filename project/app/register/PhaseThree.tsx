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
    <div className="space-y-4">
      <h2 className="font-bold">Phase 3: Contact</h2>

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
        className="w-full border p-2 rounded"
      />

      {!sent && (
        <button onClick={requestOtp} className="bg-blue-500 text-white px-4 py-2 rounded">
          Request OTP
        </button>
      )}

      {sent && !verified && (
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter OTP"
          maxLength={6}
        />
      )}

      <div className="flex justify-between mt-4">
        <button onClick={back} className="border px-4 py-2 rounded">Back</button>
        {verified && (
          <button onClick={submit} className="bg-green-600 text-white px-4 py-2 rounded">
            Register
          </button>
        )}
      </div>
    </div>
  );
}
