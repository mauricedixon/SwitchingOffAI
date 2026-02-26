"use client";

import { useAppStore } from "@/store/useAppStore";
import { STAGES } from "@/lib/mockData";

export default function ContactDetail({ contact: c, deals, onBack }: any) {
  if (!c) return null;
  const linkedDeals = deals.filter((d: any) => c.deals.includes(d.id));

  return (
    <div className="p-5 pt-12 pb-8 h-full overflow-y-auto no-scrollbar">
      <div className="flex items-center gap-3 mb-5">
        <div 
          className="w-9 h-9 rounded-full bg-[var(--surf)] border border-[var(--bord)] flex items-center justify-center cursor-pointer text-[17px] text-[var(--t1)] shrink-0 active:scale-95 transition-transform" 
          onClick={onBack}
        >
          ←
        </div>
        <div className="font-['Bricolage_Grotesque'] text-[19px] font-extrabold text-[var(--t1)]">
          {c.name}
        </div>
      </div>

      <div className="flex gap-3.5 mb-4 items-center">
        <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center font-['Bricolage_Grotesque'] text-[20px] font-extrabold text-white shrink-0" style={{ background: c.color }}>
          {c.init}
        </div>
        <div>
          <div className="font-['Bricolage_Grotesque'] text-[18px] font-extrabold text-[var(--t1)]">{c.name}</div>
          <div className="text-[13px] text-[var(--t2)]">{c.role}</div>
          <div className="text-[12px] text-[var(--t3)]">{c.co}</div>
        </div>
      </div>

      <div className="bg-[var(--surf)] border border-[var(--bord)] border-l-4 border-l-[var(--acc)] rounded-xl p-4 mb-3">
        <div className="text-[9px] font-extrabold text-[var(--acc)] mb-1.5 tracking-[0.1em] uppercase">🤖 AI Summary</div>
        <div className="text-[13px] text-[var(--t2)] leading-relaxed">{c.summary}</div>
      </div>

      <div className="flex gap-2 my-3">
        <div className="flex-1 bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3 text-center">
          <div className="font-['Bricolage_Grotesque'] text-[22px] font-extrabold" style={{ color: c.last > c.cadence ? "#F87171" : "#34D399" }}>
            {c.last}d
          </div>
          <div className="text-[10px] font-semibold text-[var(--t3)] mt-0.5 tracking-[0.04em]">Last Contact</div>
        </div>
        <div className="flex-1 bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3 text-center">
          <div className="font-['Bricolage_Grotesque'] text-[22px] font-extrabold text-[var(--t1)]">{c.cadence}d</div>
          <div className="text-[10px] font-semibold text-[var(--t3)] mt-0.5 tracking-[0.04em]">Cadence</div>
        </div>
        <div className="flex-1 bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3 text-center">
          <div className="font-['Bricolage_Grotesque'] text-[22px] font-extrabold text-[var(--t1)]">{c.deals.length}</div>
          <div className="text-[10px] font-semibold text-[var(--t3)] mt-0.5 tracking-[0.04em]">Deals</div>
        </div>
      </div>

      {linkedDeals.length > 0 && (
        <>
          <div className="flex items-center justify-between my-4 mb-2.5">
            <span className="font-['Bricolage_Grotesque'] text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--t3)]">Linked Deals</span>
          </div>
          {linkedDeals.map((d: any) => (
            <div key={d.id} className="bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3.5 mb-2.5">
              <div className="flex justify-between items-center mb-1">
                <div className="text-[13px] font-bold text-[var(--t1)]">{d.name.split("—")[0].trim()}</div>
                <div className="font-['JetBrains_Mono'] text-[11px] text-[var(--gold)]">${(d.value || 0).toLocaleString()}</div>
              </div>
              <div className="text-[11px] text-[var(--t3)]">{STAGES[d.stage]} · {d.days}d in stage · Health {d.health}/10</div>
            </div>
          ))}
        </>
      )}

      <div className="flex items-center justify-between my-4 mb-2.5">
        <span className="font-['Bricolage_Grotesque'] text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--t3)]">Recent Notes</span>
      </div>
      {[
        "Responded positively to updated pricing — wants decision by EOW.",
        "Initial discovery call — identified 3 pain points. Strong fit for Enterprise.",
        "Intro via LinkedIn — expressed interest after reading the case study."
      ].map((n, i) => (
        <div key={i} className="bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3 mb-2">
          <div className="text-[9px] font-extrabold tracking-[0.1em] uppercase text-[var(--acc)] mb-1">🎙️ Voice Note · {i + 1}d ago</div>
          <div className="text-[12px] text-[var(--t2)] leading-relaxed italic">&quot;{n}&quot;</div>
        </div>
      ))}
    </div>
  );
}