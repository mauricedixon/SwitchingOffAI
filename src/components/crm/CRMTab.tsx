"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function CRMTab({ contacts, onSel }: any) {
  const [search, setSearch] = useState("");
  
  const filtered = contacts.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.co.toLowerCase().includes(search.toLowerCase())
  );
  
  const overdue = contacts.filter((c: any) => c.last > c.cadence);

  return (
    <>
      <div className="pt-6">
        <div className="font-['Bricolage_Grotesque'] text-[23px] font-extrabold text-[var(--t1)] mb-1">Relationships</div>
        <div className="text-[12px] text-[var(--t2)]">{contacts.length} contacts · {overdue.length} overdue</div>
      </div>
      
      <div className="relative my-3.5">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[var(--t3)]"><FiSearch /></span>
        <input 
          placeholder="Search contacts…" 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[var(--surf)] border border-[var(--bord)] rounded-xl py-2.5 px-3.5 pl-9 text-[var(--t1)] text-[13px] outline-none font-['Instrument_Sans'] placeholder:text-[var(--t3)]"
        />
      </div>
      
      {overdue.length > 0 && !search && (
        <div className="bg-[var(--surf)] border border-[var(--bord)] border-l-4 border-l-[var(--gold)] rounded-2xl p-4 mb-3.5 transition-colors duration-700">
          <div className="text-[10px] font-extrabold text-[var(--gold)] mb-2 tracking-[0.08em]">⏰ FOLLOW-UPS OVERDUE</div>
          {overdue.map((c: any) => (
            <div 
              key={c.id} 
              className="flex items-center gap-2 py-1.5 cursor-pointer border-b border-[var(--bord)] last:border-0 last:pb-0" 
              onClick={() => onSel(c)}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-['Bricolage_Grotesque'] text-[10px] font-extrabold text-white shrink-0" style={{ background: c.color }}>
                {c.init}
              </div>
              <div className="flex-1 text-[12px] font-semibold text-[var(--t1)]">{c.name}</div>
              <div className="text-[10px] text-[#F87171] font-['JetBrains_Mono']">{c.last}d ago</div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between my-4.5 mb-2.5">
        <span className="font-['Bricolage_Grotesque'] text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--t3)]">All Contacts</span>
        <span className="text-[12px] font-semibold text-[var(--acc)] cursor-pointer">+ Add</span>
      </div>
      
      {filtered.map((c: any) => <ContactCard key={c.id} contact={c} onClick={() => onSel(c)} />)}
    </>
  );
}

function ContactCard({ contact: c, onClick }: any) {
  const statusColor = { active: "#34D399", warm: "#FBBF24", cold: "#6B7280", inactive: "#F87171" }[c.stage as keyof typeof Object] || "#6B7280";
  const isOverdue = c.last > c.cadence;
  
  return (
    <div className="bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3.5 flex items-center gap-3 mb-2 cursor-pointer transition-all duration-200 active:scale-95" onClick={onClick}>
      <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center font-['Bricolage_Grotesque'] text-[13px] font-extrabold text-white shrink-0" style={{ background: c.color }}>
        {c.init}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-bold text-[var(--t1)] mb-0.5">{c.name}</div>
        <div className="text-[11px] text-[var(--t3)] overflow-hidden text-ellipsis whitespace-nowrap">{c.role} · {c.co}</div>
        <div className="flex gap-1.5 mt-1">
          {c.tags.map((t: string) => (
            <span key={t} className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--bg3)] text-[var(--t3)] font-bold">{t}</span>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <span className="font-['JetBrains_Mono'] text-[11px]" style={{ color: isOverdue ? "#F87171" : "var(--t3)" }}>
          {c.last}d ago
        </span>
        <div className="w-[7px] h-[7px] rounded-full" style={{ background: statusColor }} />
        {c.deals.length > 0 && (
          <span className="text-[9px] text-[var(--acc)] font-bold">💼 {c.deals.length}</span>
        )}
      </div>
    </div>
  );
}