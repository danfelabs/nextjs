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

  const LOCATION_DATA = locationData;

  const districts = [...new Set(LOCATION_DATA.map(l => l.district))];

  const palikaMap = LOCATION_DATA
    .filter(l => l.district === district)
    .reduce((acc: Record<string, number>, curr) => {
      const key = `${curr.palika} ${curr.type}`;
      if (!acc[key] || acc[key] < curr.ward) acc[key] = curr.ward;
      return acc;
    }, {});

  const palikaOptions = Object.entries(palikaMap).map(([key, maxWard]) => ({ key, maxWard }));

  const selectedMaxWard = palikaOptions.find(p => p.key === palikaType)?.maxWard || 9;
  const wards = Array.from({ length: selectedMaxWard }, (_, i) => `${i + 1}`);

  useEffect(() => {
    if (district && palikaType && ward) {
      const locationString = `${district}, ${palikaType}, Ward ${ward}`;
      onChange("location", locationString);
    }
  }, [district, palikaType, ward]);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/storage", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (res.ok && result.url) {
      onChange("image", result.url);
    } else {
      alert("Failed to upload image");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Phase 1: Basic Info</h2>
      <input
        type="text"
        placeholder="Name"
        value={data.name}
        onChange={e => onChange("name", e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={data.email}
        onChange={e => onChange("email", e.target.value)}
        className="w-full border p-2 rounded"
      />

      <div className="grid grid-cols-3 gap-2">
        <select
          value={district}
          onChange={e => {
            setDistrict(e.target.value);
            setPalikaType("");
            setWard("");
          }}
          className="border p-2 rounded"
        >
          <option value="">Select District</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={palikaType}
          onChange={e => {
            setPalikaType(e.target.value);
            setWard("");
          }}
          className="border p-2 rounded"
          disabled={!district}
        >
          <option value="">Select Palika</option>
          {palikaOptions.map(p => (
            <option key={p.key} value={p.key}>{p.key}</option>
          ))}
        </select>

        <select
          value={ward}
          onChange={e => setWard(e.target.value)}
          className="border p-2 rounded"
          disabled={!palikaType}
        >
          <option value="">Select Ward</option>
          {wards.map(w => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={e => e.target.files && handleImageUpload(e.target.files[0])}
        className="w-full"
      />

      <button onClick={next} className="bg-red-500 text-white px-4 py-2 rounded">Next</button>
    </div>
  );
}
