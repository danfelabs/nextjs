"use client";

import { useState } from "react";

interface Props {
  data: any;
}

export default function PhaseThree({ data }: Props) {
  const [mobile, setMobile] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allData = { ...data, mobile };
    console.log("Final Submission:", allData);
    setSubmitted(true);
    localStorage.removeItem("formData");
  };

  if (submitted) {
    return <div className="text-green-600 text-center">Offer submitted successfully!</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        type="tel"
        name="mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        placeholder="Mobile Number"
        className="w-full border p-2 rounded"
        required
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}
