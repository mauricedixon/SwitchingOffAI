// ── Type Aliases ──
export type AppMode = 'work' | 'transition' | 'chill';
export type TaskStatus = 'not_started' | 'in_progress' | 'waiting' | 'done' | 'snoozed' | 'overdue';
export type TaskPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type VoicePhase = 'idle' | 'recording' | 'processing' | 'response' | 'error';
export type ContactStage = 'cold' | 'warm' | 'active' | 'partner' | 'inactive';
export type DealStatus = 'active' | 'stalled' | 'won' | 'lost';

// ── Interfaces ──
export interface Task {
    id: string;
    title: string;
    raw_transcript?: string;
    status: TaskStatus;
    priority: TaskPriority;
    due_date?: string;
    crm_contact_id?: string;
    deal_id?: string;
    source: 'voice' | 'manual';
    completed_at?: string;
    created_at: string;
}

export interface Contact {
    id: string;
    name: string;
    role?: string;
    company?: string;
    email?: string;
    phone?: string;
    stage: ContactStage;
    cadence_days: number;
    last_contact_at?: string;
    ai_summary?: string;
    tags: string[];
    color: string;
    created_at: string;
}

export interface ContactNote {
    id: string;
    contact_id: string;
    body: string;
    source: 'voice' | 'manual';
    created_at: string;
}

export interface Deal {
    id: string;
    name: string;
    stage_index: number;
    value?: number;
    primary_contact_id?: string;
    status: DealStatus;
    health_score: number;
    next_action?: string;
    days_in_stage: number;
    last_activity_at: string;
    created_at: string;
}

export interface Reminder {
    id: string;
    title: string;
    fire_at: string;
    recurrence_rule?: string;
    contact_id?: string;
    deal_id?: string;
    status: 'pending' | 'fired' | 'dismissed';
    created_by: 'voice' | 'system' | 'manual';
}

export interface UserSettings {
    work_zone_lat?: number;
    work_zone_lng?: number;
    work_zone_radius: number;
    home_zone_lat?: number;
    home_zone_lng?: number;
    home_zone_radius: number;
    work_hours_start: string;
    work_hours_end: string;
    work_days: number[];
    timezone: string;
    transition_grace_minutes: number;
    chill_settle_minutes: number;
}

export interface Notification {
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface ParsedIntent {
    intent_type: string;
    confidence: number;
    routing_destination: string;
    clarifying_question?: string;
    extracted_data: {
        task_title?: string;
        due_date?: string;
        priority?: TaskPriority;
        contact_name?: string;
        note_body?: string;
        deal_name?: string;
        reminder_time?: string;
        mode_target?: string;
    };
}
