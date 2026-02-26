import { NextRequest, NextResponse } from 'next/server';
import { generateMorningBriefing, generateHandoffSummary } from '@/lib/ai';

export async function POST(req: NextRequest) {
    try {
        const { type, context } = await req.json();

        if (type === 'morning') {
            const briefing = await generateMorningBriefing(context);
            return NextResponse.json({ briefing });
        }

        if (type === 'handoff') {
            const summary = await generateHandoffSummary(
                context?.tasks || [],
                context?.deals || [],
                context?.reminders || []
            );
            return NextResponse.json({ summary });
        }

        return NextResponse.json(
            { error: 'Invalid briefing type. Use "morning" or "handoff".' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Briefing error:', error);
        return NextResponse.json(
            { error: 'Briefing generation failed' },
            { status: 500 }
        );
    }
}
