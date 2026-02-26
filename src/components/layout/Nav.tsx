"use client";

import { useAppStore } from "@/store/useAppStore";
import { FiHome, FiCheckSquare, FiUsers, FiBarChart2 } from "react-icons/fi";

interface NavProps {
  rec: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function Nav({ rec, onStart, onStop }: NavProps) {
  const { tab, setTab } = useAppStore();

  const LEFT_TABS = [
    { id: "home" as const, icon: <FiHome />, label: "Home" },
    { id: "today" as const, icon: <FiCheckSquare />, label: "Today" },
  ];
  
  const RIGHT_TABS = [
    { id: "crm" as const, icon: <FiUsers />, label: "CRM" },
    { id: "pipeline" as const, icon: <FiBarChart2 />, label: "Pipeline" },
  ];

  return (
    <nav className="bg-[var(--nav)] border-t border-[var(--bord)] flex pt-2 pb-7 shrink-0 transition-colors duration-700">
      {LEFT_TABS.map((t) => (
        <NavItem 
          key={t.id} 
          icon={t.icon} 
          label={t.label} 
          active={tab === t.id} 
          onClick={() => setTab(t.id)} 
        />
      ))}
      
      <div className="flex-1 flex flex-col items-center gap-0.5">
        <div 
          className={`w-[52px] h-[52px] rounded-full bg-[var(--acc)] flex items-center justify-center -mt-5 mb-0.5 text-[21px] cursor-pointer shadow-[0_4px_22px_var(--glow)] transition-all duration-200 ${rec ? 'bg-red-500 animate-pulse shadow-[0_4px_40px_rgba(239,68,68,0.9)]' : ''}`}
          onClick={rec ? onStop : onStart}
        >
          {rec ? "🔴" : "🎙️"}
        </div>
        <span className="text-[9px] font-bold tracking-[0.04em] uppercase text-[var(--t3)]">Voice</span>
      </div>

      {RIGHT_TABS.map((t) => (
        <NavItem 
          key={t.id} 
          icon={t.icon} 
          label={t.label} 
          active={tab === t.id} 
          onClick={() => setTab(t.id)} 
        />
      ))}
    </nav>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <div 
      className={`flex-1 flex flex-col items-center gap-0.5 cursor-pointer py-1.5 ${active ? 'active group' : ''}`} 
      onClick={onClick}
    >
      <span className={`text-[19px] transition-transform duration-150 ${active ? '-translate-y-0.5 text-[var(--acc)]' : 'text-[var(--t3)]'}`}>
        {icon}
      </span>
      <span className={`text-[9px] font-bold tracking-[0.04em] uppercase transition-colors duration-150 ${active ? 'text-[var(--acc)]' : 'text-[var(--t3)]'}`}>
        {label}
      </span>
    </div>
  );
}