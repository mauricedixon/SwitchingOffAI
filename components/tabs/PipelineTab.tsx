'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import DealDetail from '@/components/ui/DealDetail';
import type { Deal } from '@/types';

const STAGE_NAMES = ['Lead', 'Outreach', 'Proposal', 'Negotiation', 'Decision', 'Won', 'Lost'];
const STAGE_COLORS = ['#6C63FF', '#0E7C7B', '#C9851A', '#1A7A4A', '#C0392B', '#27AE60', '#7F8C8D'];

export default function PipelineTab() {
    const deals = useAppStore((s) => s.deals);
    const contacts = useAppStore((s) => s.contacts);
    const tasks = useAppStore((s) => s.tasks);

    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

    const activeDeals = deals.filter((d) => d.status !== 'won' && d.status !== 'lost');
    const stalledDeals = deals.filter((d) => d.status === 'stalled');
    const totalValue = activeDeals.reduce((sum, d) => sum + (d.value || 0), 0);

    // Kanban columns (Lead through Decision only)
    const columns = STAGE_NAMES.slice(0, 5).map((name, idx) => ({
        name,
        color: STAGE_COLORS[idx],
        deals: deals.filter((d) => d.stage_index === idx),
    }));

    if (selectedDeal) {
        return (
            <DealDetail
                deal={selectedDeal}
                contacts={contacts}
                tasks={tasks}
                onBack={() => setSelectedDeal(null)}
            />
        );
    }

    return (
        <div style={{ paddingTop: 16, animation: 'fadeIn 0.3s ease' }}>
            {/* Header */}
            <div style={{ marginBottom: 16 }}>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                    Pipeline
                </div>
                <div style={{ fontSize: 13, color: 'var(--text3)' }}>
                    {activeDeals.length} active deals ·{' '}
                    <span className="font-mono" style={{ color: 'var(--gold)' }}>
                        ${totalValue.toLocaleString()}
                    </span>{' '}
                    total potential
                </div>
            </div>

            {/* Stage Mini Bar */}
            <div className="scrollbar-hide" style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
                {columns.map((col) => (
                    <div
                        key={col.name}
                        style={{
                            padding: '6px 12px',
                            borderRadius: 8,
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderBottom: `2px solid ${col.color}`,
                            fontSize: 11,
                            fontWeight: 500,
                            color: 'var(--text2)',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
                        {col.name}
                        <span className="font-mono" style={{ fontSize: 10, color: col.color }}>{col.deals.length}</span>
                    </div>
                ))}
            </div>

            {/* Stalled Alert */}
            {stalledDeals.length > 0 && (
                <div
                    style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        borderRadius: 10,
                        padding: 12,
                        marginBottom: 16,
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    <span style={{ fontSize: 14 }}>⚠️</span>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)' }}>
                            {stalledDeals.length} deals stalling
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                            {stalledDeals.map((d) => d.name.split(' — ')[0]).join(', ')}
                        </div>
                    </div>
                </div>
            )}

            {/* Kanban Board */}
            {deals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Pipeline is clear</div>
                    <div style={{ fontSize: 13 }}>Voice: &quot;New deal, Acme, proposal stage&quot;</div>
                </div>
            ) : (
                <div
                    className="scrollbar-hide"
                    style={{
                        display: 'flex',
                        gap: 12,
                        overflowX: 'auto',
                        paddingBottom: 20,
                    }}
                >
                    {columns.map((col) => (
                        <div
                            key={col.name}
                            style={{
                                minWidth: 200,
                                maxWidth: 220,
                                flexShrink: 0,
                            }}
                        >
                            {/* Column Header */}
                            <div
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '10px 10px 0 0',
                                    background: `${col.color}18`,
                                    borderBottom: `2px solid ${col.color}`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 8,
                                }}
                            >
                                <span style={{ fontSize: 12, fontWeight: 700, color: col.color }}>{col.name}</span>
                                <span className="font-mono" style={{ fontSize: 10, color: col.color }}>{col.deals.length}</span>
                            </div>

                            {/* Deal Cards */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {col.deals.map((deal) => (
                                    <div
                                        key={deal.id}
                                        onClick={() => setSelectedDeal(deal)}
                                        style={{
                                            background: 'var(--surface)',
                                            borderRadius: 10,
                                            padding: 12,
                                            border: '1px solid var(--border)',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>
                                            {deal.name.split(' — ')[0]}
                                        </div>
                                        {deal.value && (
                                            <div className="font-mono" style={{ fontSize: 12, color: 'var(--gold)', marginBottom: 6 }}>
                                                ${deal.value.toLocaleString()}
                                            </div>
                                        )}
                                        {deal.status === 'stalled' && (
                                            <div
                                                style={{
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    color: 'var(--danger)',
                                                    marginBottom: 6,
                                                    animation: 'stalledPulse 2s infinite',
                                                }}
                                            >
                                                ⚠ STALLED {deal.days_in_stage}d
                                            </div>
                                        )}

                                        {/* Health pip bar */}
                                        <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
                                            {[0, 1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    style={{
                                                        width: 14,
                                                        height: 6,
                                                        borderRadius: 2,
                                                        background:
                                                            i < Math.ceil(deal.health_score / 2)
                                                                ? deal.health_score >= 7
                                                                    ? '#10B981'
                                                                    : deal.health_score >= 4
                                                                        ? '#F59E0B'
                                                                        : '#EF4444'
                                                                : 'var(--bg3)',
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        <div className="font-mono" style={{ fontSize: 10, color: 'var(--text3)' }}>
                                            {deal.days_in_stage}d in stage
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
