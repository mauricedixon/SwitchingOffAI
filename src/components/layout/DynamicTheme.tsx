"use client";

import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";

export default function DynamicTheme({ children }: { children: React.ReactNode }) {
  const { mode, transitioning } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-8 bg-[#030608] gap-4 ${mode === 'chill' ? 'chill-mode' : ''}`}>
      <div className="text-center">
        <div className="font-['Bricolage_Grotesque'] text-3xl font-extrabold text-[#6C5FFF] tracking-tight">SwitchingOff AI</div>
        <div className="font-['JetBrains_Mono'] text-[10px] text-[#2A4060] mt-1">Command Center · v3 Interactive Build</div>
      </div>
      
      <div className="w-[390px] h-[844px] rounded-[48px] overflow-hidden relative bg-[var(--bg)] text-[var(--t1)] shadow-[0_50px_150px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)] flex flex-col transition-colors duration-700 ease-in-out select-none">
        <div className={`absolute inset-0 z-50 bg-[var(--acc)] pointer-events-none transition-opacity duration-300 rounded-[48px] ${transitioning ? 'opacity-100' : 'opacity-0'}`} />
        {children}
      </div>

      <div className="flex gap-2 flex-wrap justify-center mt-4">
        {/* Controls can go here */}
      </div>
    </div>
  );
}