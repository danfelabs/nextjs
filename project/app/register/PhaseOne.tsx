"use client"

import { useEffect, useState } from "react";
import locationData from "./location.json";

interface Props {
  data: any;
  onChange: (name: string, value: string | File) => void;
  next: () => void;
}

export default function PhaseOne({ data, onChange, next }: Props) {
  const [district, setDistrict] = useState("");
  const [palikaType, setPalikaType] = useState("");
  const [ward, setWard] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState({ name: "", email: "", location: "", image: "" });
  const [touched, setTouched] = useState({ name: false, email: false, location: false });
  const [emailExists, setEmailExists] = useState(false);

  const LOCATION_DATA = locationData;
  const districts = [...new Set(LOCATION_DATA.map(l => l.district))];
  const palikaMap = LOCATION_DATA.filter(l => l.district === district).reduce((acc: Record<string, number>, curr) => {
    const key = `${curr.palika} ${curr.type}`;
    if (!acc[key] || acc[key] < curr.ward) acc[key] = curr.ward;
    return acc;
  }, {});
  const palikaOptions = Object.entries(palikaMap).map(([key, maxWard]) => ({ key, maxWard }));
  const selectedMaxWard = palikaOptions.find(p => p.key === palikaType)?.maxWard || 9;
  const wards = Array.from({ length: selectedMaxWard }, (_, i) => `${i + 1}`);

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid =
    data.name.trim() &&
    isEmailValid(data.email) &&
    !emailExists &&
    district &&
    palikaType &&
    ward &&
    imagePreview;

  const checkEmailExists = async (email: string) => {
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const result = await res.json();
      setEmailExists(result.exists);
    } catch (err) {
      console.error("Email check failed");
    }
  };

  const validateField = (field: string) => {
    setErrors(prev => {
      const updated = { ...prev };
      if (field === "name") updated.name = !data.name ? "Name is required" : "";
      if (field === "email") {
        if (!data.email) updated.email = "Email is required";
        else if (!isEmailValid(data.email)) updated.email = "Invalid email format";
        else if (emailExists) updated.email = "Email already registered";
        else updated.email = "";
      }
      if (field === "location") {
        updated.location = !district || !palikaType || !ward ? "Location is required" : "";
      }
      return updated;
    });
  };

  useEffect(() => {
    if (data.email && isEmailValid(data.email)) {
      checkEmailExists(data.email);
    }
  }, [data.email]);

  useEffect(() => {
    if (district && palikaType && ward) {
      const locationString = `${district}, ${palikaType}, Ward ${ward}`;
      onChange("location", locationString);
    }
  }, [district, palikaType, ward]);

  const handleImageUpload = async (file: File) => {
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setErrors(prev => ({ ...prev, image: "Only JPG or PNG allowed" }));
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/storage", { method: "POST", body: formData });
    const result = await res.json();
    if (res.ok && result.url) {
      onChange("image", result.url);
      setImagePreview(result.url);
      setErrors(prev => ({ ...prev, image: "" }));
    } else {
      setErrors(prev => ({ ...prev, image: "Image upload failed" }));
    }
  };

  const ValidTick = () => <span className="text-green-800 ml-2 animate-bounce">✓</span>;

  return (
    <div className="space-y-6 p-6 bg-base-200 dark:bg-base-900 rounded-lg shadow-md">

      <div className="mb-8">
        <div className="flex items-center justify-between text-sm font-semibold text-gray-400">
          <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-base-900 font-bold border border-base-300">1</div>
            <span className="text-white">Personal Information</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 text-gray-400">2</div>
            <span className="hidden sm:inline">Serial Number Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 text-gray-400">3</div>
            <span className="hidden sm:inline">Mobile Number Verification</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-400">Fill your basic personal details and upload image of your bill to begin registration.</p>
      </div>


      <fieldset className="space-y-2">
        <legend className="text-md font-bold text-white">What is your name?</legend>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter your name"
            value={data.name}
            onBlur={() => {
              setTouched(prev => ({ ...prev, name: true }));
              validateField("name");
            }}
            onChange={e => onChange("name", e.target.value)}
            className="input input-bordered w-full dark:bg-base-800 dark:text-white"
          />
          {data.name && !errors.name && <ValidTick />}
        </div>
        {touched.name && errors.name && <p className="text-sm animate-pulse">{errors.name}</p>}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-md font-bold text-white">What is your email?</legend>
        <div className="relative">
          <input
            type="email"
            placeholder="Enter your email"
            value={data.email}
            onBlur={() => {
              setTouched(prev => ({ ...prev, email: true }));
              validateField("email");
            }}
            onChange={e => onChange("email", e.target.value)}
            className="input input-bordered w-full dark:bg-base-800 dark:text-white"
          />
          {data.email && !errors.email && isEmailValid(data.email) && !emailExists && <ValidTick />}
        </div>
        {touched.email && errors.email && <p className="text-sm animate-pulse">{errors.email}</p>}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-white">What is your location?</legend>
        <select
          value={district}
          onChange={e => {
            setDistrict(e.target.value);
            setPalikaType("");
            setWard("");
            setTouched(prev => ({ ...prev, location: true }));
            validateField("location");
          }}
          className="select select-bordered w-full dark:bg-base-800 dark:text-white"
        >
          <option value="">Select your district</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={palikaType}
          onChange={e => {
            setPalikaType(e.target.value);
            setWard("");
            setTouched(prev => ({ ...prev, location: true }));
            validateField("location");
          }}
          className="select select-bordered w-full dark:bg-base-800 dark:text-white"
          disabled={!district}
        >
          <option value="">Select your palika</option>
          {palikaOptions.map(p => (
            <option key={p.key} value={p.key}>{p.key}</option>
          ))}
        </select>

        <select
          value={ward}
          onChange={e => {
            setWard(e.target.value);
            setTouched(prev => ({ ...prev, location: true }));
            validateField("location");
          }}
          className="select select-bordered w-full dark:bg-base-800 dark:text-white"
          disabled={!palikaType}
        >
          <option value="">Select your ward</option>
          {wards.map(w => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
        {touched.location && errors.location && <p className="text-sm animate-pulse">{errors.location}</p>}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-md font-bold text-white">Upload your image</legend>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={e => e.target.files && handleImageUpload(e.target.files[0])}
          className="file-input file-input-bordered w-full dark:bg-base-800 dark:text-white"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="w-full mt-4 rounded shadow-lg" />
        )}
        {errors.image && <p className="text-sm animate-pulse">{errors.image}</p>}
        <p className="text-sm text-gray-500">Max file size: 2MB</p>
      </fieldset>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => {
            validateField("name");
            validateField("email");
            validateField("location");
            if (isFormValid) next();
          }}
          disabled={!isFormValid}
          className="btn btn-ghost text-white dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
