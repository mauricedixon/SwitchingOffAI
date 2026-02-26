'use client';

import { useRef, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';

export function useVoiceRecording() {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    const setRecording = useAppStore((s) => s.setRecording);
    const setVoicePhase = useAppStore((s) => s.setVoicePhase);
    const setVoiceTranscript = useAppStore((s) => s.setVoiceTranscript);
    const setVoiceResponse = useAppStore((s) => s.setVoiceResponse);
    const setShowVoicePanel = useAppStore((s) => s.setShowVoicePanel);
    const resetVoice = useAppStore((s) => s.resetVoice);
    const addTask = useAppStore((s) => s.addTask);
    const addReminder = useAppStore((s) => s.addReminder);
    const setShowPermissionToStop = useAppStore((s) => s.setShowPermissionToStop);
    const showNotificationMsg = useAppStore((s) => s.showNotificationMsg);

    const startRecording = useCallback(async () => {
        try {
            chunksRef.current = [];
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = recorder;

            setRecording(true);
            setVoicePhase('recording');
            setShowVoicePanel(true);

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = async () => {
                // Stop media tracks
                streamRef.current?.getTracks().forEach((t) => t.stop());

                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                if (audioBlob.size === 0) {
                    resetVoice();
                    return;
                }

                try {
                    // Step 1: Transcribe
                    const formData = new FormData();
                    formData.append('audio', audioBlob, 'audio.webm');

                    const transcribeRes = await fetch('/api/voice/transcribe', {
                        method: 'POST',
                        body: formData,
                    });
                    const { transcript } = await transcribeRes.json();

                    if (!transcript) {
                        setVoicePhase('error');
                        return;
                    }

                    setVoiceTranscript(transcript);
                    setVoicePhase('processing');

                    // Step 2: Process intent
                    const tasks = useAppStore.getState().tasks;
                    const deals = useAppStore.getState().deals;
                    const contacts = useAppStore.getState().contacts;

                    const processRes = await fetch('/api/voice/process', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            transcript,
                            appState: { tasks, deals, contacts },
                        }),
                    });
                    const { intent, response, audioBase64 } = await processRes.json();

                    setVoiceResponse(response);
                    setVoicePhase('response');

                    // Route based on intent
                    if (intent?.routing_destination === 'tasks' && intent.extracted_data?.task_title) {
                        addTask({
                            id: crypto.randomUUID(),
                            title: intent.extracted_data.task_title,
                            status: 'not_started',
                            priority: intent.extracted_data.priority || 'P2',
                            due_date: intent.extracted_data.due_date,
                            source: 'voice',
                            raw_transcript: transcript,
                            created_at: new Date().toISOString(),
                        });
                        showNotificationMsg('Task created via voice');
                    }

                    if (intent?.routing_destination === 'reminders') {
                        addReminder({
                            id: crypto.randomUUID(),
                            title: intent.extracted_data?.task_title || transcript,
                            fire_at: intent.extracted_data?.reminder_time || new Date().toISOString(),
                            status: 'pending',
                            created_by: 'voice',
                        });
                        showNotificationMsg('Reminder set');
                    }

                    if (intent?.routing_destination === 'mode_controller') {
                        setTimeout(() => {
                            setShowPermissionToStop(true);
                            resetVoice();
                        }, 2000);
                    }

                    // Play TTS audio
                    if (audioBase64) {
                        const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
                        audio.play().catch(() => { }); // Silently handle autoplay restrictions
                    }
                } catch (err) {
                    console.error('Voice processing error:', err);
                    setVoicePhase('error');
                }
            };

            recorder.start(100);
        } catch (err) {
            console.error('Failed to start recording:', err);
            setVoicePhase('error');
        }
    }, [
        setRecording, setVoicePhase, setShowVoicePanel, setVoiceTranscript,
        setVoiceResponse, resetVoice, addTask, addReminder, setShowPermissionToStop,
        showNotificationMsg,
    ]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    }, [setRecording]);

    const cancelRecording = useCallback(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.onstop = null;
            mediaRecorderRef.current.stop();
        }
        streamRef.current?.getTracks().forEach((t) => t.stop());
        resetVoice();
    }, [resetVoice]);

    return { startRecording, stopRecording, cancelRecording };
}
