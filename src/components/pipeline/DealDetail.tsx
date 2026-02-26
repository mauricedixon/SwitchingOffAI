"use client";

import { useAppStore } from "@/store/useAppStore";
import { STAGES, STAGE_COLORS, STATUS } from "@/lib/mockData";

export default function DealDetail({ deal: d, contacts, tasks, deals, setDeals, onBack, notify }: any) {
  if (!d) return null;
  
  const contact = contacts.find((c: any) => c.id === d.cid);
  const linked = tasks.filter((t: any) => t.dealId === d.id);
  const deal = deals.find((x: any) => x.id === d.id) || d;
  
  const moveStage = (dir: number) => {
    const newStage = Math.max(0, Math.min(6, deal.stage + dir));
    setDeals((prev: any[]) => prev.map(x => x.id === d.id ? { ...x, stage: newStage, days: 0, status: "active" } : x));
    notify(`Moved to ${STAGES[newStage]}`);
  };

  return (
    <div className="p-5 pt-12 pb-10 h-full overflow-y-auto no-scrollbar">
      <div className="flex items-center gap-3 mb-5">
        <div 
          className="w-9 h-9 rounded-full bg-[var(--surf)] border border-[var(--bord)] flex items-center justify-center cursor-pointer text-[17px] text-[var(--t1)] shrink-0 active:scale-95 transition-transform" 
          onClick={onBack}
        >
          ←
        </div>
        <div className="font-['Bricolage_Grotesque'] text-[17px] font-extrabold text-[var(--t1)] flex-1 leading-snug">
          {deal.name}
        </div>
      </div>

      <div className="bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-4 mb-3">
        <div className="flex justify-between mb-2.5">
          <div className="text-[11px] text-[var(--t3)] font-bold uppercase tracking-[0.06em]">Stage</div>
          <div className="font-['JetBrains_Mono'] text-[12px] text-[var(--gold)]">${(deal.value || 0).toLocaleString()}</div>
        </div>
        
        <div className="flex gap-1 mb-3.5">
          {STAGES.slice(0, 5).map((s, i) => (
            <div 
              key={s} 
              className="flex-1 h-1.5 rounded-full transition-colors duration-300" 
              style={{ background: i <= deal.stage ? STAGE_COLORS[i] : "var(--bg3)" }}
            />
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-[16px] font-extrabold font-['Bricolage_Grotesque']" style={{ color: STAGE_COLORS[deal.stage] }}>
            {STAGES[deal.stage]}
          </div>
          <div className="flex gap-2">
            <div 
              className="w-8 h-8 rounded-lg bg-[var(--surf)] border border-[var(--bord)] text-[var(--t2)] flex items-center justify-center cursor-pointer text-[14px] active:scale-95 transition-all" 
              onClick={() => moveStage(-1)}
            >
              ←
            </div>
            <div 
              className="w-8 h-8 rounded-lg bg-[var(--acc)] text-white flex items-center justify-center cursor-pointer text-[14px] active:scale-95 transition-all" 
              onClick={() => moveStage(1)}
            >
              →
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 my-3">
        <div className="flex-1 bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3 text-center">
          <div className="font-['Bricolage_Grotesque'] text-[22px] font-extrabold" style={{ color: deal.days > 7 ? "#F87171" : deal.days > 3 ? "#FBBF24" : "#34D399" }}>
            {deal.days}d
          </div>
          <div className="text-[10px] font-semibold text-[var(--t3)] mt-0.5 tracking-[0.04em]">In Stage</div>
        </div>
        <div className="flex-1 bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3 text-center">
          <div className="font-['Bricolage_Grotesque'] text-[22px] font-extrabold" style={{ color: deal.health >= 7 ? "#34D399" : deal.health >= 4 ? "#FBBF24" : "#F87171" }}>
            {deal.health}/10
          </div>
          <div className="text-[10px] font-semibold text-[var(--t3)] mt-0.5 tracking-[0.04em]">Health</div>
        </div>
        <div className="flex-1 bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3 text-center">
          <div className="font-['Bricolage_Grotesque'] text-[22px] font-extrabold text-[var(--t1)]">
            {linked.length}
          </div>
          <div className="text-[10px] font-semibold text-[var(--t3)] mt-0.5 tracking-[0.04em]">Tasks</div>
        </div>
      </div>

      <div className="bg-[var(--surf)] border border-[var(--bord)] border-l-4 border-l-[var(--teal)] rounded-xl p-4 mb-3">
        <div className="text-[9px] font-extrabold text-[var(--teal)] mb-1.5 tracking-[0.1em] uppercase">🤖 AI Next Action</div>
        <div className="text-[13px] text-[var(--t2)] leading-relaxed">{deal.next}</div>
      </div>

      {contact && (
        <>
          <div className="flex items-center justify-between my-4 mb-2.5">
            <span className="font-['Bricolage_Grotesque'] text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--t3)]">Primary Contact</span>
          </div>
          <div className="bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3.5 flex items-center gap-3 cursor-default">
            <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center font-['Bricolage_Grotesque'] text-[13px] font-extrabold text-white shrink-0" style={{ background: contact.color }}>
              {contact.init}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-bold text-[var(--t1)] mb-0.5">{contact.name}</div>
              <div className="text-[11px] text-[var(--t3)] overflow-hidden text-ellipsis whitespace-nowrap">{contact.role} · {contact.co}</div>
            </div>
            <span className="font-['JetBrains_Mono'] text-[10px]" style={{ color: contact.last > contact.cadence ? "#F87171" : "var(--t3)" }}>
              {contact.last}d ago
            </span>
          </div>
        </>
      )}

      {linked.length > 0 && (
        <>
          <div className="flex items-center justify-between my-4 mb-2.5">
            <span className="font-['Bricolage_Grotesque'] text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--t3)]">Linked Tasks</span>
          </div>
          {linked.map((t: any) => {
            const sc = STATUS[t.status as keyof typeof STATUS];
            return (
              <div key={t.id} className="bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3 mb-2 flex items-center gap-2.5">
                <span className="text-[13px]">{sc.icon}</span>
                <div className={`flex-1 text-[12px] ${t.status === "done" ? "text-[var(--t3)] line-through" : "text-[var(--t1)]"}`}>
                  {t.title}
                </div>
                <span className="font-['JetBrains_Mono'] text-[10px]" style={{ color: t.status === "overdue" ? "#F87171" : "var(--t3)" }}>
                  {t.due}
                </span>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}