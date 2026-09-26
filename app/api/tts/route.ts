import { NextRequest, NextResponse } from "next/server";

// ElevenLabs multilingual v2 model — best Arabic quality
const ELEVENLABS_MODEL = "eleven_multilingual_v2";
// "Rachel" voice — clear, neutral, works well for Arabic
const ELEVENLABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get("text");
  if (!text) {
    return NextResponse.json({ error: "text required" }, { status: 400 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    // Fall back to a 204 so the frontend degrades to browser TTS
    return new NextResponse(null, { status: 204 });
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: ELEVENLABS_MODEL,
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );

    if (!res.ok) {
      return new NextResponse(null, { status: 204 });
    }

    const audio = await res.arrayBuffer();
    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400", // cache 24h — same text = same audio
      },
    });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
