"use client";

import { useState } from "react";
import OCR from "./OCR"; // Import OCR component

interface Props {
  data: any;
  onChange: (name: string, value: string) => void;
  next: () => void;
  back: () => void;
}

export default function PhaseTwo({ data, onChange, next, back }: Props) {
  const [serialNumbers, setSerialNumbers] = useState<string[]>([]);

  // Update the serial number field when new serial is detected
  const handleSerialDetected = (serial: string) => {
    setSerialNumbers((prev) => [...prev, serial]);
    onChange("serial", serial); // Automatically update the serial field in the form
  };

  // Add more serial numbers by scanning again
  const handleAddMore = () => {
    setSerialNumbers((prev) => [...prev]); // Keep existing serial numbers when adding more
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Phase 2: Serial Number</h2>

      {/* Disabled serial number input field */}
      <input
        type="text"
        placeholder="Serial Number"
        value={data.serial}
        onChange={(e) => onChange("serial", e.target.value)}
        className="w-full border p-2 rounded"
        disabled
      />

      {/* Show 'Next' button only when serial numbers are detected */}
      {serialNumbers.length > 0 && (
        <div>
          <button
            onClick={next}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          >
            Next
          </button>
        </div>
      )}

      {/* OCR scanning component */}
      <OCR
        onSerialDetected={handleSerialDetected}
      />

      {/* Add More button below video */}
      {serialNumbers.length > 0 && (
        <button
          onClick={handleAddMore}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Add More Serial Numbers
        </button>
      )}

      <div className="flex justify-between mt-4">
        <button onClick={back} className="px-4 py-2 border rounded">
          Back
        </button>
      </div>
    </div>
  );
}
