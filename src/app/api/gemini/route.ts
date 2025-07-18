import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { conversation } = await req.json();
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
  }

  // Convert chat history into Gemini-compatible format
  const contents = conversation.map((msg: { role: string; text: string }) => ({
    role: msg.role, // "user" or "model"
    parts: [{ text: msg.text }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents }),
    }
  );

  const data = await res.json();
  const reply =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I couldn't generate a response.";

  return NextResponse.json({ reply });
}
