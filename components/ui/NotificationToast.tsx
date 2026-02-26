'use client';

import { useAppStore } from '@/store/appStore';

export default function NotificationToast() {
    const notification = useAppStore((s) => s.notification);

    if (!notification) return null;

    const bgColors: Record<string, string> = {
        success: '#10B981',
        error: '#EF4444',
        info: '#3B82F6',
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 80,
                left: 20,
                right: 20,
                zIndex: 300,
                padding: '12px 16px',
                borderRadius: 12,
                background: bgColors[notification.type] || '#10B981',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                textAlign: 'center',
                animation: 'slideDown 0.3s ease',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
        >
            {notification.message}
        </div>
    );
}
