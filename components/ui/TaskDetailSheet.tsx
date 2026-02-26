'use client';

import type { Task, TaskStatus } from '@/types';

const STATUS_OPTIONS: { key: TaskStatus; label: string; color: string; icon: string }[] = [
    { key: 'not_started', label: 'Not Started', color: '#6B7280', icon: '○' },
    { key: 'in_progress', label: 'In Progress', color: '#F59E0B', icon: '◑' },
    { key: 'waiting', label: 'Waiting', color: '#3B82F6', icon: '⏸' },
    { key: 'done', label: 'Done', color: '#10B981', icon: '✓' },
    { key: 'snoozed', label: 'Snoozed', color: '#8B5CF6', icon: '⏰' },
    { key: 'overdue', label: 'Overdue', color: '#EF4444', icon: '!' },
];

const PRIORITY_LABELS: Record<string, string> = {
    P0: 'Fire', P1: 'Today', P2: 'Week', P3: 'Later',
};

export default function TaskDetailSheet({
    task,
    onClose,
    onStatusChange,
    onComplete,
}: {
    task: Task;
    onClose: () => void;
    onStatusChange: (status: TaskStatus) => void;
    onComplete: () => void;
}) {
    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 90,
                background: 'var(--bg)',
                borderTop: '1px solid var(--border)',
                borderRadius: '20px 20px 0 0',
                padding: '12px 20px 32px',
                animation: 'slideUp 0.3s ease',
                maxHeight: '70dvh',
                overflowY: 'auto',
            }}
        >
            {/* Drag Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <div
                    style={{
                        width: 40,
                        height: 4,
                        borderRadius: 2,
                        background: 'var(--border2)',
                    }}
                />
            </div>

            {/* Close Button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 16,
                    right: 20,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text2)',
                    fontSize: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                ✕
            </button>

            {/* Task Title */}
            <div
                className="font-display"
                style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, paddingRight: 40 }}
            >
                {task.title}
            </div>

            {/* Update Status */}
            <div style={{ marginBottom: 20 }}>
                <div className="font-mono" style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em', marginBottom: 10 }}>
                    UPDATE STATUS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {STATUS_OPTIONS.map((opt) => (
                        <button
                            key={opt.key}
                            onClick={() => onStatusChange(opt.key)}
                            style={{
                                padding: '10px 8px',
                                borderRadius: 10,
                                background: task.status === opt.key ? `${opt.color}20` : 'var(--surface)',
                                border: `1px solid ${task.status === opt.key ? opt.color : 'var(--border)'}`,
                                color: task.status === opt.key ? opt.color : 'var(--text2)',
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                            }}
                        >
                            {opt.icon} {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mini Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
                <MiniStat label="Due" value={task.due_date || '—'} />
                <MiniStat label="Priority" value={PRIORITY_LABELS[task.priority] || task.priority} />
                <MiniStat label="Source" value={task.source === 'voice' ? '🎙️ Voice' : '✏️ Manual'} />
            </div>

            {/* Complete Button */}
            {task.status !== 'done' && (
                <button
                    onClick={onComplete}
                    style={{
                        width: '100%',
                        padding: 14,
                        borderRadius: 12,
                        background: '#10B981',
                        border: 'none',
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: 'pointer',
                    }}
                    className="font-display"
                >
                    ✓ Mark Complete
                </button>
            )}
        </div>
    );
}

function MiniStat({ label, value }: { label: string; value: string }) {
    return (
        <div
            style={{
                background: 'var(--surface)',
                borderRadius: 10,
                padding: 12,
                border: '1px solid var(--border)',
                textAlign: 'center',
            }}
        >
            <div className="font-mono" style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '0.06em', marginBottom: 4 }}>
                {label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>{value}</div>
        </div>
    );
}
