import { supabase } from "./supabase"; // Ensure this path matches your supabase client

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Check if a brief already exists for a specific date to prevent rate limits
 */
async function getExistingBrief(date) {
  const { data, error } = await supabase
    .from("daily_briefs")
    .select("summary, content")
    .eq("date", date)
    .single();

  if (error || !data) return null;
  return data;
}

export async function summarizeStory(title, url) {
  if (!process.env.GEMINI_API_KEY) return null;

  const prompt = `You are a senior developer. In exactly 3 bullet points (each under 15 words), give the key dev takeaways from this article: "${title}". Be direct and technical. Format: just the 3 bullets, nothing else.`;

  try {
    const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 150, temperature: 0.3 },
      }),
    });

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

export async function generateDailyBrief(stories, date = new Date().toISOString().split('T')[0]) {
  if (!process.env.GEMINI_API_KEY) return null;

  // 1. SHIELD: Check Supabase FIRST
  const existing = await getExistingBrief(date);
  if (existing && existing.summary) {
    console.log(`[SEO Shield] Found existing brief for ${date}. Skipping Gemini.`);
    return existing.summary;
  }

  // 2. Only proceed to Gemini if database is empty
  const titles = stories
    .slice(0, 5)
    .map((s, i) => `${i + 1}. ${s.title}`)
    .join("\n");

  const prompt = `You are writing the "Daily Dev Brief" for senior developers. Based on these top 5 stories from today:\n\n${titles}\n\nWrite a sharp, 3-paragraph executive summary covering: what's trending, what it means for devs, and one thing to watch. Keep it under 200 words. No fluff.`;

  try {
    const res = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.5 },
      }),
    });

    const data = await res.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    // 3. SAVE to Supabase so future builds don't hit Gemini
    if (result) {
      await supabase.from("daily_briefs").upsert({
        date: date,
        summary: result,
        updated_at: new Date().toISOString(),
      });
    }

    return result;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}
