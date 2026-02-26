"use client";

import { useState, useRef, useCallback } from "react";
import DynamicTheme from "@/components/layout/DynamicTheme";
import StatusBar from "@/components/layout/StatusBar";
import Nav from "@/components/layout/Nav";
import HomeTab from "@/components/home/HomeTab";
import TodayTab from "@/components/home/TodayTab";
import CRMTab from "@/components/crm/CRMTab";
import PipelineTab from "@/components/pipeline/PipelineTab";
import ChillDashboard from "@/components/boundary/ChillDashboard";
import PermissionToStopCard from "@/components/boundary/PermissionToStop";
import VoiceOverlay from "@/components/capture/VoiceOverlay";
import TaskSheet from "@/components/home/TaskSheet";
import ContactDetail from "@/components/crm/ContactDetail";
import DealDetail from "@/components/pipeline/DealDetail";

import { useAppStore } from "@/store/useAppStore";
import { INITIAL_TASKS, INITIAL_DEALS, INITIAL_CONTACTS, COMMANDS } from "@/lib/mockData";

export default function Page() {
  const { mode, tab, toast, setMode, setToast } = useAppStore();
  
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [contacts] = useState(INITIAL_CONTACTS);
  
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [vPhase, setVPhase] = useState("idle");
  const [vText, setVText] = useState("");
  const [vResp, setVResp] = useState("");
  const [showPTS, setShowPTS] = useState(false);
  const [rec, setRec] = useState(false);
  
  const [selC, setSelC] = useState<any>(null);
  const [selD, setSelD] = useState<any>(null);
  const [taskSheet, setTaskSheet] = useState<any>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, [setToast]);

  const startVoice = useCallback(async () => {
    if (vPhase !== "idle") return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Cleanup stream
        stream.getTracks().forEach(track => track.stop());

        setVPhase("processing");
        setVText("Processing audio...");

        try {
          const formData = new FormData();
          formData.append("file", audioBlob, "recording.webm");

          const response = await fetch("/api/whisper", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
          }

          const data = await response.json();
          
          setVText(data.text);
          setVPhase("response");
          setVResp(data.resp);

          // Handle side effects
          if (data.fx === "moveAcme") {
            setDeals((p: any) => p.map((d: any) => d.id === "d1" ? { ...d, stage: 3, status: "active", health: 7, days: 0 } : d));
            notify("Acme → Negotiation ✓");
          } else if (data.fx === "createTask") {
            const newTask = {
              id: "t_" + Date.now(),
              title: data.data?.title || "New Task",
              status: "not_started",
              priority: data.data?.priority || "P2",
              due: data.data?.due || "Today",
              contact: data.data?.contact || null,
              dealId: data.data?.dealId || null,
              src: "voice"
            };
            setTasks((p: any) => {
              const updatedTasks = [newTask, ...p];
              // Small timeout to allow the tasks to update before notifying
              setTimeout(() => notify("Task Created ✓"), 100);
              return updatedTasks;
            });
          } else if (data.fx === "updateDeal") {
             const stageMapping: Record<string, number> = { "lead": 0, "outreach": 1, "proposal": 2, "negotiation": 3, "decision": 4, "won": 5, "lost": 6 };
             const s = data.data?.stage?.toLowerCase();
             const newStage = s && stageMapping[s] !== undefined ? stageMapping[s] : undefined;
             setDeals((p: any) => p.map((d: any) => {
               if (d.id === data.data?.dealId) {
                  return { ...d, ...(newStage !== undefined ? { stage: newStage, days: 0 } : {}) };
               }
               return d;
             }));
             notify("Deal Updated ✓");
          } else if (data.fx === "endDay") {
            setTimeout(() => {
              setShowPTS(true);
              setVoiceOpen(false);
              setVPhase("idle");
            }, 1500);
          }
          
        } catch (error) {
          // In Next.js dev, console.error shows a blocking overlay. 
          // We'll just update the UI gracefully instead.
          setVText("Error processing voice command.");
          setVPhase("response");
          setVResp("Sorry, I ran into an issue.");
        }
      };

      mediaRecorder.start();
      setRec(true);
      setVPhase("recording");
      setVoiceOpen(true);
      setVText("Listening...");
      setVResp("");
    } catch (err) {
      console.error("Microphone access denied:", err);
      notify("Microphone access denied");
    }
  }, [vPhase, notify]);

  const stopVoice = useCallback(() => {
    if (!rec || !mediaRecorderRef.current) return;
    setRec(false);
    mediaRecorderRef.current.stop();
  }, [rec]);

  const closeVoice = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setVoiceOpen(false);
    setVPhase("idle");
    setVText("");
    setVResp("");
    setRec(false);
  };

  const completeTask = (id: string) => {
    setTasks(p => p.map(t => t.id === id ? { ...t, status: "done" } : t));
    notify("Task completed ✓");
  };

  const doneCount = tasks.filter(t => t.status === "done").length;
  const pct = Math.round((doneCount / tasks.length) * 100);
  const isChill = mode === "chill";

  // Watch for transition mode
  if (mode === "transition" && !showPTS) {
    // Small timeout to allow render loop to complete before setting state
    setTimeout(() => setShowPTS(true), 0);
  }

  return (
    <DynamicTheme>
      {toast && (
        <div className="absolute top-[72px] left-4 right-4 bg-[var(--teal)] text-white rounded-xl py-2.5 px-4 text-[13px] font-bold z-[400] animate-[ta_3s_ease_forwards]">
          {toast}
        </div>
      )}
      
      <StatusBar />
      
      {isChill ? (
        <ChillDashboard onRec={startVoice} onRel={stopVoice} rec={rec} />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-8 no-scrollbar">
            {tab === "home" && <HomeTab tasks={tasks} deals={deals} done={doneCount} total={tasks.length} pct={pct} onTask={setTaskSheet} />}
            {tab === "today" && <TodayTab tasks={tasks} onComplete={completeTask} onTask={setTaskSheet} />}
            {tab === "crm" && <CRMTab contacts={contacts} onSel={setSelC} />}
            {tab === "pipeline" && <PipelineTab deals={deals} contacts={contacts} onSel={setSelD} />}
          </div>
          <Nav rec={rec} onStart={startVoice} onStop={stopVoice} />
        </>
      )}

      <VoiceOverlay isOpen={voiceOpen} phase={vPhase} text={vText} resp={vResp} onClose={closeVoice} onStop={stopVoice} />
      
      <PermissionToStopCard 
        show={showPTS} 
        onConfirm={() => {
          setShowPTS(false);
          setMode("chill");
        }}
        onStay={() => {
          setShowPTS(false);
          setMode("work");
        }}
      />
      
      <div className={`absolute inset-0 z-[100] bg-[var(--bg)] rounded-[48px] overflow-y-auto no-scrollbar transition-all duration-300 ${selC ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
        {selC && <ContactDetail contact={selC} deals={deals} onBack={() => setSelC(null)} />}
      </div>
      
      <div className={`absolute inset-0 z-[100] bg-[var(--bg)] rounded-[48px] overflow-y-auto no-scrollbar transition-all duration-300 ${selD ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
        {selD && <DealDetail deal={selD} contacts={contacts} tasks={tasks} deals={deals} setDeals={setDeals} onBack={() => setSelD(null)} notify={notify} />}
      </div>
      
      <div className={`absolute bottom-0 left-0 right-0 z-[150] bg-[var(--bg2)] rounded-t-[22px] p-4 pb-10 border-t border-[var(--bord)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${taskSheet ? 'translate-y-0' : 'translate-y-full'}`}>
        {taskSheet && <TaskSheet 
          task={taskSheet} 
          onClose={() => setTaskSheet(null)} 
          onComplete={completeTask} 
          onSt={(id: string, s: string) => {
            setTasks(p => p.map(t => t.id === id ? { ...t, status: s } : t));
            setTaskSheet(null);
            notify("Status updated");
          }} 
          onEdit={(id: string, newTitle: string) => {
            setTasks(p => p.map(t => t.id === id ? { ...t, title: newTitle } : t));
            setTaskSheet(null);
            notify("Task updated");
          }}
          onDelete={(id: string) => {
            setTasks(p => p.filter(t => t.id !== id));
            setTaskSheet(null);
            notify("Task deleted");
          }}
        />}
      </div>
    </DynamicTheme>
  );
}
