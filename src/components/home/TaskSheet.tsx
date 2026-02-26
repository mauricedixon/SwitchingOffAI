"use client";

import { useAppStore } from "@/store/useAppStore";
import { STATUS, PRIO } from "@/lib/mockData";

export default function TaskSheet({ task: t, onClose, onSt, onComplete }: any) {
  const statuses = ["not_started", "in_progress", "waiting", "done", "snoozed"];
  
  if (!t) return null;

  return (
    <div className="p-4 pt-1">
      <div className="w-10 h-1 rounded-full bg-[var(--bord)] mx-auto mb-4" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="font-['Bricolage_Grotesque'] text-[16px] font-bold text-[var(--t1)] flex-1 pr-3 leading-snug">
          {t.title}
        </div>
        <div onClick={onClose} className="text-[var(--t3)] cursor-pointer text-[19px]">✕</div>
      </div>
      
      <div className="mb-4">
        <div className="text-[10px] text-[var(--t3)] mb-2 font-bold tracking-[0.08em] uppercase">
          Update Status
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map(s => {
            const sc = STATUS[s as keyof typeof STATUS];
            const isActive = t.status === s;
            return (
              <div 
                key={s} 
                onClick={() => s === "done" ? onComplete(t.id) : onSt(t.id, s)} 
                className="px-3 py-2 rounded-full text-[12px] font-bold cursor-pointer transition-all duration-150"
                style={{ 
                  background: isActive ? sc.bg : "var(--surf)", 
                  border: `1px solid ${isActive ? sc.color : "var(--bord)"}`, 
                  color: isActive ? sc.color : "var(--t2)" 
                }}
              >
                {sc.icon} {sc.label}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex gap-2">
        {[
          ["Due", t.due, t.status === "overdue" ? "#F87171" : null],
          ["Priority", t.priority, PRIO[t.priority as keyof typeof PRIO]?.color],
          ["Source", t.src === "voice" ? "🎙️ Voice" : "✏️ Manual", null]
        ].map(([l, v, c]: any) => (
          <div key={l} className="flex-1 bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3">
            <div className="text-[10px] text-[var(--t3)] mb-1 font-semibold">{l}</div>
            <div className="text-[13px] font-bold" style={{ color: c || "var(--t1)" }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}