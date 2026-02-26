'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import ContactDetail from '@/components/ui/ContactDetail';
import type { Contact } from '@/types';

export default function CRMTab() {
    const contacts = useAppStore((s) => s.contacts);
    const contactNotes = useAppStore((s) => s.contactNotes);
    const deals = useAppStore((s) => s.deals);

    const [search, setSearch] = useState('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    const now = Date.now();
    const getContactDaysAgo = (contact: Contact) => {
        if (!contact.last_contact_at) return 999;
        return Math.floor((now - new Date(contact.last_contact_at).getTime()) / 86400000);
    };

    const overdueContacts = contacts.filter((c) => {
        const daysAgo = getContactDaysAgo(c);
        return daysAgo > c.cadence_days;
    });

    const followUpsDue = overdueContacts.length;

    const filtered = contacts.filter((c) => {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) || (c.company || '').toLowerCase().includes(q);
    });

    if (selectedContact) {
        return (
            <ContactDetail
                contact={selectedContact}
                notes={contactNotes.filter((n) => n.contact_id === selectedContact.id)}
                dealCount={deals.filter((d) => d.primary_contact_id === selectedContact.id).length}
                onBack={() => setSelectedContact(null)}
            />
        );
    }

    return (
        <div style={{ paddingTop: 16, animation: 'fadeIn 0.3s ease' }}>
            {/* Header */}
            <div style={{ marginBottom: 16 }}>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                    Relationships
                </div>
                <div style={{ fontSize: 13, color: 'var(--text3)' }}>
                    {contacts.length} contacts · {followUpsDue} follow-ups due
                </div>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text1)',
                    fontSize: 13,
                    outline: 'none',
                    marginBottom: 16,
                }}
            />

            {/* Overdue Follow-ups */}
            {overdueContacts.length > 0 && (
                <div
                    style={{
                        background: 'var(--surface)',
                        borderRadius: 14,
                        padding: 16,
                        marginBottom: 16,
                        borderLeft: '3px solid var(--gold)',
                        border: '1px solid var(--border)',
                        borderLeftWidth: 3,
                        borderLeftColor: 'var(--gold)',
                    }}
                >
                    <div className="font-mono" style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: 10 }}>
                        ⏰ FOLLOW-UPS OVERDUE
                    </div>
                    {overdueContacts.map((c) => {
                        const daysAgo = getContactDaysAgo(c);
                        return (
                            <div
                                key={c.id}
                                onClick={() => setSelectedContact(c)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: '8px 0',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid var(--border)',
                                }}
                            >
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        background: c.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: '#fff',
                                        flexShrink: 0,
                                    }}
                                >
                                    {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>{c.name}</div>
                                </div>
                                <span style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 600 }}>{daysAgo}d ago</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Contact List */}
            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)' }}>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No contacts yet</div>
                    <div style={{ fontSize: 13 }}>Say: &quot;Add John Smith, CEO at Acme&quot;</div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {filtered.map((contact) => {
                        const daysAgo = getContactDaysAgo(contact);
                        const isOverdue = daysAgo > contact.cadence_days;
                        const stageColors: Record<string, string> = {
                            cold: '#6B7280', warm: '#F59E0B', active: '#10B981', partner: '#6C63FF', inactive: '#EF4444',
                        };

                        return (
                            <div
                                key={contact.id}
                                onClick={() => setSelectedContact(contact)}
                                style={{
                                    background: 'var(--surface)',
                                    borderRadius: 12,
                                    padding: 14,
                                    border: '1px solid var(--border)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                }}
                            >
                                {/* Avatar */}
                                <div
                                    style={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: '50%',
                                        background: contact.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: '#fff',
                                        flexShrink: 0,
                                    }}
                                >
                                    {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="font-display" style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
                                        {contact.name}
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                                        {contact.role} · {contact.company}
                                    </div>
                                    {contact.tags.length > 0 && (
                                        <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                                            {contact.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    style={{
                                                        padding: '1px 8px',
                                                        borderRadius: 100,
                                                        background: 'var(--bg3)',
                                                        fontSize: 9,
                                                        color: 'var(--text3)',
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Right */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                                    <span
                                        className="font-mono"
                                        style={{
                                            fontSize: 11,
                                            color: isOverdue ? 'var(--danger)' : 'var(--text3)',
                                            fontWeight: isOverdue ? 600 : 400,
                                        }}
                                    >
                                        {daysAgo}d
                                    </span>
                                    <div
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            background: stageColors[contact.stage] || '#6B7280',
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
