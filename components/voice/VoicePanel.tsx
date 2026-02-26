'use client';

import { useAppStore } from '@/store/appStore';

export default function VoicePanel() {
    const showVoicePanel = useAppStore((s) => s.showVoicePanel);
    const voicePhase = useAppStore((s) => s.voicePhase);
    const voiceTranscript = useAppStore((s) => s.voiceTranscript);
    const voiceResponse = useAppStore((s) => s.voiceResponse);
    const resetVoice = useAppStore((s) => s.resetVoice);

    if (!showVoicePanel) return null;

    const orbEmoji: Record<string, string> = {
        idle: '🎙️',
        recording: '🎙️',
        processing: '⚙️',
        response: '✓',
        error: '❌',
    };

    const phaseLabel: Record<string, string> = {
        idle: 'Hold mic button to speak',
        recording: 'Listening...',
        processing: 'Thinking...',
        response: 'Got it ✓',
        error: 'Try again',
    };

    const orbStyle: React.CSSProperties = {
        width: 100,
        height: 100,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 36,
        ...(voicePhase === 'recording'
            ? { background: 'var(--accent)', animation: 'orbPulse 1s ease-in-out infinite' }
            : voicePhase === 'processing'
                ? {
                    background: 'conic-gradient(from 0deg, var(--accent), transparent, var(--accent))',
                    animation: 'spin 1.5s linear infinite',
                }
                : voicePhase === 'response'
                    ? { background: '#10B981' }
                    : voicePhase === 'error'
                        ? { background: '#EF4444' }
                        : { background: 'var(--accent)' }),
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                background: 'rgba(6, 14, 24, 0.95)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
            }}
        >
            {/* Close */}
            <button
                onClick={resetVoice}
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 24,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#fff',
                    fontSize: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                ✕
            </button>

            {/* Orb */}
            <div style={orbStyle}>{orbEmoji[voicePhase]}</div>

            {/* Phase Label */}
            <div
                className="font-display"
                style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginTop: 20,
                    marginBottom: 24,
                }}
            >
                {phaseLabel[voicePhase]}
            </div>

            {/* Transcript */}
            {voiceTranscript && (
                <div
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 12,
                        padding: 16,
                        border: '1px solid rgba(255,255,255,0.1)',
                        maxWidth: 340,
                        width: '100%',
                        marginBottom: 16,
                    }}
                >
                    <div
                        style={{
                            fontSize: 14,
                            color: '#C8D8E8',
                            fontStyle: 'italic',
                            lineHeight: 1.6,
                            textAlign: 'center',
                        }}
                    >
                        &ldquo;{voiceTranscript}&rdquo;
                    </div>
                </div>
            )}

            {/* Response */}
            {voiceResponse && (
                <div
                    style={{
                        background: 'rgba(108,99,255,0.1)',
                        borderRadius: 12,
                        padding: 16,
                        border: '1px solid rgba(108,99,255,0.3)',
                        maxWidth: 340,
                        width: '100%',
                        marginBottom: 16,
                    }}
                >
                    <div className="font-mono" style={{ fontSize: 10, color: '#6C63FF', letterSpacing: '0.08em', marginBottom: 8 }}>
                        🤖 SWITCH
                    </div>
                    <div style={{ fontSize: 13, color: '#C8C4FF', lineHeight: 1.6 }}>
                        {voiceResponse}
                    </div>
                </div>
            )}

            {/* Bottom Hint */}
            {voicePhase === 'idle' && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 20 }}>
                    Try: &ldquo;What deals are stalling?&rdquo; or &ldquo;Log a note on Sarah&rdquo;
                </div>
            )}
        </div>
    );
}
