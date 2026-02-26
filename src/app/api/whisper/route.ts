import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Send the audio file to Whisper API for transcription
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });

    const transcriptText = transcription.text;
    console.log("Transcript:", transcriptText);

    // 2. Use GPT-4o-mini to parse the transcript and figure out the intent/action
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are the AI assistant for 'SwitchingOff AI', a CRM and task management tool.
Your goal is to understand the user's voice command, respond conversationally but concisely, and identify if any specific action needs to be taken on the frontend.

Respond with a JSON object in the following format:
{
  "resp": "The conversational response you would say back to the user",
  "fx": "The function to trigger on the frontend, if any. Leave null if no action. Allowed values: 'moveAcme', 'endDay', 'createTask', 'updateDeal', 'logNote', null",
  "data": { // optional data object depending on fx
    // for createTask: title, priority, due
    // for updateDeal: dealId, stage, status
  }
}

Context about deals:
- 'd1': Acme Corp
- 'd2': Bluprint
- 'd3': Nexus Tech
- 'd4': Summit Media
- 'd5': Meridian Capital

Example commands:
- "Move Acme deal to Negotiation" -> {"resp": "Done — Acme moved to Negotiation stage.", "fx": "moveAcme"}
- "I'm done for today" -> {"resp": "Initiating your end-of-day handoff...", "fx": "endDay"}
- "What's my morning briefing" -> {"resp": "Good morning. 3 priorities today...", "fx": null}
`,
        },
        {
          role: "user",
          content: transcriptText,
        },
      ],
    });

    const aiResult = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json({
      text: transcriptText,
      resp: aiResult.resp || "I didn't quite catch that.",
      fx: aiResult.fx || null,
      data: aiResult.data || null,
    });
  } catch (error: any) {
    console.error("Error processing voice command:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
