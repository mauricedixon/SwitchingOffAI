'use client';

import { useAppStore } from '@/store/appStore';

export default function ModeOverlay() {
    const modeTransitioning = useAppStore((s) => s.modeTransitioning);

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999,
                pointerEvents: 'none',
                background: 'var(--accent)',
                opacity: modeTransitioning ? 1 : 0,
                transition: 'opacity 0.35s ease',
            }}
        />
    );
}
