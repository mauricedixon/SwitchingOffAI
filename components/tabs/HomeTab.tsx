'use client';

import { useAppStore } from '@/store/appStore';

const STAGE_NAMES = ['Lead', 'Outreach', 'Proposal', 'Negotiation', 'Decision', 'Won', 'Lost'];

export default function HomeTab() {
    const tasks = useAppStore((s) => s.tasks);
    const deals = useAppStore((s) => s.deals);
    const transitionMode = useAppStore((s) => s.transitionMode);
    const setShowPermissionToStop = useAppStore((s) => s.setShowPermissionToStop);

    const doneTasks = tasks.filter((t) => t.status === 'done');
    const nonDoneTasks = tasks.filter((t) => t.status !== 'done');
    const stalledDeals = deals.filter((d) => d.status === 'stalled');
    const activeDeals = deals.filter((d) => d.status === 'active' || d.status === 'stalled');
    const pct = tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0;

    const top3 = nonDoneTasks
        .sort((a, b) => {
            const pOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
            return pOrder[a.priority] - pOrder[b.priority];
        })
        .slice(0, 3);

    const priorityColors: Record<string, string> = {
        P0: '#EF4444', P1: '#F59E0B', P2: '#6C63FF', P3: '#6B7280',
    };

    return (
        <div style={{ paddingTop: 16, animation: 'fadeIn 0.3s ease' }}>
            {/* Morning Briefing */}
            <div
                style={{
                    background: 'var(--surface)',
                    borderRadius: 14,
                    padding: 18,
                    marginBottom: 16,
                    borderLeft: '3px solid var(--gold)',
                    border: '1px solid var(--border)',
                    borderLeftWidth: 3,
                    borderLeftColor: 'var(--gold)',
                }}
            >
                <div className="font-mono" style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: 8 }}>
                    📅 MORNING BRIEFING
                </div>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                    Good morning 👋
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
                    You have <strong style={{ color: 'var(--text1)' }}>{nonDoneTasks.length} priorities</strong> today,{' '}
                    <strong style={{ color: stalledDeals.length > 0 ? 'var(--danger)' : 'var(--text1)' }}>
                        {stalledDeals.length} deals
                    </strong>{' '}
                    need attention
                </div>

                {/* Top 3 priorities */}
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {top3.map((task) => (
                        <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    background: priorityColors[task.priority],
                                    flexShrink: 0,
                                }}
                            />
                            <span style={{ fontSize: 13, color: 'var(--text1)', flex: 1 }}>{task.title}</span>
                            {task.due_date && (
                                <span className="font-mono" style={{ fontSize: 10, color: 'var(--text3)' }}>
                                    {task.due_date}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress Bar */}
            <div
                style={{
                    background: 'var(--surface)',
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 16,
                    border: '1px solid var(--border)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)' }}>Today&apos;s Progress</span>
                    <span className="font-mono" style={{ fontSize: 11, color: 'var(--text3)' }}>
                        {doneTasks.length}/{tasks.length} tasks
                    </span>
                </div>
                <div
                    style={{
                        height: 8,
                        borderRadius: 4,
                        background: 'var(--bg3)',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            width: `${pct}%`,
                            borderRadius: 4,
                            background: 'linear-gradient(90deg, var(--teal), var(--accent))',
                            transition: 'width 0.5s ease',
                        }}
                    />
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                <StatCard label="Open Tasks" value={nonDoneTasks.length} />
                <StatCard label="Active Deals" value={activeDeals.length} />
                <StatCard label="Stalled" value={stalledDeals.length} color={stalledDeals.length > 0 ? 'var(--danger)' : undefined} />
            </div>

            {/* Stalled Alert */}
            {stalledDeals.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                    {stalledDeals.map((deal) => (
                        <div
                            key={deal.id}
                            style={{
                                background: 'var(--surface)',
                                borderRadius: 12,
                                padding: 14,
                                marginBottom: 8,
                                borderLeft: '3px solid var(--danger)',
                                border: '1px solid var(--border)',
                                borderLeftWidth: 3,
                                borderLeftColor: 'var(--danger)',
                                animation: 'stalledPulse 2s infinite',
                            }}
                        >
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>
                                {deal.name}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--danger)' }}>
                                Stalled {deal.days_in_stage}d in {STAGE_NAMES[deal.stage_index]}
                            </div>
                            {deal.next_action && (
                                <div style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic', marginTop: 4 }}>
                                    {deal.next_action}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Commands */}
            <div className="scrollbar-hide" style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, paddingBottom: 4 }}>
                {['Morning briefing', "What's next?", 'Pipeline status', 'Who to follow up?', "I'm done today"].map((cmd) => (
                    <div
                        key={cmd}
                        style={{
                            padding: '8px 14px',
                            borderRadius: 100,
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            fontSize: 12,
                            color: 'var(--text2)',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            cursor: 'pointer',
                        }}
                    >
                        {cmd}
                    </div>
                ))}
            </div>

            {/* Mode Switcher */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                <ModeButton emoji="⚡" label="Work" active color="#6C63FF" onClick={() => { }} />
                <ModeButton
                    emoji="🌀"
                    label="Wind Down"
                    color="#F59E0B"
                    onClick={() => setShowPermissionToStop(true)}
                />
                <ModeButton
                    emoji="🌙"
                    label="Chill"
                    color="#10B981"
                    onClick={() => transitionMode('chill')}
                />
            </div>
        </div>
    );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
    return (
        <div
            style={{
                background: 'var(--surface)',
                borderRadius: 12,
                padding: 14,
                border: '1px solid var(--border)',
                textAlign: 'center',
            }}
        >
            <div
                className="font-display"
                style={{ fontSize: 26, fontWeight: 800, color: color || 'var(--text1)', marginBottom: 4 }}
            >
                {value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{label}</div>
        </div>
    );
}

function ModeButton({
    emoji,
    label,
    color,
    active,
    onClick,
}: {
    emoji: string;
    label: string;
    color: string;
    active?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: 12,
                background: active ? `${color}20` : 'var(--surface)',
                border: `1px solid ${active ? `${color}60` : 'var(--border)'}`,
                color: active ? color : 'var(--text2)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
            }}
        >
            {emoji} {label}
        </button>
    );
}
