"use client";
import { useState, useEffect } from "react";

export const Toaster = () => {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    const handler = (e: CustomEvent) => setMsg(e.detail);
    window.addEventListener("toast", handler as EventListener);
    return () => window.removeEventListener("toast", handler as EventListener);
  }, []);
  if (!msg) return null;
  return (
    <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded-xl shadow-lg animate-fade-in">
      {msg}
    </div>
  );
};
