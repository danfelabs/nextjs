"use client";

import { useState, useEffect } from "react";
import PhaseOne from "@components/PhaseOne";
import PhaseTwo from "@components/PhaseTwo";
import PhaseThree from "@components/PhaseThree";

export default function RegisterOffer() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const saved = localStorage.getItem("formData");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev: typeof formData) => ({ ...prev, ...data }));
  };

  const goToNext = () => setStep(prev => prev + 1);

  const submitToDatabase = async (finalData: any) => {
    try {
      const res = await fetch("/api/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      const result = await res.json();
      console.log("Submitted to DB:", result);
      localStorage.removeItem("formData");
    } catch (error) {
      console.error("Failed to submit offer:", error);
    }
  };

  return (
    <div className="p-4">
      {step === 1 && <PhaseOne onNext={goToNext} update={updateFormData} />}
      {step === 2 && <PhaseTwo onNext={goToNext} update={updateFormData} />}
      {step === 3 && (
        // @ts-expect-error: PhaseThree does not declare `onSubmit` in Props interface
        <PhaseThree data={formData} onSubmit={submitToDatabase} />
      )}
    </div>
  );
}
