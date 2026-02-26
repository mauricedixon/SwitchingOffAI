import { NextRequest, NextResponse } from 'next/server';
import { parseIntent, generateVoiceResponse, textToSpeech } from '@/lib/ai';

export async function POST(req: NextRequest) {
    try {
        const { transcript, appState } = await req.json();

        // Parse intent from transcript
        const intent = await parseIntent(transcript);

        // Generate a conversational response
        const response = await generateVoiceResponse(
            transcript,
            appState || { tasks: [], deals: [], contacts: [] }
        );

        // Try TTS (non-blocking failure)
        let audioBase64: string | null = null;
        try {
            const audioBuffer = await textToSpeech(response);
            audioBase64 = audioBuffer.toString('base64');
        } catch (e) {
            console.warn('TTS failed, skipping audio:', e);
        }

        // Try Supabase log (non-blocking)
        try {
            const { supabase } = await import('@/lib/supabase');
            await supabase.from('voice_captures').insert({
                transcript,
                parsed_intent: intent,
                routing_result: intent.routing_destination,
            });
        } catch {
            // Silent fail for logging
        }

        return NextResponse.json({ intent, response, audioBase64 });
    } catch (error) {
        console.error('Voice process error:', error);
        return NextResponse.json(
            { error: 'Processing failed' },
            { status: 500 }
        );
    }
}
