"use client";

import { useAppStore } from "@/store/useAppStore";

export default function PermissionToStopCard({ show, onConfirm, onStay }: any) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-[300] bg-[#030608]/95 backdrop-blur-sm flex flex-col items-center justify-center p-7 rounded-[48px]">
      <div className="text-[54px] mb-4 animate-bounce">🌙</div>
      <div className="font-['Bricolage_Grotesque'] text-[28px] font-extrabold text-[#34D399] text-center mb-2.5">
        You&apos;re Done for Today.
      </div>
      <div className="text-[13px] text-[var(--t2)] text-center mb-5 leading-relaxed max-w-[280px]">
        Everything is captured, filed, and ready for tomorrow.
      </div>
      
      <div className="w-full bg-[#34D399]/10 border border-[#34D399]/20 rounded-xl p-4 mb-5">
        {[
          "14 tasks in pipeline — top 3 locked for tomorrow",
          "2 follow-up reminders set for this week",
          "Acme deal — pricing task queued, Sarah notified",
          "All voice notes logged — nothing is lost"
        ].map((item, i) => (
          <div key={i} className="flex gap-2.5 py-1.5 text-[12px] text-[var(--t2)] leading-snug">
            <span className="text-[#34D399] font-extrabold shrink-0">✓</span>
            {item}
          </div>
        ))}
      </div>
      
      <div className="font-['Bricolage_Grotesque'] text-[15px] font-bold text-[#34D399] text-center mb-5 italic">
        &quot;Everything is handled. You earned this.&quot;
      </div>
      
      <button 
        className="w-full p-4 rounded-full bg-[#34D399] border-none text-white font-['Bricolage_Grotesque'] text-[17px] font-extrabold cursor-pointer shadow-[0_8px_30px_rgba(52,211,153,0.35)] transition-all duration-200 active:scale-95"
        onClick={onConfirm}
      >
        I'm Off 🌙
      </button>
      
      <div className="mt-4 text-[12px] text-[var(--t3)] cursor-pointer text-center" onClick={onStay}>
        Stay in work mode
      </div>
    </div>
  );
}