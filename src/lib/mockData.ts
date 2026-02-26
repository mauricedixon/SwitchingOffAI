export const STAGES = ["Lead","Outreach","Proposal","Negotiation","Decision","Won","Lost"];
export const STAGE_COLORS = ["#7C6FFF","#0E9B9A","#E09B22","#2EAA6A","#D94F3A","#22C87A","#888"];
export const STATUS = {
  not_started:{label:"Not Started",color:"#777",bg:"rgba(119,119,119,0.12)",icon:"○"},
  in_progress:{label:"In Progress",color:"#F59E0B",bg:"rgba(245,158,11,0.12)",icon:"◑"},
  waiting:{label:"Waiting",color:"#60A5FA",bg:"rgba(96,165,250,0.12)",icon:"⏸"},
  done:{label:"Done",color:"#34D399",bg:"rgba(52,211,153,0.12)",icon:"✓"},
  snoozed:{label:"Snoozed",color:"#A78BFA",bg:"rgba(167,139,250,0.12)",icon:"⏰"},
  overdue:{label:"Overdue",color:"#F87171",bg:"rgba(248,113,113,0.12)",icon:"!"},
};
export const PRIO = {
  P0:{label:"Fire",color:"#F87171"},
  P1:{label:"Today",color:"#FBBF24"},
  P2:{label:"Week",color:"#818CF8"},
  P3:{label:"Later",color:"#6B7280"},
};
export const INITIAL_TASKS = [
  {id:"t1",title:"Send revised pricing deck to Acme Corp",status:"overdue",priority:"P0",due:"Yesterday",contact:"Sarah Johnson",dealId:"d1",src:"voice"},
  {id:"t2",title:"Prep Q3 team presentation slides",status:"in_progress",priority:"P1",due:"Tomorrow",contact:null,dealId:null,src:"manual"},
  {id:"t3",title:"Follow up with Marcus Chen on proposal",status:"not_started",priority:"P1",due:"Today",contact:"Marcus Chen",dealId:"d2",src:"voice"},
  {id:"t4",title:"Review Nexus partnership brief",status:"not_started",priority:"P2",due:"This week",contact:"David Kim",dealId:"d3",src:"voice"},
  {id:"t5",title:"Book flights for SF conference",status:"waiting",priority:"P2",due:"Friday",contact:null,dealId:null,src:"manual"},
  {id:"t6",title:"Update investor deck financials",status:"snoozed",priority:"P3",due:"Next week",contact:null,dealId:null,src:"voice"},
  {id:"t7",title:"Schedule weekly team sync",status:"done",priority:"P2",due:"Monday",contact:null,dealId:null,src:"manual"},
  {id:"t8",title:"Send NDA to Summit Media",status:"done",priority:"P1",due:"Last week",contact:"Lisa Park",dealId:"d4",src:"voice"},
];
export const INITIAL_CONTACTS = [
  {id:"c1",name:"Sarah Johnson",role:"VP Partnerships",co:"Acme Corp",stage:"active",cadence:7,last:1,deals:["d1"],tags:["client","hot"],color:"#7C6FFF",init:"SJ",summary:"Key decision maker at Acme. Positive on Enterprise tier. Needs pricing this week."},
  {id:"c2",name:"Marcus Chen",role:"CEO",co:"Bluprint Inc",stage:"active",cadence:7,last:3,deals:["d2"],tags:["prospect"],color:"#0E9B9A",init:"MC",summary:"Warm prospect, loved the initial proposal. Follow-up window is open now."},
  {id:"c3",name:"James Rivera",role:"CFO",co:"Meridian Capital",stage:"warm",cadence:14,last:14,deals:["d5"],tags:["investor","vc"],color:"#E09B22",init:"JR",summary:"Met at conference. 14 days without contact — re-engage now."},
  {id:"c4",name:"Lisa Park",role:"Head of Growth",co:"Summit Media",stage:"active",cadence:7,last:5,deals:["d4"],tags:["client"],color:"#D94F3A",init:"LP",summary:"NDA sent. Moving to proposal. Very responsive — strong momentum."},
  {id:"c5",name:"David Kim",role:"Product Director",co:"Nexus Tech",stage:"warm",cadence:14,last:8,deals:["d3"],tags:["prospect"],color:"#2EAA6A",init:"DK",summary:"Budget approved for Q1. Needs full deck by Friday. High close potential."},
];
export const INITIAL_DEALS = [
  {id:"d1",name:"Acme Corp — Enterprise",stage:2,value:24000,cid:"c1",days:6,health:4,status:"stalled",next:"Send pricing deck TODAY — deal at risk",act:"2d ago"},
  {id:"d2",name:"Bluprint — Growth Plan",stage:2,value:12000,cid:"c2",days:3,health:7,status:"active",next:"Follow up on proposal — check timeline",act:"3d ago"},
  {id:"d3",name:"Nexus Tech — Pilot",stage:1,value:6000,cid:"c5",days:1,health:9,status:"active",next:"Send discovery questions before Friday",act:"1d ago"},
  {id:"d4",name:"Summit Media — Standard",stage:3,value:8500,cid:"c4",days:2,health:8,status:"active",next:"Schedule full scoping call — momentum good",act:"5h ago"},
  {id:"d5",name:"Meridian Capital — Q4",stage:0,value:50000,cid:"c3",days:14,health:3,status:"stalled",next:"Re-engage James immediately — 14d stale",act:"14d ago"},
];
export const COMMANDS = [
  {say:"Give me my morning briefing",resp:"Good morning. 3 priorities today: Acme pricing deck is overdue and at risk, Marcus follow-up is due, and Q3 deck due tomorrow. Two deals stalling — Acme and Meridian need attention today.",fx:null},
  {say:"What's open with Acme right now?",resp:"Acme is in Proposal stage, day 6. Sarah wants pricing by end of week. You have an overdue task — send pricing deck. Health score 4/10. This deal needs action today.",fx:null},
  {say:"Move Acme deal to Negotiation",resp:"Done — Acme moved to Negotiation stage. Deal card updated, stall timer reset. Want me to log a note on Sarah's contact card?",fx:"moveAcme"},
  {say:"Who do I need to follow up with?",resp:"Three people: James Rivera — 14 days overdue, re-engage immediately. Sarah Johnson — at 7-day cadence. Marcus Chen — proposal response due this week.",fx:null},
  {say:"Log note on Sarah — she loved the pricing",resp:"Note logged on Sarah Johnson: 'Loved the new pricing proposal.' Last contact updated to today. Follow-up cadence reset — next nudge in 7 days.",fx:null},
  {say:"I'm done for today",resp:"Initiating your end-of-day handoff...",fx:"endDay"},
];