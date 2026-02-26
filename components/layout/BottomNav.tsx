'use client';

import { useAppStore } from '@/store/appStore';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

const NAV_ITEMS: { key: 'home' | 'today' | 'crm' | 'pipeline'; icon: string; label: string }[] = [
    { key: 'home', icon: '🏠', label: 'Home' },
    { key: 'today', icon: '✅', label: 'Today' },
    { key: 'crm', icon: '👥', label: 'CRM' },
    { key: 'pipeline', icon: '📊', label: 'Pipeline' },
];

export default function BottomNav() {
    const activeTab = useAppStore((s) => s.activeTab);
    const setActiveTab = useAppStore((s) => s.setActiveTab);
    const isRecording = useAppStore((s) => s.isRecording);
    const { startRecording, stopRecording } = useVoiceRecording();

    return (
        <div
            className="safe-bottom"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '8px 8px 6px',
                background: 'var(--nav-bg)',
                borderTop: '1px solid var(--border)',
                position: 'relative',
            }}
        >
            {NAV_ITEMS.slice(0, 2).map((item) => (
                <NavItem
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    active={activeTab === item.key}
                    onClick={() => setActiveTab(item.key)}
                />
            ))}

            {/* Center Voice Button */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: 70 }}>
                <button
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    style={{
                        position: 'absolute',
                        top: -22,
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: isRecording ? '#EF4444' : 'var(--accent)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        boxShadow: isRecording
                            ? '0 4px 20px rgba(239, 68, 68, 0.5)'
                            : '0 4px 20px var(--mode-glow)',
                        animation: isRecording ? 'orbPulse 1s ease-in-out infinite' : 'none',
                    }}
                >
                    🎙️
                </button>
            </div>

            {NAV_ITEMS.slice(2).map((item) => (
                <NavItem
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    active={activeTab === item.key}
                    onClick={() => setActiveTab(item.key)}
                />
            ))}
        </div>
    );
}

function NavItem({
    icon,
    label,
    active,
    onClick,
}: {
    icon: string;
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 12px',
                transform: active ? 'translateY(-2px)' : 'none',
                transition: 'transform 0.15s ease',
            }}
        >
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span
                className="font-mono"
                style={{
                    fontSize: 9,
                    fontWeight: 500,
                    color: active ? 'var(--accent)' : 'var(--text3)',
                    letterSpacing: '0.04em',
                }}
            >
                {label}
            </span>
        </button>
    );
}
