"use client";

import { useState } from "react";

interface Props {
  onNext: () => void;
  update: (data: any) => void;
}

export default function PhaseOne({ onNext, update }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update(form);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" type="email" required />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border p-2 rounded" required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
    </form>
  );
}
