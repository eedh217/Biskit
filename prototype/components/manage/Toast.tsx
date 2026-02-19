"use client";

import { useEffect } from "react";

interface Props {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 1500 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] animate-fade-in">
      <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg text-sm">
        {message}
      </div>
    </div>
  );
}
