"use client";

import { useAppStore } from "@/store/useAppStore";
import { STATUS, PRIO } from "@/lib/mockData";

export default function HomeTab({ tasks, deals, done, total, pct, onTask }: any) {
  const { mode, setMode, setTransitioning } = useAppStore();
  
  const top3 = tasks.filter((t: any) => t.status !== "done" && t.status !== "snoozed").slice(0, 3);
  const stalled = deals.filter((d: any) => d.status === "stalled");

  const switchMode = (m: any) => {
    setTransitioning(true);
    setTimeout(() => {
      setMode(m);
      setTransitioning(false);
      if (m === "chill") useAppStore.getState().setTab("home");
    }, 600);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[var(--surf)] to-[var(--bg3)] border border-[var(--bord)] border-l-4 border-l-[var(--gold)] rounded-2xl p-6 mt-6 mb-5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-[120px] h-[120px] rounded-full bg-[var(--glow)] pointer-events-none" />
        <div className="font-['JetBrains_Mono'] text-[10px] text-[var(--gold)] font-medium tracking-[0.08em] mb-1.5">
          📅 {new Date().toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" }).toUpperCase()} · MORNING BRIEFING
        </div>
        <div className="font-['Bricolage_Grotesque'] text-[21px] font-extrabold text-[var(--t1)] mb-2">
          Good morning 👋
        </div>
        <div className="text-[13px] text-[var(--t2)] leading-relaxed mb-3.5">
          <strong>{top3.length} priorities</strong> · <strong>{stalled.length} stalled</strong> · <strong>{tasks.filter((t: any) => t.status === "overdue").length} overdue</strong>
        </div>
        {top3.map((t: any) => (
          <div key={t.id} className="flex items-center gap-2.5 py-2 border-b border-[var(--bord)] last:border-0 last:pb-0 cursor-pointer" onClick={() => onTask(t)}>
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: PRIO[t.priority as keyof typeof PRIO]?.color || '#888' }} />
            <span className="text-[13px] text-[var(--t1)] flex-1 leading-snug font-medium">{t.title}</span>
            <span className="font-['JetBrains_Mono'] text-[10px] shrink-0" style={{ color: t.status === "overdue" ? "#F87171" : "var(--t3)" }}>{t.due}</span>
          </div>
        ))}
      </div>

      <div className="my-5">
        <div className="flex justify-between mb-2.5">
          <span className="text-xs text-[var(--t2)]">Progress</span>
          <span className="font-['JetBrains_Mono'] text-xs text-[var(--acc)]">{done}/{total}</span>
        </div>
        <div className="h-1.5 bg-[var(--bg3)] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[var(--teal)] to-[var(--acc)] rounded-full transition-all duration-600 ease-out" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="flex gap-3 my-5">
        <div className="flex-1 bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-4 transition-colors duration-700">
          <div className="font-['Bricolage_Grotesque'] text-2xl font-extrabold text-[var(--t1)]">{tasks.filter((t: any) => t.status !== "done").length}</div>
          <div className="text-[10px] font-semibold text-[var(--t3)] tracking-[0.04em] mt-0.5">Open Tasks</div>
        </div>
        <div className="flex-1 bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3 transition-colors duration-700">
          <div className="font-['Bricolage_Grotesque'] text-2xl font-extrabold text-[var(--t1)]">{deals.filter((d: any) => d.status === "active").length}</div>
          <div className="text-[10px] font-semibold text-[var(--t3)] tracking-[0.04em] mt-0.5">Active Deals</div>
        </div>
        <div className="flex-1 bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3 transition-colors duration-700">
          <div className="font-['Bricolage_Grotesque'] text-2xl font-extrabold" style={{ color: stalled.length > 0 ? "#F87171" : "#34D399" }}>{stalled.length}</div>
          <div className="text-[10px] font-semibold text-[var(--t3)] tracking-[0.04em] mt-0.5">Stalled</div>
        </div>
      </div>

      {stalled.length > 0 && (
        <>
          <div className="flex items-center justify-between my-4 mb-2.5">
            <span className="font-['Bricolage_Grotesque'] text-[11px] font-bold tracking-[0.1em] uppercase text-[#F87171]">⚠ Needs Attention</span>
          </div>
          {stalled.map((d: any) => (
            <div key={d.id} className="bg-red-500/5 border border-red-500/25 border-l-4 border-l-red-400 rounded-xl p-3.5 mb-2.5 cursor-pointer">
              <div className="text-[13px] font-bold text-[var(--t1)] mb-1">{d.name}</div>
              <div className="text-[11px] text-red-400 mb-1 font-semibold">Stalled {d.days}d</div>
              <div className="text-[11px] text-[var(--t2)] italic">💡 {d.next}</div>
            </div>
          ))}
        </>
      )}

      <div className="flex items-center justify-between my-4 mb-2.5">
        <span className="font-['Bricolage_Grotesque'] text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--t3)]">Quick Commands</span>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {["Morning briefing", "Open with Acme?", "Pipeline status", "Follow ups?", "I'm done today"].map((c) => (
          <div key={c} className="bg-[var(--surf)] border border-[var(--bord)] rounded-full px-3 py-1.5 text-[11px] text-[var(--t2)] whitespace-nowrap cursor-pointer shrink-0 transition-all duration-150 active:bg-[var(--acc)] active:text-white active:border-[var(--acc)]">
            🎙️ {c}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 mb-2.5">
        <span className="font-['Bricolage_Grotesque'] text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--t3)]">Switch Mode</span>
      </div>
      <div className="flex gap-2.5 my-5 mb-2">
        {[
          { id: "work", icon: "⚡", label: "Work" },
          { id: "transition", icon: "🌀", label: "Wind Down" },
          { id: "chill", icon: "🌙", label: "Chill" }
        ].map((m) => (
          <div 
            key={m.id} 
            className={`flex-1 p-2.5 rounded-xl border font-['Instrument_Sans'] text-[11px] font-bold cursor-pointer transition-all duration-200 flex flex-col items-center gap-1
              ${mode === m.id 
                ? 'bg-[var(--acc)] border-[var(--acc)] text-white' 
                : 'bg-[var(--surf)] border-[var(--bord)] text-[var(--t2)]'
              }`}
            onClick={() => switchMode(m.id)}
          >
            <span className="text-[17px]">{m.icon}</span>
            {m.label}
          </div>
        ))}
      </div>
    </>
  );
}