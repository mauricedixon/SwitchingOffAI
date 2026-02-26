"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

export default function ChillDashboard({ onRec, onRel, rec }: any) {
  const { setMode, setTransitioning, setTab } = useAppStore();
  const [time, setTime] = useState("");
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const unlockWork = () => {
    setTransitioning(true);
    setTimeout(() => {
      setMode("work");
      setTab("home");
      setTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isHolding) {
      // Start the progress animation
      controls.start({
        height: "100%",
        transition: { duration: 10, ease: "linear" }
      });
      
      // Track progress logically
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            unlockWork();
            return 100;
          }
          return prev + 1; // 1% every 100ms = 10 seconds total
        });
      }, 100);
    } else {
      // Reset if they let go early
      clearInterval(timer!);
      setProgress(0);
      controls.stop();
      controls.set({ height: "0%" });
    }

    return () => clearInterval(timer);
  }, [isHolding, controls]);

  return (
    <div className="flex-1 flex flex-col pt-10">
      <div className="flex-1 flex flex-col items-center justify-center p-5 text-center">
        <div className="font-['Bricolage_Grotesque'] text-[12px] font-bold text-[var(--t3)] tracking-[0.12em] uppercase">
          You&apos;re off the clock
        </div>
        <div className="font-['JetBrains_Mono'] text-[50px] font-normal text-[var(--acc)] my-4">
          {time}
        </div>
        <div className="font-['Bricolage_Grotesque'] text-[26px] font-extrabold text-[var(--t1)] mb-2.5">
          Enjoy your evening.
        </div>
        <div className="text-[13px] text-[var(--t2)] leading-relaxed max-w-[280px] text-center">
          Everything is captured and safe. Your work brain can fully rest. 🌙
        </div>
        
        <div className="flex gap-3.5 my-6">
          {["🌿", "☕", "📖", "🎵"].map(e => (
            <div key={e} className="w-14 h-14 rounded-full bg-[var(--surf)] border border-[var(--bord)] flex items-center justify-center text-[23px]">
              {e}
            </div>
          ))}
        </div>
        
        <div className="w-full mt-4">
          <div className="text-[10px] text-[var(--t3)] text-center mb-2 font-bold tracking-[0.08em] uppercase">
            Got a stray thought?
          </div>
          <div 
            className="w-full p-3 rounded-xl bg-[var(--surf)] border border-dashed border-[var(--bord)] text-[13px] text-[var(--t3)] cursor-pointer flex items-center justify-center gap-2 transition-all duration-200"
            onMouseDown={onRec} 
            onMouseUp={onRel} 
            onTouchStart={(e) => { e.preventDefault(); onRec(); }} 
            onTouchEnd={(e) => { e.preventDefault(); onRel(); }}
          >
            <span className="text-[19px]">{rec ? "🔴" : "🎙️"}</span>
            <span>{rec ? "Release to capture…" : "Hold to capture quick thought"}</span>
          </div>
        </div>
      </div>
      
      {/* The 10-Second Friction Wall Button */}
      <div className="p-5 flex flex-col items-center justify-center gap-3">
        <div className="text-[11px] text-[var(--t2)] font-medium">Do you really need to check work?</div>
        
        <motion.button
          onPointerDown={() => setIsHolding(true)}
          onPointerUp={() => setIsHolding(false)}
          onPointerLeave={() => setIsHolding(false)}
          className="relative w-48 h-12 rounded-full border border-[var(--bord)] bg-[var(--surf)] flex items-center justify-center overflow-hidden touch-none select-none"
        >
          <span className="z-10 text-[12px] font-bold text-[var(--t1)]">
            {isHolding ? `Hold to unlock... ${Math.floor(10 - (progress / 10))}s` : "Hold 10s to Unlock Work"}
          </span>
          
          {/* The filling animation */}
          <motion.div 
            className="absolute bottom-0 left-0 w-full bg-red-500/20"
            animate={controls}
            initial={{ height: "0%" }}
          />
        </motion.button>
      </div>
      
      <div className="bg-[var(--nav)] border-t border-[var(--bord)] flex items-center justify-center py-2.5 pb-7 mt-auto">
        <div className="flex items-center gap-2 py-1.5 px-5 rounded-full bg-[var(--surf)] border border-[var(--bord)]">
          <span>🌙</span>
          <span className="text-[12px] font-bold text-[var(--t2)]">Chill Mode Active</span>
        </div>
      </div>
    </div>
  );
}