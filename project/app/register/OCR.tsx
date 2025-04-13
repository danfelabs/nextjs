"use client";

import { useRef, useEffect, useState } from "react";
import Tesseract from "tesseract.js";

interface OCRProps {
  onSerialDetected: (serial: string) => void;
}

export default function OCR({ onSerialDetected }: OCRProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [serialNumbers, setSerialNumbers] = useState<string[]>([]);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    };
    startCamera();
    return () => {
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, []);

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    videoRef.current!.srcObject = null;
  };

  const scanForSerialNumber = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;

    canvasRef.current.width = width;
    canvasRef.current.height = height;
    context?.drawImage(videoRef.current, 0, 0, width, height);

    Tesseract.recognize(canvasRef.current, "eng", {
      logger: (m) => console.log(m),
    }).then(({ data: { text } }) => {
      const serialNumberRegex = /SN:\s*(\w+[\d\w]*)/i;
      const match = text.match(serialNumberRegex);
      if (match && match[1]) {
        const newSerial = match[1];
        if (!serialNumbers.includes(newSerial)) {
          setSerialNumbers((prev) => [...prev, newSerial]);
          onSerialDetected(newSerial);
          setScanning(false);
          stopCamera();
        }
      }
    });
  };

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(scanForSerialNumber, 3000);
      return () => clearInterval(interval);
    }
  }, [serialNumbers, scanning]);

  return (
    <div className="relative w-full max-w-md mx-auto border rounded overflow-hidden">
      <video
        ref={videoRef}
        className="w-full aspect-[3/1] object-cover"
        muted
        playsInline
      />
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>     
    </div>
  );
}
