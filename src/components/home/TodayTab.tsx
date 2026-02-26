"use client";

import { useState } from "react";
import { STATUS, PRIO } from "@/lib/mockData";

export default function TodayTab({ tasks, onComplete, onTask }: any) {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "overdue", "in_progress", "not_started", "waiting", "done"];
  
  const filteredTasks = filter === "all" ? tasks : tasks.filter((t: any) => t.status === filter);
  const doneCount = tasks.filter((t: any) => t.status === "done").length;
  const overdueCount = tasks.filter((t: any) => t.status === "overdue").length;

  return (
    <>
      <div className="pt-6">
        <div className="font-['Bricolage_Grotesque'] text-[23px] font-extrabold text-[var(--t1)] mb-1">Today's Hub</div>
        <div className="text-[12px] text-[var(--t2)]">{doneCount} done · {overdueCount} overdue</div>
      </div>
      
      <div className="flex gap-2 my-3.5 overflow-x-auto no-scrollbar pb-0.5">
        {filters.map(x => (
          <div 
            key={x} 
            className="px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer transition-all duration-150 shrink-0 tracking-[0.02em] border"
            onClick={() => setFilter(x)}
            style={{ 
              background: filter === x ? "var(--acc)" : "var(--surf)", 
              color: filter === x ? "#fff" : "var(--t2)", 
              borderColor: filter === x ? "var(--acc)" : "transparent" 
            }}
          >
            {STATUS[x as keyof typeof STATUS]?.icon || "◈"} {x === "all" ? "All" : STATUS[x as keyof typeof STATUS]?.label || x}
          </div>
        ))}
      </div>
      
      {filteredTasks.length === 0 && (
        <div className="text-center py-10 px-5 text-[var(--t3)] text-sm">No tasks in this category</div>
      )}
      
      {filteredTasks.map((t: any) => (
        <TaskCard key={t.id} task={t} onComplete={onComplete} onClick={() => onTask(t)} />
      ))}
    </>
  );
}

function TaskCard({ task: t, onComplete, onClick }: any) {
  const sc = STATUS[t.status as keyof typeof STATUS] || STATUS.not_started;
  const pc = PRIO[t.priority as keyof typeof PRIO] || PRIO.P2;
  const isDone = t.status === "done";
  
  return (
    <div className={`bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3.5 flex items-start gap-3 mb-2 cursor-pointer transition-all duration-200 active:scale-95 ${isDone ? "opacity-70" : ""}`} onClick={onClick}>
      <div 
        className="w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 text-[11px] cursor-pointer transition-all duration-200 mt-0.5"
        style={{ 
          borderColor: isDone ? "var(--teal)" : sc.color, 
          background: isDone ? "var(--teal)" : "transparent", 
          color: isDone ? "#fff" : "transparent" 
        }}
        onClick={(e) => { e.stopPropagation(); if (!isDone) onComplete(t.id); }}
      >
        {isDone ? "✓" : ""}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium leading-snug mb-1.5 ${isDone ? "line-through text-[var(--t3)]" : "text-[var(--t1)]"}`}>
          {t.title}
        </div>
        <div className="flex gap-1.5 flex-wrap items-center">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-[0.02em]" style={{ background: sc.bg, color: sc.color }}>
            {sc.icon} {sc.label}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-[0.02em]" style={{ background: `${pc.color}18`, color: pc.color }}>
            {t.priority}
          </span>
          {t.contact && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-[0.02em] bg-[var(--bg3)] text-[var(--t2)]">
              👤 {t.contact.split(" ")[0]}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="font-['JetBrains_Mono'] text-[10px]" style={{ color: t.status === "overdue" ? "#F87171" : "var(--t3)" }}>
          {t.due}
        </span>
        <span className="text-[10px] text-[var(--t3)]">{t.src === "voice" ? "🎙️" : "✏️"}</span>
      </div>
    </div>
  );
}