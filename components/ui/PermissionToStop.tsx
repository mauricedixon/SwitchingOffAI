'use client';

import { useAppStore } from '@/store/appStore';

export default function PermissionToStop() {
    const showPermissionToStop = useAppStore((s) => s.showPermissionToStop);
    const setShowPermissionToStop = useAppStore((s) => s.setShowPermissionToStop);
    const transitionMode = useAppStore((s) => s.transitionMode);
    const handoffSummary = useAppStore((s) => s.handoffSummary);

    if (!showPermissionToStop) return null;

    const summaryItems =
        handoffSummary.length > 0
            ? handoffSummary
            : [
                'All tasks captured and prioritized for tomorrow',
                '2 follow-up reminders set for this week',
                'Pipeline notes logged — nothing lost',
                'Morning briefing ready for you',
            ];

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 150,
                background: 'rgba(6, 14, 24, 0.97)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                animation: 'fadeIn 0.5s ease',
            }}
        >
            {/* Moon */}
            <div style={{ fontSize: 60, marginBottom: 20 }}>🌙</div>

            {/* Title */}
            <div
                className="font-display"
                style={{ fontSize: 28, fontWeight: 700, color: '#10B981', marginBottom: 12, textAlign: 'center' }}
            >
                You&apos;re Done for Today.
            </div>

            {/* Subtitle */}
            <div
                style={{
                    fontSize: 14,
                    color: 'var(--text2)',
                    textAlign: 'center',
                    marginBottom: 24,
                    maxWidth: 300,
                    lineHeight: 1.5,
                }}
            >
                Here&apos;s everything that&apos;s safe and captured:
            </div>

            {/* Summary Card */}
            <div
                style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: 14,
                    padding: 16,
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    width: '100%',
                    maxWidth: 340,
                    marginBottom: 24,
                }}
            >
                {summaryItems.map((item, i) => (
                    <div
                        key={i}
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 10,
                            padding: '6px 0',
                        }}
                    >
                        <span style={{ color: '#10B981', fontWeight: 700, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 13, color: '#C8D8E8', lineHeight: 1.5 }}>{item}</span>
                    </div>
                ))}
            </div>

            {/* Closing */}
            <div
                className="font-display"
                style={{
                    fontSize: 14,
                    color: '#10B981',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    marginBottom: 28,
                    maxWidth: 300,
                }}
            >
                Everything is handled. You can fully rest now.
            </div>

            {/* I'm Off Button */}
            <button
                onClick={() => {
                    setShowPermissionToStop(false);
                    transitionMode('chill');
                }}
                className="font-display"
                style={{
                    width: '100%',
                    maxWidth: 340,
                    padding: 16,
                    borderRadius: 100,
                    background: '#10B981',
                    border: 'none',
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
                    marginBottom: 16,
                }}
            >
                I&apos;m Off 🌙
            </button>

            {/* Stay in work */}
            <button
                onClick={() => setShowPermissionToStop(false)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text3)',
                    fontSize: 13,
                    cursor: 'pointer',
                }}
            >
                Stay in work mode
            </button>
        </div>
    );
}
