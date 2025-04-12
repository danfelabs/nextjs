"use client";

import { useRef, useEffect, useState } from "react";
import Tesseract from "tesseract.js";

interface OCRProps {
  onSerialDetected: (serial: string) => void; // Only serial number detection here
}

export default function OCR({ onSerialDetected }: OCRProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [serialNumbers, setSerialNumbers] = useState<string[]>([]);

  // Start camera feed on component mount
  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    };

    startCamera();

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null; // Cleanup the stream
      }
    };
  }, []);

  // Function to process OCR and extract SN numbers
  const scanForSerialNumber = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    context?.drawImage(videoRef.current, 0, 0, width, height); // Capture frame

    // Use Tesseract.js to run OCR
    Tesseract.recognize(
      canvasRef.current,
      "eng",
      {
        logger: (m) => console.log(m), // Optional logger
      }
    ).then(({ data: { text } }) => {
      const serialNumberRegex = /SN:\s*(\w+[\d\w]*)/i;
      const match = text.match(serialNumberRegex);

      if (match && match[1]) {
        const newSerial = match[1];
        if (!serialNumbers.includes(newSerial)) {
          setSerialNumbers((prev) => [...prev, newSerial]);
          onSerialDetected(newSerial); // Trigger callback to update serial
        }
      }
    });
  };

  // Call scanForSerialNumber every 3 seconds to capture and process video frames
  useEffect(() => {
    const interval = setInterval(() => {
      scanForSerialNumber();
    }, 3000); // Scan every 3 seconds

    return () => clearInterval(interval);
  }, [serialNumbers]);

  return (
    <div className="relative">
      {/* Video Feed */}
      <video ref={videoRef} style={{ display: "block" }} className="w-full h-auto" />

      {/* Hidden canvas for OCR processing */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}
