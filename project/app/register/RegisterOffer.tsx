"use client"

import { useState } from "react";
import PhaseOne from "./PhaseOne";
import PhaseTwo from "./PhaseTwo";
import PhaseThree from "./PhaseThree";
import axios from "axios";

export default function RegisterOffer() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    image: "",
    serial: "",
    mobile: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (name: string, value: string | File) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      await axios.post("/api/register/", data);
      setMessage("Registered successfully");
    } catch (err) {
      setMessage("Failed to register");
    }
  };

  return (
    <div className="flex justify-center items-start pt-8 bg-gray-100 dark:bg-base-200 p-8">
      <div className="w-full max-w-4xl bg-white dark:bg-base-300 rounded-lg shadow-md">
        {/* Conditional rendering based on step */}
        {step === 0 && <PhaseOne data={form} onChange={handleChange} next={() => setStep(1)} />}
        {step === 1 && <PhaseTwo data={form} onChange={handleChange} next={() => setStep(2)} back={() => setStep(0)} />}
        {step === 2 && <PhaseThree data={form} onChange={handleChange} submit={handleSubmit} back={() => setStep(1)} />}
        
        {/* Message to display feedback */}
        {message && <p className="text-center text-sm mt-4 text-red-500 dark:text-red-400">{message}</p>}
      </div>
    </div>
  );
}
