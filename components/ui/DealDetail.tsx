'use client';

import { useAppStore } from '@/store/appStore';
import type { Deal, Contact, Task } from '@/types';

const STAGE_NAMES = ['Lead', 'Outreach', 'Proposal', 'Negotiation', 'Decision', 'Won', 'Lost'];
const STAGE_COLORS = ['#6C63FF', '#0E7C7B', '#C9851A', '#1A7A4A', '#C0392B', '#27AE60', '#7F8C8D'];

export default function DealDetail({
    deal,
    contacts,
    tasks,
    onBack,
}: {
    deal: Deal;
    contacts: Contact[];
    tasks: Task[];
    onBack: () => void;
}) {
    const moveDealStage = useAppStore((s) => s.moveDealStage);
    const primaryContact = contacts.find((c) => c.id === deal.primary_contact_id);
    const dealTasks = tasks.filter((t) => t.deal_id === deal.id);

    const daysColor = deal.days_in_stage < 3 ? '#10B981' : deal.days_in_stage <= 7 ? '#F59E0B' : '#EF4444';
    const healthColor = deal.health_score >= 7 ? '#10B981' : deal.health_score >= 4 ? '#F59E0B' : '#EF4444';

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 80,
                background: 'var(--bg)',
                overflowY: 'auto',
                animation: 'slideRight 0.3s ease',
                padding: '0 20px 40px',
            }}
        >
            {/* Back */}
            <button
                onClick={onBack}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '16px 0',
                }}
            >
                ← Back
            </button>

            {/* Deal Name */}
            <div className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
                {deal.name}
            </div>

            {/* Stage Progress Dots */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, justifyContent: 'center' }}>
                {STAGE_NAMES.slice(0, 5).map((_, idx) => (
                    <div
                        key={idx}
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: idx <= deal.stage_index ? STAGE_COLORS[deal.stage_index] : 'var(--bg3)',
                            transition: 'background 0.3s ease',
                        }}
                    />
                ))}
            </div>

            {/* Value + Stage Controls */}
            <div
                style={{
                    background: 'var(--surface)',
                    borderRadius: 14,
                    padding: 16,
                    border: '1px solid var(--border)',
                    marginBottom: 16,
                    textAlign: 'center',
                }}
            >
                {deal.value && (
                    <div className="font-mono" style={{ fontSize: 28, fontWeight: 700, color: 'var(--gold)', marginBottom: 8 }}>
                        ${deal.value.toLocaleString()}
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                    <button
                        onClick={() => moveDealStage(deal.id, -1)}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'var(--bg3)',
                            border: '1px solid var(--border)',
                            color: 'var(--text2)',
                            fontSize: 18,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        ←
                    </button>
                    <span
                        className="font-display"
                        style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: STAGE_COLORS[deal.stage_index],
                            minWidth: 100,
                            textAlign: 'center',
                        }}
                    >
                        {STAGE_NAMES[deal.stage_index]}
                    </span>
                    <button
                        onClick={() => moveDealStage(deal.id, 1)}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'var(--bg3)',
                            border: '1px solid var(--border)',
                            color: 'var(--text2)',
                            fontSize: 18,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        →
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 12, border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div className="font-mono" style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 4 }}>DAYS IN STAGE</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: daysColor }}>{deal.days_in_stage}</div>
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 12, border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div className="font-mono" style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 4 }}>HEALTH</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: healthColor }}>{deal.health_score}/10</div>
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 12, border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div className="font-mono" style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 4 }}>TASKS</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{dealTasks.length}</div>
                </div>
            </div>

            {/* AI Next Action */}
            {deal.next_action && (
                <div
                    style={{
                        background: 'var(--surface)',
                        borderRadius: 14,
                        padding: 16,
                        marginBottom: 16,
                        borderLeft: '3px solid var(--teal)',
                        border: '1px solid var(--border)',
                        borderLeftWidth: 3,
                        borderLeftColor: 'var(--teal)',
                    }}
                >
                    <div className="font-mono" style={{ fontSize: 10, color: 'var(--teal)', letterSpacing: '0.1em', marginBottom: 8 }}>
                        🤖 NEXT ACTION
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{deal.next_action}</div>
                </div>
            )}

            {/* Primary Contact */}
            {primaryContact && (
                <div
                    style={{
                        background: 'var(--surface)',
                        borderRadius: 14,
                        padding: 16,
                        border: '1px solid var(--border)',
                    }}
                >
                    <div className="font-mono" style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em', marginBottom: 10 }}>
                        PRIMARY CONTACT
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: primaryContact.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 14,
                                fontWeight: 700,
                                color: '#fff',
                                flexShrink: 0,
                            }}
                        >
                            {primaryContact.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{primaryContact.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text3)' }}>{primaryContact.role}</div>
                        </div>
                        {primaryContact.last_contact_at && (
                            <span className="font-mono" style={{ fontSize: 10, color: 'var(--text3)' }}>
                                {Math.floor((Date.now() - new Date(primaryContact.last_contact_at).getTime()) / 86400000)}d ago
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
