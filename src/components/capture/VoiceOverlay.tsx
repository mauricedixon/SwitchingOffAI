"use client";

export default function VoiceOverlay({ isOpen, phase, text, resp, onClose }: any) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[200] bg-[#030608]/95 flex flex-col pt-12 px-5 pb-8 rounded-[48px] transition-all duration-300">
      <button 
        className="absolute top-4 right-5 w-8 h-8 rounded-full bg-white/10 text-white text-[16px] flex items-center justify-center cursor-pointer border-none"
        onClick={onClose}
      >
        ✕
      </button>
      
      <div className="flex flex-col items-center mb-6">
        <div className={`w-[94px] h-[94px] rounded-full bg-[var(--acc)] flex items-center justify-center text-[38px] shadow-[0_0_40px_var(--glow)] transition-all ${phase === 'recording' ? 'animate-pulse scale-105' : ''} ${phase === 'processing' ? 'animate-spin bg-gradient-to-tr from-[var(--acc)] to-[var(--teal)]' : ''}`}>
          {phase === "processing" ? "⚙️" : "🎙️"}
        </div>
        <div className="font-['Bricolage_Grotesque'] text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--acc)] mt-4">
          {phase === "recording" ? "Listening…" : phase === "processing" ? "Processing…" : phase === "response" ? "Done ✓" : "Ready"}
        </div>
      </div>
      
    {text && (
      <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 mb-3 min-h-[52px] text-[15px] text-[var(--t1)] leading-relaxed italic">
        &quot;{text}&quot;
      </div>
    )}
      
      {resp ? (
        <div className="bg-[#6C5FFF]/10 border border-[#6C5FFF]/25 rounded-xl p-3.5 flex-1 overflow-y-auto no-scrollbar">
          <div className="text-[9px] font-extrabold tracking-[0.12em] uppercase text-[var(--acc)] mb-2">🤖 Switch AI</div>
          <div className="text-[13px] text-[#C4BDFF] leading-relaxed">{resp}</div>
        </div>
      ) : (
        <div className="text-[12px] text-[var(--t3)] text-center mt-3">
          Hold 🎙️ to speak · cycles through demo commands each press
        </div>
      )}
    </div>
  );
}