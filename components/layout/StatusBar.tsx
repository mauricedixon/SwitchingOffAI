'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';

export default function StatusBar() {
    const mode = useAppStore((s) => s.mode);
    const [time, setTime] = useState('');

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                })
            );
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    const modeConfig = {
        work: { label: 'Work', color: '#6C63FF', dotColor: '#6C63FF' },
        transition: { label: 'Transition', color: '#F59E0B', dotColor: '#F59E0B' },
        chill: { label: 'Chill', color: '#10B981', dotColor: '#10B981' },
    };

    const cfg = modeConfig[mode];

    return (
        <div
            className="safe-top"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 20px 6px',
                background: 'var(--bg)',
            }}
        >
            {/* Time */}
            <div
                className="font-mono"
                style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)' }}
            >
                {time}
            </div>

            {/* Mode Badge */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: `${cfg.color}18`,
                    border: `1px solid ${cfg.color}40`,
                }}
            >
                <div
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: cfg.dotColor,
                        animation: 'orbPulse 2s ease-in-out infinite',
                    }}
                />
                <span
                    className="font-mono"
                    style={{ fontSize: 10, fontWeight: 500, color: cfg.color, letterSpacing: '0.05em' }}
                >
                    {cfg.label}
                </span>
            </div>

            {/* Signal Indicators */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <div style={{ width: 3, height: 8, borderRadius: 1, background: 'var(--text3)' }} />
                <div style={{ width: 3, height: 11, borderRadius: 1, background: 'var(--text3)' }} />
                <div style={{ width: 3, height: 14, borderRadius: 1, background: 'var(--text2)' }} />
                <div style={{ width: 3, height: 17, borderRadius: 1, background: 'var(--text1)' }} />
            </div>
        </div>
    );
}
