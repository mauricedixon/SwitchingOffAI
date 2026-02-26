'use client';

import { useAppStore } from '@/store/appStore';
import StatusBar from './StatusBar';
import BottomNav from './BottomNav';
import HomeTab from '@/components/tabs/HomeTab';
import TodayTab from '@/components/tabs/TodayTab';
import CRMTab from '@/components/tabs/CRMTab';
import PipelineTab from '@/components/tabs/PipelineTab';
import ChillMode from '@/components/tabs/ChillMode';
import VoicePanel from '@/components/voice/VoicePanel';
import PermissionToStop from '@/components/ui/PermissionToStop';

export default function AppShell() {
    const mode = useAppStore((s) => s.mode);
    const activeTab = useAppStore((s) => s.activeTab);
    const transitionMode = useAppStore((s) => s.transitionMode);

    const renderTab = () => {
        switch (activeTab) {
            case 'home': return <HomeTab />;
            case 'today': return <TodayTab />;
            case 'crm': return <CRMTab />;
            case 'pipeline': return <PipelineTab />;
            default: return <HomeTab />;
        }
    };

    return (
        <div
            data-mode={mode}
            style={{
                minHeight: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg)',
            }}
        >
            <StatusBar />

            {/* Main Content */}
            <main
                className="scrollbar-hide"
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '0 20px 24px',
                }}
            >
                {mode === 'chill' ? <ChillMode /> : renderTab()}
            </main>

            {/* Bottom Nav */}
            {mode === 'chill' ? (
                <div
                    className="safe-bottom"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '12px 20px',
                        background: 'var(--nav-bg)',
                        borderTop: '1px solid var(--border)',
                    }}
                >
                    <button
                        onClick={() => transitionMode('work')}
                        style={{
                            padding: '8px 24px',
                            borderRadius: 100,
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            color: 'var(--text2)',
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        🌙 Chill Mode Active
                    </button>
                </div>
            ) : (
                <BottomNav />
            )}

            {/* Overlays */}
            <VoicePanel />
            <PermissionToStop />
        </div>
    );
}
