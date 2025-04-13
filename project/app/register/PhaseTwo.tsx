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
    <div className="space-y-6 p-6 bg-base-200 dark:bg-base-900 rounded-lg shadow-md">

        <div className="mb-8">
          <div className="flex items-center justify-between text-sm font-semibold text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 text-gray-400">1</div>
              <span className="hidden sm:inline">Personal Information</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-base-900 font-bold border border-base-300">2</div>
              <span className="text-white">Serial Number Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 text-gray-400">3</div>
              <span className="hidden sm:inline">Mobile Number Verification</span>
            </div>
          </div>

           <p className="mt-2 text-sm text-gray-400">Please scan the SN located just below the barcode as shown below:</p>
        </div>

      <div className="space-y-4">       
        
        <img
          src="images/sample-image-sn.jpg"
          alt="Sample Serial Number"
          className="rounded-lg w-full max-w-md border border-gray-700"
        />
      </div> 
    
      {/* OCR scanning component */}
      <OCR
        onSerialDetected={handleSerialDetected}
      />

      {/* Serial Number Field (Styled Centered Input) */}
      <div className="flex justify-center my-4">
        <input
          type="text"
          placeholder="Scanned serial number"
          value={data.serial}
          className="input input-bordered text-center text-md font-semibold w-full max-w-md"
          disabled
        />
      </div>

      {/* Add More Button with Icon */}
      {serialNumbers.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={handleAddMore}
            className="btn btn-outline flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add More Serial Numbers
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={back}
          className="btn btn-ghost text-white dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-600"
        >
          BACK
        </button>

        {serialNumbers.length > 0 && (
          <button
            onClick={next}
            className="btn btn-ghost text-white dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-600 animate-pulse"
          >
            NEXT
          </button>
        )}
      </div>
    </div>
  );
}
