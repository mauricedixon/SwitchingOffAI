import { useState, useEffect, useRef, useCallback } from "react";

const STAGES = ["Lead","Outreach","Proposal","Negotiation","Decision","Won","Lost"];
const STAGE_COLORS = ["#7C6FFF","#0E9B9A","#E09B22","#2EAA6A","#D94F3A","#22C87A","#888"];
const STATUS = {
  not_started:{label:"Not Started",color:"#777",bg:"rgba(119,119,119,0.12)",icon:"○"},
  in_progress:{label:"In Progress",color:"#F59E0B",bg:"rgba(245,158,11,0.12)",icon:"◑"},
  waiting:{label:"Waiting",color:"#60A5FA",bg:"rgba(96,165,250,0.12)",icon:"⏸"},
  done:{label:"Done",color:"#34D399",bg:"rgba(52,211,153,0.12)",icon:"✓"},
  snoozed:{label:"Snoozed",color:"#A78BFA",bg:"rgba(167,139,250,0.12)",icon:"⏰"},
  overdue:{label:"Overdue",color:"#F87171",bg:"rgba(248,113,113,0.12)",icon:"!"},
};
const PRIO = {
  P0:{label:"Fire",color:"#F87171"},
  P1:{label:"Today",color:"#FBBF24"},
  P2:{label:"Week",color:"#818CF8"},
  P3:{label:"Later",color:"#6B7280"},
};
const IT = [
  {id:"t1",title:"Send revised pricing deck to Acme Corp",status:"overdue",priority:"P0",due:"Yesterday",contact:"Sarah Johnson",dealId:"d1",src:"voice"},
  {id:"t2",title:"Prep Q3 team presentation slides",status:"in_progress",priority:"P1",due:"Tomorrow",contact:null,dealId:null,src:"manual"},
  {id:"t3",title:"Follow up with Marcus Chen on proposal",status:"not_started",priority:"P1",due:"Today",contact:"Marcus Chen",dealId:"d2",src:"voice"},
  {id:"t4",title:"Review Nexus partnership brief",status:"not_started",priority:"P2",due:"This week",contact:"David Kim",dealId:"d3",src:"voice"},
  {id:"t5",title:"Book flights for SF conference",status:"waiting",priority:"P2",due:"Friday",contact:null,dealId:null,src:"manual"},
  {id:"t6",title:"Update investor deck financials",status:"snoozed",priority:"P3",due:"Next week",contact:null,dealId:null,src:"voice"},
  {id:"t7",title:"Schedule weekly team sync",status:"done",priority:"P2",due:"Monday",contact:null,dealId:null,src:"manual"},
  {id:"t8",title:"Send NDA to Summit Media",status:"done",priority:"P1",due:"Last week",contact:"Lisa Park",dealId:"d4",src:"voice"},
];
const IC = [
  {id:"c1",name:"Sarah Johnson",role:"VP Partnerships",co:"Acme Corp",stage:"active",cadence:7,last:1,deals:["d1"],tags:["client","hot"],color:"#7C6FFF",init:"SJ",summary:"Key decision maker at Acme. Positive on Enterprise tier. Needs pricing this week."},
  {id:"c2",name:"Marcus Chen",role:"CEO",co:"Bluprint Inc",stage:"active",cadence:7,last:3,deals:["d2"],tags:["prospect"],color:"#0E9B9A",init:"MC",summary:"Warm prospect, loved the initial proposal. Follow-up window is open now."},
  {id:"c3",name:"James Rivera",role:"CFO",co:"Meridian Capital",stage:"warm",cadence:14,last:14,deals:["d5"],tags:["investor","vc"],color:"#E09B22",init:"JR",summary:"Met at conference. 14 days without contact — re-engage now."},
  {id:"c4",name:"Lisa Park",role:"Head of Growth",co:"Summit Media",stage:"active",cadence:7,last:5,deals:["d4"],tags:["client"],color:"#D94F3A",init:"LP",summary:"NDA sent. Moving to proposal. Very responsive — strong momentum."},
  {id:"c5",name:"David Kim",role:"Product Director",co:"Nexus Tech",stage:"warm",cadence:14,last:8,deals:["d3"],tags:["prospect"],color:"#2EAA6A",init:"DK",summary:"Budget approved for Q1. Needs full deck by Friday. High close potential."},
];
const ID = [
  {id:"d1",name:"Acme Corp — Enterprise",stage:2,value:24000,cid:"c1",days:6,health:4,status:"stalled",next:"Send pricing deck TODAY — deal at risk",act:"2d ago"},
  {id:"d2",name:"Bluprint — Growth Plan",stage:2,value:12000,cid:"c2",days:3,health:7,status:"active",next:"Follow up on proposal — check timeline",act:"3d ago"},
  {id:"d3",name:"Nexus Tech — Pilot",stage:1,value:6000,cid:"c5",days:1,health:9,status:"active",next:"Send discovery questions before Friday",act:"1d ago"},
  {id:"d4",name:"Summit Media — Standard",stage:3,value:8500,cid:"c4",days:2,health:8,status:"active",next:"Schedule full scoping call — momentum good",act:"5h ago"},
  {id:"d5",name:"Meridian Capital — Q4",stage:0,value:50000,cid:"c3",days:14,health:3,status:"stalled",next:"Re-engage James immediately — 14d stale",act:"14d ago"},
];
const CMDS = [
  {say:"Give me my morning briefing",resp:"Good morning. 3 priorities today: Acme pricing deck is overdue and at risk, Marcus follow-up is due, and Q3 deck due tomorrow. Two deals stalling — Acme and Meridian need attention today.",fx:null},
  {say:"What's open with Acme right now?",resp:"Acme is in Proposal stage, day 6. Sarah wants pricing by end of week. You have an overdue task — send pricing deck. Health score 4/10. This deal needs action today.",fx:null},
  {say:"Move Acme deal to Negotiation",resp:"Done — Acme moved to Negotiation stage. Deal card updated, stall timer reset. Want me to log a note on Sarah's contact card?",fx:"moveAcme"},
  {say:"Who do I need to follow up with?",resp:"Three people: James Rivera — 14 days overdue, re-engage immediately. Sarah Johnson — at 7-day cadence. Marcus Chen — proposal response due this week.",fx:null},
  {say:"Log note on Sarah — she loved the pricing",resp:"Note logged on Sarah Johnson: 'Loved the new pricing proposal.' Last contact updated to today. Follow-up cadence reset — next nudge in 7 days.",fx:null},
  {say:"I'm done for today",resp:"Initiating your end-of-day handoff...",fx:"endDay"},
];

export default function App() {
  const [mode,setMode]=useState("work");
  const [tab,setTab]=useState("home");
  const [tasks,setTasks]=useState(IT);
  const [deals,setDeals]=useState(ID);
  const [contacts]=useState(IC);
  const [transitioning,setTransitioning]=useState(false);
  const [toast,setToast]=useState(null);
  const [voiceOpen,setVoiceOpen]=useState(false);
  const [vPhase,setVPhase]=useState("idle");
  const [vText,setVText]=useState("");
  const [vResp,setVResp]=useState("");
  const [cmdIdx,setCmdIdx]=useState(0);
  const [showPTS,setShowPTS]=useState(false);
  const [selC,setSelC]=useState(null);
  const [selD,setSelD]=useState(null);
  const [taskSheet,setTaskSheet]=useState(null);
  const [rec,setRec]=useState(false);
  const tRef=useRef(null);
  const pRef=useRef(null);

  const isChill=mode==="chill";
  const notify=useCallback(msg=>{setToast(msg);setTimeout(()=>setToast(null),3000);},[]);
  const switchMode=useCallback(m=>{setTransitioning(true);setTimeout(()=>{setMode(m);setTransitioning(false);if(m==="chill")setTab("home");},600);},[]);

  const startVoice=useCallback(()=>{
    if(vPhase!=="idle")return;
    setRec(true);setVPhase("recording");setVoiceOpen(true);setVText("");setVResp("");
    const cmd=CMDS[cmdIdx%CMDS.length];
    let i=0;
    const type=()=>{setVText(cmd.say.slice(0,i));i++;if(i<=cmd.say.length)tRef.current=setTimeout(type,38);};
    type();
  },[vPhase,cmdIdx]);

  const stopVoice=useCallback(()=>{
    if(!rec)return;
    clearTimeout(tRef.current);setRec(false);setVPhase("processing");
    const cmd=CMDS[cmdIdx%CMDS.length];
    setVText(cmd.say);
    pRef.current=setTimeout(()=>{
      setVPhase("response");setVResp(cmd.resp);
      if(cmd.fx==="moveAcme"){setDeals(p=>p.map(d=>d.id==="d1"?{...d,stage:3,status:"active",health:7,days:0}:d));notify("Acme → Negotiation ✓");}
      if(cmd.fx==="endDay"){setTimeout(()=>{setShowPTS(true);setVoiceOpen(false);setVPhase("idle");},1500);}
      setCmdIdx(i=>i+1);
    },1400);
  },[rec,cmdIdx,notify]);

  const closeVoice=()=>{clearTimeout(tRef.current);clearTimeout(pRef.current);setVoiceOpen(false);setVPhase("idle");setVText("");setVResp("");setRec(false);};
  const completeTask=id=>{setTasks(p=>p.map(t=>t.id===id?{...t,status:"done"}:t));notify("Task completed ✓");};
  const done=tasks.filter(t=>t.status==="done").length;
  const total=tasks.length;
  const pct=Math.round((done/total)*100);

  const cv=isChill?{"--bg":"#F9F6EF","--bg2":"#F0EDE5","--bg3":"#E8E3D8","--surf":"#FFFFFF","--bord":"#DDD8CE","--t1":"#2A2018","--t2":"#6B5C47","--t3":"#A09080","--acc":"#8B7355","--acc2":"#C8A882","--teal":"#5A967F","--gold":"#C9952A","--nav":"#EDE8DF","--glow":"rgba(139,115,85,0.2)"}:{"--bg":"#080F18","--bg2":"#0D1620","--bg3":"#121D2A","--surf":"#162030","--bord":"#1E2F42","--t1":"#F0F4FF","--t2":"#8FA8C4","--t3":"#4A6882","--acc":"#6C5FFF","--acc2":"#9B90FF","--teal":"#0D8A89","--gold":"#C9851A","--nav":"#0D1620","--glow":"rgba(108,95,255,0.35)"};

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{background:#030608}
        .wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 16px;background:#030608;gap:18px}
        .shell{width:390px;height:844px;border-radius:48px;overflow:hidden;position:relative;font-family:'Instrument Sans',sans-serif;background:var(--bg);color:var(--t1);box-shadow:0 50px 150px rgba(0,0,0,0.9),0 0 0 1px rgba(255,255,255,0.06);display:flex;flex-direction:column;transition:background 0.7s ease;user-select:none}
        .tx{position:absolute;inset:0;z-index:500;background:var(--acc);opacity:0;pointer-events:none;transition:opacity 0.3s;border-radius:48px}
        .tx.on{opacity:1}
        .toast{position:absolute;top:72px;left:16px;right:16px;background:var(--teal);color:#fff;border-radius:11px;padding:10px 15px;font-size:13px;font-weight:600;z-index:400;animation:ta 3s ease forwards}
        @keyframes ta{0%{opacity:0;transform:translateY(-8px)}8%{opacity:1;transform:translateY(0)}85%{opacity:1}100%{opacity:0}}
        .sbar{display:flex;align-items:center;justify-content:space-between;padding:14px 22px 0;flex-shrink:0}
        .stime{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--t1)}
        .mpill{display:flex;align-items:center;gap:5px;padding:3px 10px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:0.05em}
        .mdot{width:5px;height:5px;border-radius:50%;animation:bl 2s infinite}
        @keyframes bl{0%,100%{opacity:1}50%{opacity:0.4}}
        .scr{flex:1;overflow-y:auto;overflow-x:hidden;padding:0 18px 20px;scrollbar-width:none}
        .scr::-webkit-scrollbar{display:none}
        .nav{background:var(--nav);border-top:1px solid var(--bord);display:flex;padding:8px 0 28px;flex-shrink:0;transition:background 0.7s}
        .ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;padding:5px 0}
        .ni-i{font-size:19px;transition:transform 0.15s}
        .ni.act .ni-i{transform:translateY(-2px)}
        .ni-l{font-size:9px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;transition:color 0.15s}
        .vbtn{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px}
        .vring{width:52px;height:52px;border-radius:50%;background:var(--acc);display:flex;align-items:center;justify-content:center;margin-top:-20px;margin-bottom:2px;font-size:21px;cursor:pointer;box-shadow:0 4px 22px var(--glow);transition:all 0.2s}
        .vring.rec{background:#EF4444;animation:rp 0.7s ease infinite}
        @keyframes rp{0%,100%{box-shadow:0 4px 22px rgba(239,68,68,0.5)}50%{box-shadow:0 4px 40px rgba(239,68,68,0.9),0 0 0 14px rgba(239,68,68,0)}}
        .card{background:var(--surf);border:1px solid var(--bord);border-radius:16px;padding:16px;margin-bottom:10px;transition:background 0.7s,border-color 0.7s}
        .sh{display:flex;align-items:center;justify-content:space-between;margin:18px 0 10px}
        .sh-t{font-family:'Bricolage Grotesque',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--t3)}
        .sh-a{font-size:12px;font-weight:600;color:var(--acc);cursor:pointer}
        .brief{background:linear-gradient(135deg,var(--surf),var(--bg3));border:1px solid var(--bord);border-left:3px solid var(--gold);border-radius:18px;padding:20px;margin:14px 0 10px;position:relative;overflow:hidden}
        .brief::after{content:'';position:absolute;top:-40px;right:-40px;width:120px;height:120px;border-radius:50%;background:var(--glow);pointer-events:none}
        .btag{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--gold);font-weight:500;letter-spacing:0.08em;margin-bottom:6px}
        .bhead{font-family:'Bricolage Grotesque',sans-serif;font-size:21px;font-weight:800;color:var(--t1);margin-bottom:7px}
        .bsub{font-size:13px;color:var(--t2);line-height:1.55;margin-bottom:14px}
        .pi{display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid var(--bord);cursor:pointer}
        .pi:last-child{border-bottom:none;padding-bottom:0}
        .pdot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
        .ptxt{font-size:13px;color:var(--t1);flex:1;line-height:1.3;font-weight:500}
        .pdue{font-family:'JetBrains Mono',monospace;font-size:10px;flex-shrink:0}
        .stats{display:flex;gap:8px;margin:12px 0}
        .stat{flex:1;background:var(--surf);border:1px solid var(--bord);border-radius:13px;padding:12px;transition:background 0.7s,border-color 0.7s}
        .sn{font-family:'Bricolage Grotesque',sans-serif;font-size:26px;font-weight:800;color:var(--t1)}
        .sl{font-size:10px;font-weight:600;color:var(--t3);letter-spacing:0.04em;margin-top:1px}
        .prog{margin:12px 0 6px}
        .ph{display:flex;justify-content:space-between;margin-bottom:7px}
        .pl{font-size:12px;color:var(--t2)}
        .pc{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--acc)}
        .pt{height:5px;background:var(--bg3);border-radius:3px;overflow:hidden}
        .pf{height:100%;background:linear-gradient(90deg,var(--teal),var(--acc));border-radius:3px;transition:width 0.6s ease}
        .ac{background:rgba(248,113,113,0.06);border:1px solid rgba(248,113,113,0.25);border-left:3px solid #F87171;border-radius:14px;padding:14px;margin-bottom:10px;cursor:pointer}
        .tc{background:var(--surf);border:1px solid var(--bord);border-radius:14px;padding:13px 15px;display:flex;align-items:flex-start;gap:11px;margin-bottom:8px;cursor:pointer;transition:all 0.2s}
        .tc:active{transform:scale(0.99)}
        .tc.done .tc-t{text-decoration:line-through;color:var(--t3)}
        .ck{width:22px;height:22px;border-radius:50%;border:2px solid var(--bord);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;cursor:pointer;transition:all 0.2s;margin-top:1px}
        .tm{flex:1;min-width:0}
        .tc-t{font-size:14px;font-weight:500;color:var(--t1);line-height:1.4;margin-bottom:5px}
        .tbs{display:flex;gap:5px;flex-wrap:wrap;align-items:center}
        .badge{padding:2px 8px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:0.02em}
        .tr{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0}
        .td{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3)}
        .chips{display:flex;gap:7px;margin:14px 0;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
        .chips::-webkit-scrollbar{display:none}
        .chip{padding:6px 13px;border-radius:100px;font-size:11px;font-weight:700;cursor:pointer;transition:all 0.15s;flex-shrink:0;letter-spacing:0.02em;border:1px solid transparent}
        .cc{background:var(--surf);border:1px solid var(--bord);border-radius:14px;padding:13px 15px;display:flex;align-items:center;gap:11px;margin-bottom:8px;cursor:pointer;transition:all 0.2s}
        .cc:active{transform:scale(0.99)}
        .ava{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Bricolage Grotesque',sans-serif;font-size:13px;font-weight:800;color:#fff;flex-shrink:0}
        .ci{flex:1;min-width:0}
        .cn{font-size:14px;font-weight:700;color:var(--t1);margin-bottom:2px}
        .cr{font-size:11px;color:var(--t3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .crt{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
        .fdue{font-size:11px;font-family:'JetBrains Mono',monospace}
        .srch{position:relative;margin:14px 0}
        .srch input{width:100%;background:var(--surf);border:1px solid var(--bord);border-radius:12px;padding:11px 14px 11px 38px;color:var(--t1);font-size:13px;outline:none;font-family:'Instrument Sans',sans-serif}
        .srch input::placeholder{color:var(--t3)}
        .si{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:15px}
        .pscr{overflow-x:auto;scrollbar-width:none;margin:0 -18px;padding:0 18px}
        .pscr::-webkit-scrollbar{display:none}
        .pcols{display:flex;gap:10px;padding-bottom:12px}
        .pcol{min-width:192px}
        .pch{padding:7px 11px;border-radius:9px;font-size:10px;font-weight:800;letter-spacing:0.06em;margin-bottom:7px;display:flex;justify-content:space-between;align-items:center}
        .dc{background:var(--surf);border:1px solid var(--bord);border-radius:12px;padding:12px;margin-bottom:7px;cursor:pointer;transition:all 0.2s}
        .dc:active{transform:scale(0.98)}
        .dc.st{border-color:rgba(248,113,113,0.35)}
        .dn{font-size:13px;font-weight:700;color:var(--t1);margin-bottom:3px;line-height:1.3}
        .dv{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--gold);margin-bottom:5px}
        .df{display:flex;justify-content:space-between;align-items:center}
        .da{font-size:10px;color:var(--t3)}
        .hb{display:flex;gap:2px}
        .hp{width:6px;height:6px;border-radius:2px}
        .pm{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;margin-bottom:14px;padding-bottom:3px}
        .pm::-webkit-scrollbar{display:none}
        .pmi{background:var(--surf);border:1px solid var(--bord);border-radius:10px;padding:8px 11px;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:63px;cursor:pointer}
        .pmn{font-family:'Bricolage Grotesque',sans-serif;font-size:18px;font-weight:800}
        .pml{font-size:9px;color:var(--t3);font-weight:600;letter-spacing:0.04em}
        .vo{position:absolute;inset:0;z-index:200;background:rgba(3,6,8,0.96);display:flex;flex-direction:column;padding:52px 22px 32px;border-radius:48px;transition:opacity 0.3s,transform 0.3s}
        .vo.hidden{opacity:0;pointer-events:none;transform:translateY(14px)}
        .vow{display:flex;flex-direction:column;align-items:center;margin-bottom:26px}
        .vorb{width:94px;height:94px;border-radius:50%;background:var(--acc);display:flex;align-items:center;justify-content:center;font-size:38px;box-shadow:0 0 40px var(--glow)}
        .vorb.rec{animation:op 0.9s ease infinite}
        @keyframes op{0%,100%{transform:scale(1);box-shadow:0 0 30px var(--glow)}50%{transform:scale(1.06);box-shadow:0 0 60px var(--glow)}}
        .vorb.proc{animation:os 2s linear infinite;background:conic-gradient(var(--acc),var(--teal),var(--acc))}
        @keyframes os{to{transform:rotate(360deg)}}
        .vph{font-family:'Bricolage Grotesque',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--acc);margin-top:12px}
        .vtr{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:14px;padding:14px;margin-bottom:13px;min-height:52px;font-size:15px;color:var(--t1);line-height:1.55;font-style:italic}
        .vrs{background:rgba(108,95,255,0.08);border:1px solid rgba(108,95,255,0.25);border-radius:14px;padding:14px;flex:1;overflow-y:auto;scrollbar-width:none}
        .vrs::-webkit-scrollbar{display:none}
        .vrt{font-size:9px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:var(--acc);margin-bottom:7px}
        .vrb{font-size:13px;color:#C4BDFF;line-height:1.65}
        .vcl{position:absolute;top:18px;right:20px;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,0.08);border:none;color:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .vh{font-size:12px;color:var(--t3);text-align:center;margin-top:12px}
        .pts{position:absolute;inset:0;z-index:300;background:rgba(3,6,8,0.97);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px;border-radius:48px}
        .pts.hidden{opacity:0;pointer-events:none}
        .ptm{font-size:54px;margin-bottom:16px;animation:fl 3s ease-in-out infinite}
        @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .ptt{font-family:'Bricolage Grotesque',sans-serif;font-size:28px;font-weight:800;color:#34D399;text-align:center;margin-bottom:10px}
        .pts-s{font-size:13px;color:var(--t2);text-align:center;margin-bottom:20px;line-height:1.6;max-width:280px}
        .ptl{width:100%;background:rgba(52,211,153,0.07);border:1px solid rgba(52,211,153,0.2);border-radius:14px;padding:14px;margin-bottom:20px}
        .pti{display:flex;gap:9px;padding:5px 0;font-size:12px;color:var(--t2);line-height:1.4}
        .pti::before{content:'✓';color:#34D399;font-weight:800;flex-shrink:0}
        .ptmsg{font-family:'Bricolage Grotesque',sans-serif;font-size:15px;font-weight:700;color:#34D399;text-align:center;margin-bottom:20px;font-style:italic}
        .ptb{width:100%;padding:17px;border-radius:100px;background:#34D399;border:none;color:#fff;font-family:'Bricolage Grotesque',sans-serif;font-size:17px;font-weight:800;cursor:pointer;box-shadow:0 8px 30px rgba(52,211,153,0.35);transition:all 0.2s}
        .ptb:active{transform:scale(0.98)}
        .ptsk{margin-top:11px;font-size:12px;color:var(--t3);cursor:pointer;text-align:center}
        .det{position:absolute;inset:0;z-index:100;background:var(--bg);border-radius:48px;overflow-y:auto;scrollbar-width:none;transition:transform 0.3s,opacity 0.3s}
        .det::-webkit-scrollbar{display:none}
        .det.hidden{transform:translateX(100%);opacity:0;pointer-events:none}
        .bk{width:36px;height:36px;border-radius:50%;background:var(--surf);border:1px solid var(--bord);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:17px;color:var(--t1);flex-shrink:0}
        .ts{position:absolute;bottom:0;left:0;right:0;z-index:150;background:var(--bg2);border-radius:22px 22px 0 0;padding:17px 17px 42px;border-top:1px solid var(--bord);transition:transform 0.3s cubic-bezier(0.32,0.72,0,1)}
        .ts.hidden{transform:translateY(100%)}
        .shdl{width:38px;height:4px;border-radius:2px;background:var(--bord);margin:0 auto 17px}
        .chw{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:22px;text-align:center}
        .cht{font-family:'JetBrains Mono',monospace;font-size:50px;font-weight:400;color:var(--acc);margin:16px 0}
        .chor{display:flex;gap:13px;margin:24px 0}
        .cho{width:56px;height:56px;border-radius:50%;background:var(--surf);border:1px solid var(--bord);display:flex;align-items:center;justify-content:center;font-size:23px}
        .chcap{width:100%;padding:12px;border-radius:13px;background:var(--surf);border:1px dashed var(--bord);font-size:13px;color:var(--t3);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s}
        .mr{display:flex;gap:7px;margin:17px 0 6px}
        .mb{flex:1;padding:10px 7px;border-radius:11px;border:1px solid var(--bord);background:var(--surf);font-family:'Instrument Sans',sans-serif;font-size:11px;font-weight:700;color:var(--t2);cursor:pointer;transition:all 0.2s;display:flex;flex-direction:column;align-items:center;gap:3px}
        .mb.act{background:var(--acc);border-color:var(--acc);color:#fff}
        .mbi{font-size:17px}
        .qc{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;padding-bottom:3px}
        .qc::-webkit-scrollbar{display:none}
        .qch{background:var(--surf);border:1px solid var(--bord);border-radius:100px;padding:7px 13px;font-size:11px;color:var(--t2);white-space:nowrap;cursor:pointer;flex-shrink:0;transition:all 0.15s}
        .qch:active{background:var(--acc);color:#fff;border-color:var(--acc)}
        .spb{display:flex;gap:4px;margin:10px 0 14px}
        .sp{flex:1;height:5px;border-radius:3px;transition:background 0.3s}
        .sa{display:flex;gap:7px}
        .sar{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;transition:all 0.2s}
        .ctrl{display:flex;gap:9px;flex-wrap:wrap;justify-content:center}
        .cbtn{padding:9px 17px;border-radius:100px;border:1px solid rgba(108,95,255,0.35);background:rgba(108,95,255,0.08);color:#C4BDFF;font-family:'Instrument Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s}
        .cbtn.on{background:#6C5FFF;border-color:#6C5FFF;color:#fff}
        .ht{font-family:'JetBrains Mono',monospace;font-size:10px;color:#2A4060;text-align:center;max-width:390px;line-height:1.7}
        .ni-item{background:var(--surf);border:1px solid var(--bord);border-radius:12px;padding:11px 14px;margin-bottom:7px}
        .ni-tag{font-size:9px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--acc);margin-bottom:5px}
        .ni-body{font-size:12px;color:var(--t2);line-height:1.55;font-style:italic}
      `}</style>
      <div className="wrap">
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"30px",fontWeight:800,color:"#6C5FFF",letterSpacing:"-0.01em"}}>SwitchingOff AI</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px",color:"#2A4060",marginTop:"3px"}}>Command Center · v3 Interactive Build</div>
        </div>
        <div className="shell" style={cv}>
          <div className={`tx ${transitioning?"on":""}`}/>
          {toast&&<div className="toast">{toast}</div>}
          <SBar mode={mode}/>
          {isChill?(
            <Chill onRec={startVoice} onRel={stopVoice} rec={rec} onBack={()=>switchMode("work")}/>
          ):(
            <>
              <div className="scr">
                {tab==="home"&&<Home tasks={tasks} deals={deals} done={done} total={total} pct={pct} mode={mode} onSwitch={switchMode} onTask={setTaskSheet}/>}
                {tab==="today"&&<Today tasks={tasks} onComplete={completeTask} onTask={setTaskSheet}/>}
                {tab==="crm"&&<CRM contacts={contacts} onSel={setSelC}/>}
                {tab==="pipeline"&&<Pipeline deals={deals} contacts={contacts} onSel={setSelD}/>}
              </div>
              <Nav tab={tab} setTab={setTab} rec={rec} onStart={startVoice} onStop={stopVoice}/>
            </>
          )}
          <div className={`vo ${voiceOpen?"":"hidden"}`}>
            <button className="vcl" onClick={closeVoice}>✕</button>
            <div className="vow">
              <div className={`vorb ${vPhase==="recording"?"rec":vPhase==="processing"?"proc":""}`}>{vPhase==="processing"?"⚙️":"🎙️"}</div>
              <div className="vph">{vPhase==="recording"?"Listening…":vPhase==="processing"?"Processing…":vPhase==="response"?"Done ✓":"Ready"}</div>
            </div>
            {vText&&<div className="vtr">"{vText}"</div>}
            {vResp?(<div className="vrs"><div className="vrt">🤖 Switch AI</div><div className="vrb">{vResp}</div></div>):(
              <div className="vh">Hold 🎙️ to speak · cycles through demo commands each press</div>
            )}
          </div>
          <div className={`pts ${showPTS?"":"hidden"}`}>
            <div className="ptm">🌙</div>
            <div className="ptt">You're Done for Today.</div>
            <div className="pts-s">Everything is captured, filed, and ready for tomorrow.</div>
            <div className="ptl">
              <div className="pti">14 tasks in pipeline — top 3 locked for tomorrow</div>
              <div className="pti">2 follow-up reminders set for this week</div>
              <div className="pti">Acme deal — pricing task queued, Sarah notified</div>
              <div className="pti">All voice notes logged — nothing is lost</div>
            </div>
            <div className="ptmsg">"Everything is handled. You earned this."</div>
            <button className="ptb" onClick={()=>{setShowPTS(false);switchMode("chill");}}>I'm Off 🌙</button>
            <div className="ptsk" onClick={()=>setShowPTS(false)}>Stay in work mode</div>
          </div>
          <div className={`det ${selC?"":"hidden"}`} style={cv}>{selC&&<CDetail c={selC} deals={deals} onBack={()=>setSelC(null)}/>}</div>
          <div className={`det ${selD?"":"hidden"}`} style={cv}>{selD&&<DDetail d={selD} contacts={contacts} tasks={tasks} deals={deals} setDeals={setDeals} onBack={()=>setSelD(null)} notify={notify}/>}</div>
          <div className={`ts ${taskSheet?"":"hidden"}`} style={cv}>{taskSheet&&<TSheet t={taskSheet} onClose={()=>setTaskSheet(null)} onComplete={completeTask} onSt={(id,s)=>{setTasks(p=>p.map(t=>t.id===id?{...t,status:s}:t));setTaskSheet(null);notify("Status updated");}}/>}</div>
        </div>
        <div className="ctrl">
          {["work","transition","chill"].map(m=>(
            <button key={m} className={`cbtn ${mode===m?"on":""}`} onClick={()=>m==="transition"?setShowPTS(true):switchMode(m)}>
              {m==="work"?"⚡ Work":m==="transition"?"🌀 Wind Down":"🌙 Chill"}
            </button>
          ))}
        </div>
        <div className="ht">Hold 🎙️ mic to demo voice AI · Click tasks/contacts/deals to interact<br/>Each press cycles through a different command · Switch modes above</div>
      </div>
    </>
  );
}

function SBar({mode}){
  const cfg={work:{l:"Work Mode",c:"#6C5FFF"},transition:{l:"Transitioning",c:"#FBBF24"},chill:{l:"Chill Mode",c:"#34D399"}}[mode];
  const [t,setT]=useState(()=>new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));
  useEffect(()=>{const i=setInterval(()=>setT(new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})),10000);return()=>clearInterval(i);},[]);
  return(<div className="sbar"><span className="stime">{t}</span><div className="mpill" style={{background:`${cfg.c}18`,border:`1px solid ${cfg.c}35`}}><div className="mdot" style={{background:cfg.c}}/><span style={{color:cfg.c}}>{cfg.l}</span></div><div style={{fontSize:"11px",color:"var(--t2)",display:"flex",gap:"5px"}}><span>●●●</span><span>⚡</span></div></div>);
}

function Nav({tab,setTab,rec,onStart,onStop}){
  const L=[{id:"home",i:"🏠",l:"Home"},{id:"today",i:"✅",l:"Today"}];
  const R=[{id:"crm",i:"👥",l:"CRM"},{id:"pipeline",i:"📊",l:"Pipeline"}];
  return(<nav className="nav">
    {L.map(t=><NI key={t.id} t={t} active={tab===t.id} onClick={()=>setTab(t.id)}/>)}
    <div className="vbtn">
      <div className={`vring ${rec?"rec":""}`} onMouseDown={onStart} onMouseUp={onStop} onTouchStart={e=>{e.preventDefault();onStart();}} onTouchEnd={e=>{e.preventDefault();onStop();}}>{rec?"🔴":"🎙️"}</div>
      <span style={{fontSize:"9px",fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase",color:"var(--t3)"}}>Voice</span>
    </div>
    {R.map(t=><NI key={t.id} t={t} active={tab===t.id} onClick={()=>setTab(t.id)}/>)}
  </nav>);
}
function NI({t,active,onClick}){return(<div className={`ni ${active?"act":""}`} onClick={onClick}><span className="ni-i">{t.i}</span><span className="ni-l" style={{color:active?"var(--acc)":"var(--t3)"}}>{t.l}</span></div>);}

function Home({tasks,deals,done,total,pct,mode,onSwitch,onTask}){
  const top3=tasks.filter(t=>t.status!=="done"&&t.status!=="snoozed").slice(0,3);
  const stalled=deals.filter(d=>d.status==="stalled");
  return(<>
    <div className="brief">
      <div className="btag">📅 {new Date().toLocaleDateString("en",{weekday:"long",month:"short",day:"numeric"}).toUpperCase()} · MORNING BRIEFING</div>
      <div className="bhead">Good morning 👋</div>
      <div className="bsub"><strong>{top3.length} priorities</strong> · <strong>{stalled.length} stalled</strong> · <strong>{tasks.filter(t=>t.status==="overdue").length} overdue</strong></div>
      {top3.map(t=>(
        <div key={t.id} className="pi" onClick={()=>onTask(t)}>
          <div className="pdot" style={{background:PRIO[t.priority].color}}/>
          <span className="ptxt">{t.title}</span>
          <span className="pdue" style={{color:t.status==="overdue"?"#F87171":"var(--t3)"}}>{t.due}</span>
        </div>
      ))}
    </div>
    <div className="prog"><div className="ph"><span className="pl">Progress</span><span className="pc">{done}/{total}</span></div><div className="pt"><div className="pf" style={{width:`${pct}%`}}/></div></div>
    <div className="stats">
      <div className="stat"><div className="sn">{tasks.filter(t=>t.status!=="done").length}</div><div className="sl">Open Tasks</div></div>
      <div className="stat"><div className="sn">{deals.filter(d=>d.status==="active").length}</div><div className="sl">Active Deals</div></div>
      <div className="stat"><div className="sn" style={{color:stalled.length>0?"#F87171":"#34D399"}}>{stalled.length}</div><div className="sl">Stalled</div></div>
    </div>
    {stalled.length>0&&<><div className="sh"><span className="sh-t" style={{color:"#F87171"}}>⚠ Needs Attention</span></div>
    {stalled.map(d=>(<div key={d.id} className="ac"><div style={{fontSize:"13px",fontWeight:700,color:"var(--t1)",marginBottom:"3px"}}>{d.name}</div><div style={{fontSize:"11px",color:"#F87171",marginBottom:"4px",fontWeight:600}}>Stalled {d.days}d in {STAGES[d.stage]}</div><div style={{fontSize:"11px",color:"var(--t2)",fontStyle:"italic"}}>💡 {d.next}</div></div>))}</>}
    <div className="sh"><span className="sh-t">Quick Commands</span></div>
    <div className="qc">{["Morning briefing","Open with Acme?","Pipeline status","Follow ups?","I'm done today"].map(c=>(<div key={c} className="qch">🎙️ {c}</div>))}</div>
    <div className="sh" style={{marginTop:"18px"}}><span className="sh-t">Switch Mode</span></div>
    <div className="mr">{[{id:"work",i:"⚡",l:"Work"},{id:"transition",i:"🌀",l:"Wind Down"},{id:"chill",i:"🌙",l:"Chill"}].map(m=>(<div key={m.id} className={`mb ${mode===m.id?"act":""}`} onClick={()=>onSwitch(m.id)}><span className="mbi">{m.i}</span>{m.l}</div>))}</div>
  </>);
}

function Today({tasks,onComplete,onTask}){
  const [f,setF]=useState("all");
  const fs=["all","overdue","in_progress","not_started","waiting","done"];
  const filt=f==="all"?tasks:tasks.filter(t=>t.status===f);
  const done=tasks.filter(t=>t.status==="done").length;
  return(<>
    <div style={{paddingTop:"14px"}}><div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"23px",fontWeight:800,color:"var(--t1)",marginBottom:"3px"}}>Today's Hub</div><div style={{fontSize:"12px",color:"var(--t2)"}}>{done} done · {tasks.filter(t=>t.status==="overdue").length} overdue</div></div>
    <div className="chips">{fs.map(x=>(<div key={x} className="chip" onClick={()=>setF(x)} style={{background:f===x?"var(--acc)":"var(--surf)",color:f===x?"#fff":"var(--t2)",borderColor:f===x?"var(--acc)":"var(--bord)"}}>{STATUS[x]?.icon||"◈"} {x==="all"?"All":STATUS[x]?.label||x}</div>))}</div>
    {filt.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"var(--t3)",fontSize:"14px"}}>No tasks in this category</div>}
    {filt.map(t=><TCard key={t.id} t={t} onComplete={onComplete} onClick={()=>onTask(t)}/>)}
  </>);
}
function TCard({t,onComplete,onClick}){
  const sc=STATUS[t.status]||STATUS.not_started;
  const pc=PRIO[t.priority]||PRIO.P2;
  const d=t.status==="done";
  return(<div className={`tc ${d?"done":""}`} onClick={onClick}>
    <div className="ck" style={{borderColor:d?"var(--teal)":sc.color,background:d?"var(--teal)":"transparent",color:d?"#fff":"transparent"}} onClick={e=>{e.stopPropagation();if(!d)onComplete(t.id);}}>{d?"✓":""}</div>
    <div className="tm"><div className="tc-t">{t.title}</div><div className="tbs"><span className="badge" style={{background:sc.bg,color:sc.color}}>{sc.icon} {sc.label}</span><span className="badge" style={{background:`${pc.color}18`,color:pc.color}}>{t.priority}</span>{t.contact&&<span className="badge" style={{background:"var(--bg3)",color:"var(--t2)"}}>👤 {t.contact.split(" ")[0]}</span>}</div></div>
    <div className="tr"><span className="td" style={{color:t.status==="overdue"?"#F87171":"var(--t3)"}}>{t.due}</span><span style={{fontSize:"10px",color:"var(--t3)"}}>{t.src==="voice"?"🎙️":"✏️"}</span></div>
  </div>);
}

function CRM({contacts,onSel}){
  const [s,setS]=useState("");
  const filt=contacts.filter(c=>c.name.toLowerCase().includes(s.toLowerCase())||c.co.toLowerCase().includes(s.toLowerCase()));
  const over=contacts.filter(c=>c.last>c.cadence);
  return(<>
    <div style={{paddingTop:"14px"}}><div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"23px",fontWeight:800,color:"var(--t1)",marginBottom:"3px"}}>Relationships</div><div style={{fontSize:"12px",color:"var(--t2)"}}>{contacts.length} contacts · {over.length} overdue</div></div>
    <div className="srch"><span className="si">🔍</span><input placeholder="Search contacts…" value={s} onChange={e=>setS(e.target.value)}/></div>
    {over.length>0&&!s&&<div className="card" style={{borderLeft:"3px solid var(--gold)",marginBottom:"14px"}}><div style={{fontSize:"10px",fontWeight:800,color:"var(--gold)",marginBottom:"9px",letterSpacing:"0.08em"}}>⏰ FOLLOW-UPS OVERDUE</div>{over.map(c=>(<div key={c.id} style={{display:"flex",alignItems:"center",gap:"9px",padding:"6px 0",cursor:"pointer",borderBottom:"1px solid var(--bord)"}} onClick={()=>onSel(c)}><div className="ava" style={{background:c.color,width:"28px",height:"28px",fontSize:"10px"}}>{c.init}</div><div style={{flex:1,fontSize:"12px",fontWeight:600,color:"var(--t1)"}}>{c.name}</div><div style={{fontSize:"10px",color:"#F87171",fontFamily:"'JetBrains Mono',monospace"}}>{c.last}d ago</div></div>))}</div>}
    <div className="sh"><span className="sh-t">All Contacts</span><span className="sh-a">+ Add</span></div>
    {filt.map(c=><CCard key={c.id} c={c} onClick={()=>onSel(c)}/>)}
  </>);
}
function CCard({c,onClick}){
  const sc={active:"#34D399",warm:"#FBBF24",cold:"#6B7280",inactive:"#F87171"}[c.stage]||"#6B7280";
  const over=c.last>c.cadence;
  return(<div className="cc" onClick={onClick}><div className="ava" style={{background:c.color}}>{c.init}</div><div className="ci"><div className="cn">{c.name}</div><div className="cr">{c.role} · {c.co}</div><div style={{display:"flex",gap:"5px",marginTop:"4px"}}>{c.tags.map(t=>(<span key={t} style={{fontSize:"9px",padding:"1px 7px",borderRadius:"100px",background:"var(--bg3)",color:"var(--t3)",fontWeight:700}}>{t}</span>))}</div></div><div className="crt"><span className="fdue" style={{color:over?"#F87171":"var(--t3)"}}>{c.last}d ago</span><div style={{width:"7px",height:"7px",borderRadius:"50%",background:sc}}/>{c.deals.length>0&&<span style={{fontSize:"9px",color:"var(--acc)",fontWeight:700}}>💼 {c.deals.length}</span>}</div></div>);
}

function Pipeline({deals,contacts,onSel}){
  const sl=STAGES.slice(0,5);
  const tot=deals.filter(d=>d.stage<5).reduce((s,d)=>s+(d.value||0),0);
  return(<>
    <div style={{paddingTop:"14px"}}><div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"23px",fontWeight:800,color:"var(--t1)",marginBottom:"3px"}}>Pipeline</div><div style={{fontSize:"12px",color:"var(--t2)"}}>{deals.filter(d=>d.stage<5).length} active · ${tot.toLocaleString()} potential</div></div>
    <div className="pm" style={{marginTop:"14px"}}>{sl.map((s,i)=>{const cnt=deals.filter(d=>d.stage===i).length;return(<div key={s} className="pmi" style={{borderBottom:`2px solid ${STAGE_COLORS[i]}`}}><div className="pmn" style={{color:STAGE_COLORS[i]}}>{cnt}</div><div className="pml">{s}</div></div>);})}</div>
    {deals.filter(d=>d.status==="stalled").length>0&&(<div style={{background:"rgba(248,113,113,0.06)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:"12px",padding:"11px 14px",marginBottom:"14px",display:"flex",gap:"10px",alignItems:"center"}}><span style={{fontSize:"19px"}}>⚠️</span><div><div style={{fontSize:"12px",fontWeight:700,color:"#F87171"}}>{deals.filter(d=>d.status==="stalled").length} deals stalling</div><div style={{fontSize:"11px",color:"var(--t2)"}}>Acme (6d) and Meridian (14d) need action</div></div></div>)}
    <div className="pscr"><div className="pcols">{sl.map((s,i)=>{const sd=deals.filter(d=>d.stage===i);return(<div key={s} className="pcol"><div className="pch" style={{background:`${STAGE_COLORS[i]}18`,color:STAGE_COLORS[i]}}><span>{s}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"10px"}}>{sd.length}</span></div>{sd.length===0?<div style={{textAlign:"center",padding:"16px 6px",fontSize:"11px",color:"var(--t3)"}}>—</div>:sd.map(d=>{const hc=d.health>=7?"#34D399":d.health>=4?"#FBBF24":"#F87171";return(<div key={d.id} className={`dc ${d.status==="stalled"?"st":""}`} onClick={()=>onSel(d)}><div className="dn">{d.name.split("—")[0].trim()}</div><div className="dv">${(d.value||0).toLocaleString()}</div>{d.status==="stalled"&&<div style={{fontSize:"9px",color:"#F87171",fontWeight:800,marginBottom:"5px"}}>⚠ STALLED {d.days}D</div>}<div className="df"><span className="da">{d.act}</span><div className="hb">{[...Array(5)].map((_,j)=><div key={j} className="hp" style={{background:j<Math.round(d.health/2)?hc:"var(--bord)"}}/>)}</div></div></div>);})}</div>);})}</div></div>
  </>);
}

function Chill({onRec,onRel,rec,onBack}){
  const [t,setT]=useState(()=>new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));
  useEffect(()=>{const i=setInterval(()=>setT(new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})),10000);return()=>clearInterval(i);},[]);
  return(<>
    <div className="chw">
      <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"12px",fontWeight:700,color:"var(--t3)",letterSpacing:"0.12em",textTransform:"uppercase"}}>You're off the clock</div>
      <div className="cht">{t}</div>
      <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"26px",fontWeight:800,color:"var(--t1)",marginBottom:"10px"}}>Enjoy your evening.</div>
      <div style={{fontSize:"13px",color:"var(--t2)",lineHeight:1.7,maxWidth:"280px",textAlign:"center"}}>Everything is captured and safe. Your work brain can fully rest. 🌙</div>
      <div className="chor">{["🌿","☕","📖","🎵"].map(e=>(<div key={e} className="cho">{e}</div>))}</div>
      <div style={{width:"100%"}}><div style={{fontSize:"10px",color:"var(--t3)",textAlign:"center",marginBottom:"8px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase"}}>Got a stray thought?</div><div className="chcap" onMouseDown={onRec} onMouseUp={onRel} onTouchStart={e=>{e.preventDefault();onRec();}} onTouchEnd={e=>{e.preventDefault();onRel();}}><span style={{fontSize:"19px"}}>{rec?"🔴":"🎙️"}</span><span>{rec?"Release to capture…":"Hold to capture quick thought"}</span></div></div>
    </div>
    <div style={{padding:"0 18px 8px",textAlign:"center"}}><div onClick={onBack} style={{fontSize:"12px",color:"var(--t3)",cursor:"pointer"}}>⚡ Back to Work Mode</div></div>
    <div style={{background:"var(--nav)",borderTop:"1px solid var(--bord)",display:"flex",alignItems:"center",justifyContent:"center",padding:"9px 0 26px"}}><div style={{display:"flex",alignItems:"center",gap:"8px",padding:"7px 20px",borderRadius:"100px",background:"var(--surf)",border:"1px solid var(--bord)"}}><span>🌙</span><span style={{fontSize:"12px",fontWeight:700,color:"var(--t2)"}}>Chill Mode Active</span></div></div>
  </>);
}

function CDetail({c,deals,onBack}){
  const linked=deals.filter(d=>c.deals.includes(d.id));
  return(<div style={{padding:"52px 18px 32px"}}>
    <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"20px"}}><div className="bk" onClick={onBack}>←</div><div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"19px",fontWeight:800,color:"var(--t1)"}}>{c.name}</div></div>
    <div style={{display:"flex",gap:"14px",marginBottom:"16px",alignItems:"center"}}><div className="ava" style={{background:c.color,width:"60px",height:"60px",fontSize:"20px"}}>{c.init}</div><div><div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"18px",fontWeight:800,color:"var(--t1)"}}>{c.name}</div><div style={{fontSize:"13px",color:"var(--t2)"}}>{c.role}</div><div style={{fontSize:"12px",color:"var(--t3)"}}>{c.co}</div></div></div>
    <div className="card" style={{borderLeft:"3px solid var(--acc)",marginBottom:"12px"}}><div style={{fontSize:"9px",fontWeight:800,color:"var(--acc)",marginBottom:"5px",letterSpacing:"0.1em",textTransform:"uppercase"}}>🤖 AI Summary</div><div style={{fontSize:"13px",color:"var(--t2)",lineHeight:1.6}}>{c.summary}</div></div>
    <div className="stats"><div className="stat"><div className="sn" style={{color:c.last>c.cadence?"#F87171":"#34D399"}}>{c.last}d</div><div className="sl">Last Contact</div></div><div className="stat"><div className="sn">{c.cadence}d</div><div className="sl">Cadence</div></div><div className="stat"><div className="sn">{c.deals.length}</div><div className="sl">Deals</div></div></div>
    {linked.length>0&&<><div className="sh"><span className="sh-t">Linked Deals</span></div>{linked.map(d=>(<div key={d.id} className="card"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}><div style={{fontSize:"13px",fontWeight:700,color:"var(--t1)"}}>{d.name.split("—")[0].trim()}</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"11px",color:"var(--gold)"}}>${(d.value||0).toLocaleString()}</div></div><div style={{fontSize:"11px",color:"var(--t3)"}}>{STAGES[d.stage]} · {d.days}d in stage · Health {d.health}/10</div></div>))}</>}
    <div className="sh"><span className="sh-t">Recent Notes</span></div>
    {["Responded positively to updated pricing — wants decision by EOW.","Initial discovery call — identified 3 pain points. Strong fit for Enterprise.","Intro via LinkedIn — expressed interest after reading the case study."].map((n,i)=>(<div key={i} className="ni-item"><div className="ni-tag">🎙️ Voice Note · {i+1}d ago</div><div className="ni-body">"{n}"</div></div>))}
  </div>);
}

function DDetail({d,contacts,tasks,deals,setDeals,onBack,notify}){
  const contact=contacts.find(c=>c.id===d.cid);
  const linked=tasks.filter(t=>t.dealId===d.id);
  const deal=deals.find(x=>x.id===d.id)||d;
  const move=dir=>{const ns=Math.max(0,Math.min(6,deal.stage+dir));setDeals(p=>p.map(x=>x.id===d.id?{...x,stage:ns,days:0,status:"active"}:x));notify(`Moved to ${STAGES[ns]}`);};
  return(<div style={{padding:"52px 18px 40px"}}>
    <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"20px"}}><div className="bk" onClick={onBack}>←</div><div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"17px",fontWeight:800,color:"var(--t1)",flex:1,lineHeight:1.3}}>{deal.name}</div></div>
    <div className="card" style={{marginBottom:"12px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"10px"}}><div style={{fontSize:"11px",color:"var(--t3)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>Stage</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:"var(--gold)"}}>${(deal.value||0).toLocaleString()}</div></div>
      <div className="spb">{STAGES.slice(0,5).map((s,i)=>(<div key={s} className="sp" style={{background:i<=deal.stage?STAGE_COLORS[i]:"var(--bg3)"}}/>))}</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:"16px",fontWeight:800,color:STAGE_COLORS[deal.stage],fontFamily:"'Bricolage Grotesque',sans-serif"}}>{STAGES[deal.stage]}</div><div className="sa"><div className="sar" style={{background:"var(--surf)",border:"1px solid var(--bord)",color:"var(--t2)"}} onClick={()=>move(-1)}>←</div><div className="sar" style={{background:"var(--acc)",color:"#fff"}} onClick={()=>move(1)}>→</div></div></div>
    </div>
    <div className="stats"><div className="stat"><div className="sn" style={{color:deal.days>7?"#F87171":deal.days>3?"#FBBF24":"#34D399"}}>{deal.days}d</div><div className="sl">In Stage</div></div><div className="stat"><div className="sn" style={{color:deal.health>=7?"#34D399":deal.health>=4?"#FBBF24":"#F87171"}}>{deal.health}/10</div><div className="sl">Health</div></div><div className="stat"><div className="sn">{linked.length}</div><div className="sl">Tasks</div></div></div>
    <div className="card" style={{borderLeft:"3px solid var(--teal)",marginBottom:"12px"}}><div style={{fontSize:"9px",fontWeight:800,color:"var(--teal)",marginBottom:"5px",letterSpacing:"0.1em",textTransform:"uppercase"}}>🤖 AI Next Action</div><div style={{fontSize:"13px",color:"var(--t2)",lineHeight:1.55}}>{deal.next}</div></div>
    {contact&&<><div className="sh"><span className="sh-t">Primary Contact</span></div><div className="cc" style={{cursor:"default"}}><div className="ava" style={{background:contact.color}}>{contact.init}</div><div className="ci"><div className="cn">{contact.name}</div><div className="cr">{contact.role} · {contact.co}</div></div><span style={{fontSize:"10px",color:contact.last>contact.cadence?"#F87171":"var(--t3)",fontFamily:"'JetBrains Mono',monospace"}}>{contact.last}d ago</span></div></>}
    {linked.length>0&&<><div className="sh"><span className="sh-t">Linked Tasks</span></div>{linked.map(t=>{const sc=STATUS[t.status];return(<div key={t.id} style={{background:"var(--surf)",border:"1px solid var(--bord)",borderRadius:"11px",padding:"11px 13px",marginBottom:"7px",display:"flex",alignItems:"center",gap:"9px"}}><span style={{fontSize:"13px"}}>{sc.icon}</span><div style={{flex:1,fontSize:"12px",color:t.status==="done"?"var(--t3)":"var(--t1)",textDecoration:t.status==="done"?"line-through":"none"}}>{t.title}</div><span style={{fontSize:"10px",color:t.status==="overdue"?"#F87171":"var(--t3)",fontFamily:"'JetBrains Mono',monospace"}}>{t.due}</span></div>);})}</>}
  </div>);
}

function TSheet({t,onClose,onSt,onComplete}){
  const statuses=["not_started","in_progress","waiting","done","snoozed"];
  return(<>
    <div className="shdl"/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"15px"}}><div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"16px",fontWeight:700,color:"var(--t1)",flex:1,paddingRight:"12px",lineHeight:1.4}}>{t.title}</div><div onClick={onClose} style={{color:"var(--t3)",cursor:"pointer",fontSize:"19px"}}>✕</div></div>
    <div style={{marginBottom:"16px"}}><div style={{fontSize:"10px",color:"var(--t3)",marginBottom:"8px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase"}}>Update Status</div><div style={{display:"flex",flexWrap:"wrap",gap:"7px"}}>{statuses.map(s=>{const sc=STATUS[s];return(<div key={s} onClick={()=>s==="done"?onComplete(t.id):onSt(t.id,s)} style={{padding:"8px 13px",borderRadius:"100px",background:t.status===s?sc.bg:"var(--surf)",border:`1px solid ${t.status===s?sc.color:"var(--bord)"}`,color:t.status===s?sc.color:"var(--t2)",fontSize:"12px",fontWeight:700,cursor:"pointer"}}>{sc.icon} {sc.label}</div>);})}</div></div>
    <div style={{display:"flex",gap:"8px"}}>{[["Due",t.due,t.status==="overdue"?"#F87171":null],["Priority",t.priority,PRIO[t.priority].color],["Source",t.src==="voice"?"🎙️ Voice":"✏️ Manual",null]].map(([l,v,c])=>(<div key={l} style={{flex:1,background:"var(--surf)",border:"1px solid var(--bord)",borderRadius:"12px",padding:"11px"}}><div style={{fontSize:"10px",color:"var(--t3)",marginBottom:"3px",fontWeight:600}}>{l}</div><div style={{fontSize:"13px",color:c||"var(--t1)",fontWeight:700}}>{v}</div></div>))}</div>
  </>);
}
