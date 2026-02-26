import OpenAI from 'openai';
import type { ParsedIntent } from '@/types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Transcribe audio using Whisper
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
    const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
    const result = await openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        language: 'en',
    });
    return result.text;
}

/**
 * Parse a voice transcript into a structured intent
 */
export async function parseIntent(transcript: string): Promise<ParsedIntent> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content: `You are an intent classifier for a personal command center. Classify voice transcripts into intents: TASK_CREATE | CRM_NOTE | CRM_CREATE | DEAL_UPDATE | STATUS_QUERY | REMINDER_SET | TASK_COMPLETE | MODE_TRIGGER | DAILY_QUERY | PIPELINE_QUERY | UNKNOWN. Priority: P0=urgent/fire, P1=today/EOD, P2=this week, P3=later. Return valid JSON matching the ParsedIntent schema. confidence is 0.0-1.0. If confidence<0.7 set routing_destination='clarify'.`,
            },
            { role: 'user', content: transcript },
        ],
    });

    return JSON.parse(response.choices[0].message.content || '{}') as ParsedIntent;
}

/**
 * Generate a conversational voice response
 */
export async function generateVoiceResponse(
    query: string,
    appState: { tasks: unknown[]; deals: unknown[]; contacts: unknown[] }
): Promise<string> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: `You are Switch, a sharp personal chief of staff. Answer in direct spoken language under 70 words unless a full briefing is requested. No markdown, no bullet points. Reference specific names and numbers from the app state.\n\nCurrent state:\n${JSON.stringify(appState)}`,
            },
            { role: 'user', content: query },
        ],
    });

    return response.choices[0].message.content || '';
}

/**
 * Convert text to speech via OpenAI TTS
 */
export async function textToSpeech(text: string): Promise<Buffer> {
    const response = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'nova',
        input: text,
        speed: 1.05,
    });
    return Buffer.from(await response.arrayBuffer());
}

/**
 * Generate a morning briefing summary
 */
export async function generateMorningBriefing(context: {
    tasks: unknown[];
    deals: unknown[];
    contacts_due_followup: unknown[];
}): Promise<string> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content:
                    'Generate a morning briefing for a high-performer. Under 80 words total. Format: one stats sentence, top 3 priorities as a clean list, one closing encouragement. No fluff.',
            },
            { role: 'user', content: JSON.stringify(context) },
        ],
    });

    return response.choices[0].message.content || '';
}

/**
 * Generate an end-of-day handoff summary (4 bullet points)
 */
export async function generateHandoffSummary(
    tasks: unknown[],
    deals: unknown[],
    reminders: unknown[]
): Promise<string[]> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
            {
                role: 'system',
                content:
                    'Generate exactly 4 short reassuring bullet points (each under 15 words) confirming work is captured for end of day. Return JSON: { summary: [string, string, string, string] }',
            },
            {
                role: 'user',
                content: JSON.stringify({ tasks, deals, reminders }),
            },
        ],
    });

    try {
        const parsed = JSON.parse(response.choices[0].message.content || '{}');
        return parsed.summary || [];
    } catch {
        return [
            'All tasks captured and prioritized for tomorrow',
            'Follow-up reminders set for this week',
            'Pipeline notes logged — nothing lost',
            'Morning briefing ready for you',
        ];
    }
}
