'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { useGeofencing } from '@/hooks/useGeofencing';
import ModeOverlay from '@/components/layout/ModeOverlay';
import NotificationToast from '@/components/ui/NotificationToast';
import AppShell from '@/components/layout/AppShell';

export default function Page() {
  useGeofencing();
  const [hydrated, setHydrated] = useState(false);

  const tasks = useAppStore((s) => s.tasks);
  const setTasks = useAppStore((s) => s.setTasks);
  const setContacts = useAppStore((s) => s.setContacts);
  const setDeals = useAppStore((s) => s.setDeals);

  // Wait for Zustand to hydrate from localStorage
  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    // If already hydrated
    if (useAppStore.persist.hasHydrated()) setHydrated(true);
    return () => unsub();
  }, []);

  // Seed data after hydration
  useEffect(() => {
    if (!hydrated) return;
    if (tasks.length > 0) return;

    setTasks([
      {
        id: 't1',
        title: 'Send revised pricing deck to Acme Corp',
        status: 'overdue',
        priority: 'P0',
        due_date: 'Yesterday',
        crm_contact_id: 'c1',
        deal_id: 'd1',
        source: 'voice',
        raw_transcript: 'Send the updated pricing deck to Sarah at Acme',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 't2',
        title: 'Follow up with Marcus on Bluprint timeline',
        status: 'in_progress',
        priority: 'P1',
        due_date: 'Today',
        crm_contact_id: 'c2',
        deal_id: 'd2',
        source: 'voice',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 't3',
        title: 'Draft SOW for Summit Media pilot',
        status: 'not_started',
        priority: 'P1',
        due_date: 'Tomorrow',
        crm_contact_id: 'c4',
        deal_id: 'd4',
        source: 'manual',
        created_at: new Date().toISOString(),
      },
      {
        id: 't4',
        title: 'Review James Rivera contract terms',
        status: 'waiting',
        priority: 'P2',
        due_date: 'This week',
        crm_contact_id: 'c3',
        deal_id: 'd5',
        source: 'manual',
        created_at: new Date().toISOString(),
      },
      {
        id: 't5',
        title: 'Prepare Q4 pipeline analysis report',
        status: 'snoozed',
        priority: 'P3',
        due_date: 'Next week',
        source: 'manual',
        created_at: new Date().toISOString(),
      },
      {
        id: 't6',
        title: 'Update CRM tags for all active deals',
        status: 'done',
        priority: 'P2',
        due_date: 'Last week',
        source: 'manual',
        completed_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: 't7',
        title: 'Send NDA to Summit Media',
        status: 'done',
        priority: 'P1',
        due_date: 'Last week',
        crm_contact_id: 'c4',
        deal_id: 'd4',
        source: 'voice',
        completed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
      {
        id: 't8',
        title: 'Research competitor landscape for Nexus pitch',
        status: 'not_started',
        priority: 'P2',
        due_date: 'This week',
        crm_contact_id: 'c5',
        deal_id: 'd3',
        source: 'manual',
        created_at: new Date().toISOString(),
      },
    ]);

    setContacts([
      {
        id: 'c1',
        name: 'Sarah Johnson',
        role: 'VP of Operations',
        company: 'Acme Corp',
        stage: 'active',
        cadence_days: 7,
        last_contact_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        ai_summary: 'Key decision maker. Prefers morning calls. Budget approved for Q1. Needs pricing deck ASAP — deal at risk without it.',
        tags: ['decision-maker', 'enterprise'],
        color: '#6C63FF',
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
      },
      {
        id: 'c2',
        name: 'Marcus Chen',
        role: 'CTO',
        company: 'Bluprint Studios',
        stage: 'active',
        cadence_days: 7,
        last_contact_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        ai_summary: 'Technical buyer. Responds well to data-driven proposals. Currently evaluating 2 other vendors.',
        tags: ['technical', 'mid-market'],
        color: '#0E7C7B',
        created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
      },
      {
        id: 'c3',
        name: 'James Rivera',
        role: 'Managing Director',
        company: 'Meridian Capital',
        stage: 'warm',
        cadence_days: 14,
        last_contact_at: new Date(Date.now() - 86400000 * 14).toISOString(),
        ai_summary: 'High-value prospect. Needs re-engagement — 14 days since last contact. Fund closes Q1.',
        tags: ['finance', 'high-value'],
        color: '#C9851A',
        created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
      },
      {
        id: 'c4',
        name: 'Lisa Park',
        role: 'Head of Marketing',
        company: 'Summit Media',
        stage: 'active',
        cadence_days: 7,
        last_contact_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        ai_summary: 'Fast-moving deal. Pilot agreement nearly finalized. Needs SOW by end of week.',
        tags: ['marketing', 'pilot'],
        color: '#EC4899',
        created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
      },
      {
        id: 'c5',
        name: 'David Kim',
        role: 'Product Director',
        company: 'Nexus Tech',
        stage: 'warm',
        cadence_days: 14,
        last_contact_at: new Date(Date.now() - 86400000 * 8).toISOString(),
        ai_summary: 'Budget approved for Q1. Needs full deck by Friday. High close potential.',
        tags: ['prospect', 'tech'],
        color: '#2EAA6A',
        created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
      },
    ]);

    setDeals([
      {
        id: 'd1',
        name: 'Acme Corp — Enterprise',
        stage_index: 2,
        value: 24000,
        primary_contact_id: 'c1',
        status: 'stalled',
        health_score: 4,
        next_action: 'Send pricing deck TODAY — deal at risk',
        days_in_stage: 6,
        last_activity_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
      },
      {
        id: 'd2',
        name: 'Bluprint Studios — Platform',
        stage_index: 2,
        value: 12000,
        primary_contact_id: 'c2',
        status: 'active',
        health_score: 7,
        next_action: 'Schedule technical deep-dive demo',
        days_in_stage: 3,
        last_activity_at: new Date(Date.now() - 86400000).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
      },
      {
        id: 'd3',
        name: 'Nexus Tech — Pilot',
        stage_index: 1,
        value: 6000,
        primary_contact_id: 'c5',
        status: 'active',
        health_score: 9,
        next_action: 'Send competitor analysis deck',
        days_in_stage: 2,
        last_activity_at: new Date(Date.now() - 86400000).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        id: 'd4',
        name: 'Summit Media — Pilot',
        stage_index: 3,
        value: 8500,
        primary_contact_id: 'c4',
        status: 'active',
        health_score: 8,
        next_action: 'Finalize SOW and send for signature',
        days_in_stage: 1,
        last_activity_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
      },
      {
        id: 'd5',
        name: 'Meridian Capital — Q4',
        stage_index: 0,
        value: 50000,
        primary_contact_id: 'c3',
        status: 'stalled',
        health_score: 3,
        next_action: 'Re-engage James immediately — 14d stale',
        days_in_stage: 14,
        last_activity_at: new Date(Date.now() - 86400000 * 14).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
      },
    ]);
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ModeOverlay />
      <NotificationToast />
      <AppShell />
    </>
  );
}
