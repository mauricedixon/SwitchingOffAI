'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

export default function ChillMode() {
    const transitionMode = useAppStore((s) => s.transitionMode);
    const isRecording = useAppStore((s) => s.isRecording);
    const { startRecording, stopRecording } = useVoiceRecording();

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

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100dvh - 140px)',
                textAlign: 'center',
                padding: '20px 0',
                animation: 'fadeIn 0.5s ease',
            }}
        >
            {/* Top Label */}
            <div
                className="font-mono"
                style={{
                    fontSize: 11,
                    color: 'var(--text3)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: 16,
                }}
            >
                You&apos;re off the clock
            </div>

            {/* Clock */}
            <div
                className="font-display"
                style={{
                    fontSize: 64,
                    fontWeight: 800,
                    color: 'var(--accent)',
                    marginBottom: 12,
                    lineHeight: 1,
                }}
            >
                {time}
            </div>

            {/* Heading */}
            <div
                className="font-display"
                style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}
            >
                Enjoy your evening.
            </div>

            {/* Soft Message */}
            <div
                style={{
                    fontSize: 14,
                    color: 'var(--text2)',
                    maxWidth: 280,
                    lineHeight: 1.7,
                    marginBottom: 32,
                }}
            >
                Everything is captured and safe. Your work brain can rest now.
            </div>

            {/* Ambient Orbs */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
                {['✨', '☕', '📖', '🎵'].map((emoji) => (
                    <div
                        key={emoji}
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                        }}
                    >
                        {emoji}
                    </div>
                ))}
            </div>

            {/* Emergency Capture */}
            <div style={{ width: '100%', maxWidth: 320 }}>
                <div
                    className="font-mono"
                    style={{
                        fontSize: 10,
                        color: 'var(--text3)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        marginBottom: 10,
                    }}
                >
                    Got a stray thought?
                </div>
                <button
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: 12,
                        background: 'var(--surface)',
                        border: '1px dashed var(--border)',
                        color: 'var(--text2)',
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                    }}
                >
                    {isRecording ? 'Release to capture...' : 'Hold to capture a quick thought'}
                </button>
            </div>

            {/* Back to Work */}
            <button
                onClick={() => transitionMode('work')}
                style={{
                    marginTop: 32,
                    background: 'none',
                    border: 'none',
                    color: 'var(--text3)',
                    fontSize: 13,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                }}
            >
                ⚡ Switch back to Work Mode
            </button>
        </div>
    );
}
