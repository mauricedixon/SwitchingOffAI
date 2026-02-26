# SwitchingOff AI — Personal Command Center

A voice-first PWA that manages your work life (tasks, CRM, deal pipeline) and knows when to help you switch off.

## Quick Start

```bash
git clone https://github.com/mauricedixon/SwitchingOffAI.git
cd SwitchingOffAI
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Supabase Setup

1. Go to the [Supabase Dashboard → SQL Editor](https://supabase.com/dashboard/project/pajidpoyzggxzngoqtnh/sql)
2. Paste and run the contents of `supabase/schema.sql`
3. This creates all tables (users, tasks, contacts, deals, reminders, voice_captures, mode_history) with RLS policies

## Architecture

```
app/
├── api/                    # API routes
│   ├── briefing/           # AI morning briefing + handoff summary
│   └── voice/              # Whisper transcription + GPT intent processing
├── globals.css             # Dual-mode design system (Work ↔ Chill)
├── layout.tsx              # Root layout (Google Fonts: Syne, DM Sans, DM Mono)
└── page.tsx                # Main page with seed data

components/
├── layout/                 # AppShell, StatusBar, BottomNav, ModeOverlay
├── tabs/                   # HomeTab, TodayTab, CRMTab, PipelineTab, ChillMode
├── ui/                     # TaskDetailSheet, ContactDetail, DealDetail, PermissionToStop, NotificationToast
└── voice/                  # VoicePanel

hooks/                      # useVoiceRecording, useGeofencing
lib/                        # ai.ts (OpenAI), supabase.ts
store/                      # appStore.ts (Zustand + persist)
types/                      # index.ts (all TypeScript types)
supabase/                   # schema.sql (11 tables + RLS)
```

## Key Features

- **4 Work Tabs**: Home (AI briefing + stats), Today (task list), CRM (contacts + notes), Pipeline (Kanban board)
- **Voice Commands**: Hold mic → speak → auto-creates tasks, logs notes, sets reminders
- **Dual Mode**: Work (dark navy) ↔ Chill (warm cream) with smooth CSS transition
- **Permission to Stop**: End-of-day ritual with AI handoff summary
- **Geofencing**: Auto mode-switch based on location + time
- **Zustand State**: 25+ actions, localStorage persistence

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Zustand (state)
- Tailwind CSS
- Framer Motion
- Supabase (database)
- OpenAI (Whisper, GPT-4o, TTS)
