"use client";

import { useState } from "react";

interface Props {
  onNext: () => void;
  update: (data: any) => void;
}

export default function PhaseTwo({ onNext, update }: Props) {
  const [serials, setSerials] = useState<string[]>([""]);

  const handleChange = (index: number, value: string) => {
    const updated = [...serials];
    updated[index] = value;
    setSerials(updated);
  };

  const addField = () => setSerials([...serials, ""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update({ serialNumbers: serials });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {serials.map((val, i) => (
        <input
          key={i}
          value={val}
          onChange={(e) => handleChange(i, e.target.value)}
          placeholder={`Serial Number ${i + 1}`}
          className="w-full border p-2 rounded"
          required
        />
      ))}
      <button type="button" onClick={addField} className="text-blue-600 underline">Add another</button>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
    </form>
  );
}
