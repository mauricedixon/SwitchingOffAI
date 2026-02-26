"use client";

import { STAGES, STAGE_COLORS } from "@/lib/mockData";

export default function PipelineTab({ deals, onSel }: any) {
  const visibleStages = STAGES.slice(0, 5);
  const totalValue = deals.filter((d: any) => d.stage < 5).reduce((s: number, d: any) => s + (d.value || 0), 0);
  const stalledDeals = deals.filter((d: any) => d.status === "stalled");

  return (
    <>
      <div className="pt-6">
        <div className="font-['Bricolage_Grotesque'] text-[23px] font-extrabold text-[var(--t1)] mb-1">Pipeline</div>
        <div className="text-[12px] text-[var(--t2)]">{deals.filter((d: any) => d.stage < 5).length} active · ${totalValue.toLocaleString()} potential</div>
      </div>
      
      <div className="flex gap-2 mt-3.5 mb-3.5 overflow-x-auto no-scrollbar pb-1">
        {visibleStages.map((stageName, i) => {
          const count = deals.filter((d: any) => d.stage === i).length;
          return (
            <div 
              key={stageName} 
              className="bg-[var(--surf)] border border-[var(--bord)] rounded-xl py-2 px-3 flex flex-col items-center gap-0.5 min-w-[63px] cursor-pointer"
              style={{ borderBottom: `2px solid ${STAGE_COLORS[i]}` }}
            >
              <div className="font-['Bricolage_Grotesque'] text-[18px] font-extrabold" style={{ color: STAGE_COLORS[i] }}>{count}</div>
              <div className="text-[9px] text-[var(--t3)] font-semibold tracking-[0.04em]">{stageName}</div>
            </div>
          );
        })}
      </div>
      
      {stalledDeals.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/25 rounded-xl py-2.5 px-3.5 mb-3.5 flex gap-2.5 items-center">
          <span className="text-[19px]">⚠️</span>
          <div>
            <div className="text-[12px] font-bold text-[#F87171]">{stalledDeals.length} deals stalling</div>
            <div className="text-[11px] text-[var(--t2)]">Acme (6d) and Meridian (14d) need action</div>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
        <div className="flex gap-2.5 pb-3">
          {visibleStages.map((stageName, i) => {
            const stageDeals = deals.filter((d: any) => d.stage === i);
            return (
              <div key={stageName} className="min-w-[192px]">
                <div 
                  className="py-1.5 px-2.5 rounded-lg text-[10px] font-extrabold tracking-[0.06em] mb-2 flex justify-between items-center"
                  style={{ background: `${STAGE_COLORS[i]}18`, color: STAGE_COLORS[i] }}
                >
                  <span>{stageName}</span>
                  <span className="font-['JetBrains_Mono'] text-[10px]">{stageDeals.length}</span>
                </div>
                
                {stageDeals.length === 0 ? (
                  <div className="text-center py-4 px-1.5 text-[11px] text-[var(--t3)]">—</div>
                ) : (
                  stageDeals.map((d: any) => (
                    <DealCard key={d.id} deal={d} onClick={() => onSel(d)} />
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function DealCard({ deal: d, onClick }: any) {
  const healthColor = d.health >= 7 ? "#34D399" : d.health >= 4 ? "#FBBF24" : "#F87171";
  
  return (
    <div 
      className={`bg-[var(--surf)] border border-[var(--bord)] rounded-xl p-3 mb-2 cursor-pointer transition-all duration-200 active:scale-95 ${d.status === "stalled" ? "border-red-400/35" : ""}`} 
      onClick={onClick}
    >
      <div className="text-[13px] font-bold text-[var(--t1)] mb-1 leading-snug">{d.name.split("—")[0].trim()}</div>
      <div className="font-['JetBrains_Mono'] text-[11px] text-[var(--gold)] mb-1.5">${(d.value || 0).toLocaleString()}</div>
      
      {d.status === "stalled" && (
        <div className="text-[9px] text-[#F87171] font-extrabold mb-1.5 uppercase">⚠ STALLED {d.days}D</div>
      )}
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-[10px] text-[var(--t3)]">{d.act}</span>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, j) => (
            <div 
              key={j} 
              className="w-1.5 h-1.5 rounded-sm" 
              style={{ background: j < Math.round(d.health / 2) ? healthColor : "var(--bord)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}