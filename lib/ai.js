import { supabase } from "./supabase";

export async function summarizeWithAI(input, url = null) {
  // 1. Handle Daily Brief (Array of stories)
  if (Array.isArray(input)) {
    const briefContext = input.slice(0, 5).map(s => `- ${s.title}`).join('\n');
    return await callOpenRouter(
      "You are ShellSignal, a ruthless, ultra-concise technical AI. First, output EXACTLY 3 bullet points summarizing the news using markdown. Second, add a section titled '### 💻 Daily Snippet' and provide one highly useful, copy-pasteable terminal command or bash script related to the news or general dev productivity. Use proper markdown code blocks. NO introductory text. NO conversational filler. NO conclusions.",
      `Process these top stories:\n${briefContext}`
    );
  }

  // 2. Handle Individual Story (Single title/url)
  const title = input;
  const { data: existing } = await supabase
    .from("stories")
    .select("summary")
    .eq("url", url)
    .single();

  if (existing?.summary) return existing.summary;

  const summary = await callOpenRouter(
    "You are ShellSignal AI. Output EXACTLY 3 technical, witty bullet points (under 15 words each). NO introductory text. NO conversational filler.",
    title
  );

  if (summary) {
    await supabase.from("stories").upsert({ url, title, summary });
  }

  return summary;
}

// Internal helper to keep code clean
async function callOpenRouter(systemPrompt, userPrompt) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://shellsignal.vercel.app",
        "X-Title": "ShellSignal", 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/auto:free", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error("AI ERROR:", error.message);
    return null;
  }
}
