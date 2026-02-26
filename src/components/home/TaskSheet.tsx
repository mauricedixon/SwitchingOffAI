"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { STATUS, PRIO } from "@/lib/mockData";

export default function TaskSheet({ task: t, onClose, onSt, onComplete, onEdit, onDelete }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(t?.title || "");
  const statuses = ["not_started", "in_progress", "waiting", "done", "snoozed"];
  
  if (!t) return null;

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit?.(t.id, editTitle.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="p-4 pt-1">
      <div className="w-10 h-1 rounded-full bg-[var(--bord)] mx-auto mb-4" />
      
      <div className="flex justify-between items-start mb-4">
        {isEditing ? (
          <div className="flex-1 pr-3 flex flex-col gap-2">
            <input 
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-[var(--surf)] border border-[var(--bord)] rounded-lg p-2 text-[15px] font-medium text-[var(--t1)] outline-none focus:border-[var(--acc)] transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditTitle(t.title);
                }
              }}
            />
            <div className="flex gap-2">
              <button 
                onClick={handleSave}
                className="px-3 py-1.5 bg-[var(--acc)] text-white rounded-md text-[12px] font-bold"
              >
                Save
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(t.title);
                }}
                className="px-3 py-1.5 bg-[var(--surf)] border border-[var(--bord)] text-[var(--t2)] rounded-md text-[12px] font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="font-['Bricolage_Grotesque'] text-[16px] font-bold text-[var(--t1)] flex-1 pr-3 leading-snug">
            {t.title}
          </div>
        )}
        <div onClick={onClose} className="text-[var(--t3)] cursor-pointer text-[19px]">✕</div>
      </div>

      {!isEditing && (
        <div className="flex gap-2 mb-4 pb-4 border-b border-[var(--bord)]">
          <button 
            onClick={() => setIsEditing(true)}
            className="flex-1 py-2 rounded-lg border border-[var(--bord)] bg-[var(--surf)] text-[12px] font-bold text-[var(--t2)] hover:bg-[var(--bg3)] transition-colors"
          >
            ✏️ Edit Title
          </button>
          <button 
            onClick={() => onDelete?.(t.id)}
            className="flex-1 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-[12px] font-bold text-red-500 hover:bg-red-500/20 transition-colors"
          >
            🗑️ Delete Task
          </button>
        </div>
      )}
      
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