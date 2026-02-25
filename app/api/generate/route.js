import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // SWITCH TO A PERMANENTLY FREE MODEL
        model: "google/gemini-2.0-flash-exp:free", 
        messages: [
          {
            role: "system",
            content: "Return ONLY raw bash code. No markdown. No explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        // DRASTICALLY LOWER TOKENS TO PREVENT THE 402 ERROR
        max_tokens: 200 
      })
    });

    const data = await response.json();

    if (response.status === 402) {
      return NextResponse.json({ error: "Insufficient OpenRouter Credits" }, { status: 402 });
    }

    let command = data.choices[0].message.content.trim();
    command = command.replace(/^```(bash|sh)?\n?/i, '').replace(/```$/i, '').trim();

    return NextResponse.json({ command });

  } catch (error) {
    return NextResponse.json({ error: "Execution failed" }, { status: 500 });
  }
}
