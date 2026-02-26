'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import TaskDetailSheet from '@/components/ui/TaskDetailSheet';
import type { Task, TaskStatus } from '@/types';

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; icon: string }> = {
    not_started: { label: 'Not Started', color: '#6B7280', icon: '○' },
    in_progress: { label: 'In Progress', color: '#F59E0B', icon: '◑' },
    waiting: { label: 'Waiting', color: '#3B82F6', icon: '⏸' },
    done: { label: 'Done', color: '#10B981', icon: '✓' },
    snoozed: { label: 'Snoozed', color: '#8B5CF6', icon: '⏰' },
    overdue: { label: 'Overdue', color: '#EF4444', icon: '!' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
    P0: { label: 'Fire', color: '#EF4444' },
    P1: { label: 'Today', color: '#F59E0B' },
    P2: { label: 'Week', color: '#6C63FF' },
    P3: { label: 'Later', color: '#6B7280' },
};

const FILTERS: { key: string; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'not_started', label: 'Not Started' },
    { key: 'done', label: 'Done' },
];

export default function TodayTab() {
    const tasks = useAppStore((s) => s.tasks);
    const completeTask = useAppStore((s) => s.completeTask);
    const updateTask = useAppStore((s) => s.updateTask);
    const contacts = useAppStore((s) => s.contacts);

    const [filter, setFilter] = useState('all');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const completedCount = tasks.filter((t) => t.status === 'done').length;
    const overdueCount = tasks.filter((t) => t.status === 'overdue').length;

    const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

    const getContactName = (contactId?: string) => {
        if (!contactId) return null;
        return contacts.find((c) => c.id === contactId)?.name;
    };

    return (
        <div style={{ paddingTop: 16, animation: 'fadeIn 0.3s ease' }}>
            {/* Header */}
            <div style={{ marginBottom: 16 }}>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                    Today&apos;s Hub
                </div>
                <div style={{ fontSize: 13, color: 'var(--text3)' }}>
                    {completedCount} completed · {overdueCount} overdue
                </div>
            </div>

            {/* Filter Chips */}
            <div className="scrollbar-hide" style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
                {FILTERS.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: 100,
                            background: filter === f.key ? 'var(--accent)' : 'var(--surface)',
                            border: `1px solid ${filter === f.key ? 'var(--accent)' : 'var(--border)'}`,
                            color: filter === f.key ? '#fff' : 'var(--text2)',
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Task List */}
            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No tasks here</div>
                    <div style={{ fontSize: 13 }}>Hold the mic to capture something</div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {filtered.map((task) => {
                        const statusCfg = STATUS_CONFIG[task.status];
                        const prioCfg = PRIORITY_CONFIG[task.priority];
                        const contactName = getContactName(task.crm_contact_id);
                        const isDone = task.status === 'done';

                        return (
                            <div
                                key={task.id}
                                onClick={() => setSelectedTask(task)}
                                style={{
                                    background: 'var(--surface)',
                                    borderRadius: 12,
                                    padding: 14,
                                    border: '1px solid var(--border)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 12,
                                    animation: 'fadeIn 0.3s ease',
                                }}
                            >
                                {/* Checkbox */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isDone) completeTask(task.id);
                                    }}
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: '50%',
                                        background: isDone ? '#10B981' : 'transparent',
                                        border: `2px solid ${isDone ? '#10B981' : 'var(--border2)'}`,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 12,
                                        color: '#fff',
                                        flexShrink: 0,
                                        marginTop: 2,
                                        animation: isDone ? 'completionPop 0.3s ease' : 'none',
                                    }}
                                >
                                    {isDone && '✓'}
                                </button>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 500,
                                            color: isDone ? 'var(--text3)' : 'var(--text1)',
                                            textDecoration: isDone ? 'line-through' : 'none',
                                            marginBottom: 6,
                                        }}
                                    >
                                        {task.title}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                                        {/* Status badge */}
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 4,
                                                padding: '2px 8px',
                                                borderRadius: 100,
                                                background: `${statusCfg.color}18`,
                                                fontSize: 10,
                                                fontWeight: 600,
                                                color: statusCfg.color,
                                            }}
                                        >
                                            {statusCfg.icon} {statusCfg.label}
                                        </span>
                                        {/* Priority badge */}
                                        <span
                                            style={{
                                                padding: '2px 8px',
                                                borderRadius: 100,
                                                background: `${prioCfg.color}18`,
                                                fontSize: 10,
                                                fontWeight: 600,
                                                color: prioCfg.color,
                                            }}
                                        >
                                            {prioCfg.label}
                                        </span>
                                        {/* Contact badge */}
                                        {contactName && (
                                            <span
                                                style={{
                                                    padding: '2px 8px',
                                                    borderRadius: 100,
                                                    background: 'var(--bg3)',
                                                    fontSize: 10,
                                                    color: 'var(--text3)',
                                                }}
                                            >
                                                {contactName}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Right side */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                                    {task.due_date && (
                                        <span
                                            className="font-mono"
                                            style={{
                                                fontSize: 10,
                                                color: task.status === 'overdue' ? 'var(--danger)' : 'var(--text3)',
                                            }}
                                        >
                                            {task.due_date}
                                        </span>
                                    )}
                                    <span style={{ fontSize: 12 }}>{task.source === 'voice' ? '🎙️' : '✏️'}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Task Detail Sheet */}
            {selectedTask && (
                <TaskDetailSheet
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onStatusChange={(status) => {
                        updateTask(selectedTask.id, { status });
                        setSelectedTask({ ...selectedTask, status });
                    }}
                    onComplete={() => {
                        completeTask(selectedTask.id);
                        setSelectedTask(null);
                    }}
                />
            )}
        </div>
    );
}
