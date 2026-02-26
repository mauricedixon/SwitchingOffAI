"use client";

import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";

export default function StatusBar() {
  const mode = useAppStore((state) => state.mode);
  const [time, setTime] = useState("");

  useEffect(() => {
    setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const config = {
    work: { label: "Work Mode", color: "#6C5FFF" },
    transition: { label: "Transitioning", color: "#FBBF24" },
    chill: { label: "Chill Mode", color: "#34D399" },
  }[mode];

  return (
    <div className="flex items-center justify-between px-6 pt-4 shrink-0">
      <span className="font-['JetBrains_Mono'] text-xs text-[var(--t1)]">{time}</span>
      <div 
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide"
        style={{ background: `${config.color}18`, border: `1px solid ${config.color}35` }}
      >
        <div 
          className="w-1.5 h-1.5 rounded-full animate-pulse opacity-100" 
          style={{ background: config.color }}
        />
        <span style={{ color: config.color }}>{config.label}</span>
      </div>
      <div className="text-[11px] text-[var(--t2)] flex gap-1.5">
        <span>●●●</span>
        <span>⚡</span>
      </div>
    </div>
  );
}