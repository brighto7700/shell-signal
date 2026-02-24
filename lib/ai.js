import { supabase } from "./supabase";

export async function summarizeWithAI(title, url) {
  // 1. STORY SHIELD: Always check Supabase first to protect your rate limits
  const { data: existing } = await supabase
    .from("stories")
    .select("summary")
    .eq("url", url)
    .single();

  if (existing?.summary) return existing.summary;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://shellsignal.vercel.app", // Required by OpenRouter
        "X-Title": "ShellSignal", 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Routes to the best free model (Grok-4, Llama-4, etc.)
        model: "openrouter/auto:free", 
        messages: [
          { role: "system", content: "You are ShellSignal AI. Give me 3 technical, witty bullet points (under 15 words each) for this dev news." },
          { role: "user", content: title }
        ],
      }),
    });

    const data = await res.json();
    const summary = data.choices?.[0]?.message?.content || null;

    // 2. SAVE the result so you never have to call the AI for this story again
    if (summary) {
      await supabase.from("stories").upsert({ url, title, summary });
    }

    return summary;
  } catch (error) {
    console.error("SHELLSIGNAL AI ERROR:", error.message);
    return null;
  }
}
