'use client';

import type { Contact, ContactNote } from '@/types';
import { useAppStore } from '@/store/appStore';

export default function ContactDetail({
    contact,
    notes,
    dealCount,
    onBack,
}: {
    contact: Contact;
    notes: ContactNote[];
    dealCount: number;
    onBack: () => void;
}) {
    const showNotificationMsg = useAppStore((s) => s.showNotificationMsg);

    const daysAgo = contact.last_contact_at
        ? Math.floor((Date.now() - new Date(contact.last_contact_at).getTime()) / 86400000)
        : 0;

    const initials = contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 80,
                background: 'var(--bg)',
                overflowY: 'auto',
                animation: 'slideRight 0.3s ease',
                padding: '0 20px 40px',
            }}
        >
            {/* Back Button */}
            <button
                onClick={onBack}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '16px 0',
                }}
            >
                ← Back
            </button>

            {/* Avatar + Name */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: contact.color,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        fontWeight: 700,
                        color: '#fff',
                        marginBottom: 12,
                    }}
                >
                    {initials}
                </div>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>
                    {contact.name}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>
                    {contact.role} · {contact.company}
                </div>
            </div>

            {/* AI Summary */}
            {contact.ai_summary && (
                <div
                    style={{
                        background: 'var(--surface)',
                        borderRadius: 14,
                        padding: 16,
                        marginBottom: 16,
                        borderLeft: '3px solid var(--accent)',
                        border: '1px solid var(--border)',
                        borderLeftWidth: 3,
                        borderLeftColor: 'var(--accent)',
                    }}
                >
                    <div className="font-mono" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 8 }}>
                        🤖 AI SUMMARY
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
                        {contact.ai_summary}
                    </div>
                </div>
            )}

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
                <div
                    style={{
                        background: 'var(--surface)',
                        borderRadius: 10,
                        padding: 12,
                        border: '1px solid var(--border)',
                        textAlign: 'center',
                    }}
                >
                    <div className="font-mono" style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 4 }}>
                        LAST CONTACT
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{daysAgo}d</div>
                </div>
                <div
                    style={{
                        background: 'var(--surface)',
                        borderRadius: 10,
                        padding: 12,
                        border: '1px solid var(--border)',
                        textAlign: 'center',
                    }}
                >
                    <div className="font-mono" style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 4 }}>
                        CADENCE
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{contact.cadence_days}d</div>
                </div>
                <div
                    style={{
                        background: 'var(--surface)',
                        borderRadius: 10,
                        padding: 12,
                        border: '1px solid var(--border)',
                        textAlign: 'center',
                    }}
                >
                    <div className="font-mono" style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 4 }}>
                        DEALS
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{dealCount}</div>
                </div>
            </div>

            {/* Recent Notes */}
            <div style={{ marginBottom: 20 }}>
                <div className="font-mono" style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em', marginBottom: 10 }}>
                    RECENT NOTES
                </div>
                {notes.length > 0 ? (
                    notes.slice(0, 3).map((note) => (
                        <div
                            key={note.id}
                            style={{
                                background: 'var(--surface)',
                                borderRadius: 10,
                                padding: 12,
                                border: '1px solid var(--border)',
                                marginBottom: 8,
                            }}
                        >
                            <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{note.body}</div>
                            <div className="font-mono" style={{ fontSize: 10, color: 'var(--text3)', marginTop: 6 }}>
                                {note.source === 'voice' ? '🎙️' : '✏️'} {new Date(note.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                ) : (
                    <div
                        style={{
                            background: 'var(--surface)',
                            borderRadius: 10,
                            padding: 16,
                            border: '1px solid var(--border)',
                            textAlign: 'center',
                            color: 'var(--text3)',
                            fontSize: 13,
                        }}
                    >
                        No notes yet
                    </div>
                )}
            </div>

            {/* Add Note Button */}
            <button
                onClick={() => showNotificationMsg('Note added via voice — hold mic button')}
                style={{
                    width: '100%',
                    padding: 14,
                    borderRadius: 12,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--accent)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                }}
            >
                🎙️ Add Note via Voice
            </button>
        </div>
    );
}
