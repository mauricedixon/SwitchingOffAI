'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    AppMode,
    Task,
    Contact,
    ContactNote,
    Deal,
    Reminder,
    UserSettings,
    Notification,
    VoicePhase,
} from '@/types';

interface AppState {
    // ── Mode ──
    mode: AppMode;
    modeTransitioning: boolean;
    activeTab: 'home' | 'today' | 'crm' | 'pipeline';

    // ── Notification ──
    notification: Notification | null;

    // ── Voice ──
    isRecording: boolean;
    voicePhase: VoicePhase;
    voiceTranscript: string;
    voiceResponse: string;
    showVoicePanel: boolean;

    // ── Data ──
    tasks: Task[];
    contacts: Contact[];
    contactNotes: ContactNote[];
    deals: Deal[];
    reminders: Reminder[];
    settings: UserSettings;

    // ── Permission to Stop ──
    showPermissionToStop: boolean;
    handoffSummary: string[];

    // ── Actions: Mode ──
    setMode: (mode: AppMode) => void;
    transitionMode: (mode: AppMode) => void;
    setActiveTab: (tab: 'home' | 'today' | 'crm' | 'pipeline') => void;

    // ── Actions: Notification ──
    showNotificationMsg: (message: string, type?: 'success' | 'error' | 'info') => void;
    clearNotification: () => void;

    // ── Actions: Voice ──
    setRecording: (v: boolean) => void;
    setVoicePhase: (phase: VoicePhase) => void;
    setVoiceTranscript: (t: string) => void;
    setVoiceResponse: (r: string) => void;
    setShowVoicePanel: (v: boolean) => void;
    resetVoice: () => void;

    // ── Actions: Tasks ──
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    completeTask: (id: string) => void;

    // ── Actions: Contacts ──
    setContacts: (contacts: Contact[]) => void;
    addContact: (contact: Contact) => void;
    updateContact: (id: string, updates: Partial<Contact>) => void;
    addContactNote: (note: ContactNote) => void;

    // ── Actions: Deals ──
    setDeals: (deals: Deal[]) => void;
    addDeal: (deal: Deal) => void;
    updateDeal: (id: string, updates: Partial<Deal>) => void;
    moveDealStage: (id: string, direction: 1 | -1) => void;

    // ── Actions: Reminders ──
    addReminder: (reminder: Reminder) => void;
    dismissReminder: (id: string) => void;

    // ── Actions: Settings ──
    updateSettings: (updates: Partial<UserSettings>) => void;

    // ── Actions: Permission to Stop ──
    setShowPermissionToStop: (v: boolean) => void;
    setHandoffSummary: (s: string[]) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // ── Defaults ──
            mode: 'work',
            modeTransitioning: false,
            activeTab: 'home',
            notification: null,
            isRecording: false,
            voicePhase: 'idle',
            voiceTranscript: '',
            voiceResponse: '',
            showVoicePanel: false,
            tasks: [],
            contacts: [],
            contactNotes: [],
            deals: [],
            reminders: [],
            settings: {
                work_hours_start: '08:00',
                work_hours_end: '18:00',
                work_days: [1, 2, 3, 4, 5],
                timezone: 'America/New_York',
                work_zone_radius: 150,
                home_zone_radius: 100,
                transition_grace_minutes: 2,
                chill_settle_minutes: 5,
            },
            showPermissionToStop: false,
            handoffSummary: [],

            // ── Mode Actions ──
            setMode: (mode) => set({ mode }),

            transitionMode: (mode) => {
                set({ modeTransitioning: true });
                setTimeout(() => {
                    set({
                        mode,
                        modeTransitioning: false,
                        ...(mode === 'chill' ? { activeTab: 'home' as const } : {}),
                    });
                }, 700);
            },

            setActiveTab: (tab) => set({ activeTab: tab }),

            // ── Notification Actions ──
            showNotificationMsg: (message, type = 'success') => {
                set({ notification: { message, type } });
                setTimeout(() => set({ notification: null }), 3000);
            },

            clearNotification: () => set({ notification: null }),

            // ── Voice Actions ──
            setRecording: (v) => set({ isRecording: v }),
            setVoicePhase: (phase) => set({ voicePhase: phase }),
            setVoiceTranscript: (t) => set({ voiceTranscript: t }),
            setVoiceResponse: (r) => set({ voiceResponse: r }),
            setShowVoicePanel: (v) => set({ showVoicePanel: v }),
            resetVoice: () =>
                set({
                    isRecording: false,
                    voicePhase: 'idle',
                    voiceTranscript: '',
                    voiceResponse: '',
                    showVoicePanel: false,
                }),

            // ── Task Actions ──
            setTasks: (tasks) => set({ tasks }),
            addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
            updateTask: (id, updates) =>
                set((s) => ({
                    tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
                })),
            completeTask: (id) =>
                set((s) => ({
                    tasks: s.tasks.map((t) =>
                        t.id === id
                            ? { ...t, status: 'done' as const, completed_at: new Date().toISOString() }
                            : t
                    ),
                })),

            // ── Contact Actions ──
            setContacts: (contacts) => set({ contacts }),
            addContact: (contact) => set((s) => ({ contacts: [contact, ...s.contacts] })),
            updateContact: (id, updates) =>
                set((s) => ({
                    contacts: s.contacts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
                })),
            addContactNote: (note) =>
                set((s) => ({
                    contactNotes: [note, ...s.contactNotes],
                    contacts: s.contacts.map((c) =>
                        c.id === note.contact_id
                            ? { ...c, last_contact_at: new Date().toISOString() }
                            : c
                    ),
                })),

            // ── Deal Actions ──
            setDeals: (deals) => set({ deals }),
            addDeal: (deal) => set((s) => ({ deals: [deal, ...s.deals] })),
            updateDeal: (id, updates) =>
                set((s) => ({
                    deals: s.deals.map((d) =>
                        d.id === id
                            ? { ...d, ...updates, last_activity_at: new Date().toISOString() }
                            : d
                    ),
                })),
            moveDealStage: (id, direction) =>
                set((s) => ({
                    deals: s.deals.map((d) => {
                        if (d.id !== id) return d;
                        const newIndex = Math.max(0, Math.min(6, d.stage_index + direction));
                        return {
                            ...d,
                            stage_index: newIndex,
                            days_in_stage: 0,
                            last_activity_at: new Date().toISOString(),
                        };
                    }),
                })),

            // ── Reminder Actions ──
            addReminder: (reminder) =>
                set((s) => ({ reminders: [reminder, ...s.reminders] })),
            dismissReminder: (id) =>
                set((s) => ({
                    reminders: s.reminders.map((r) =>
                        r.id === id ? { ...r, status: 'dismissed' as const } : r
                    ),
                })),

            // ── Settings ──
            updateSettings: (updates) =>
                set((s) => ({ settings: { ...s.settings, ...updates } })),

            // ── Permission to Stop ──
            setShowPermissionToStop: (v) => set({ showPermissionToStop: v }),
            setHandoffSummary: (s) => set({ handoffSummary: s }),
        }),
        {
            name: 'switchingoff-ai-v2',
            partialize: (state) => ({
                tasks: state.tasks,
                contacts: state.contacts,
                contactNotes: state.contactNotes,
                deals: state.deals,
                reminders: state.reminders,
                settings: state.settings,
                mode: state.mode,
            }),
        }
    )
);
