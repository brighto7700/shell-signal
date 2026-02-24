import { supabase } from "./supabase";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * Checks if a brief already exists for a specific date.
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

/**
 * Summarizes a single story with a database-first check.
 */
export async function summarizeStory(title, url) {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI ERROR: API Key missing.");
    return null;
  }

  // 1. STORY SHIELD: Check if this story was already summarized
  const { data: existingStory } = await supabase
    .from("stories")
    .select("summary")
    .eq("url", url)
    .single();

  if (existingStory?.summary) {
    console.log(`[STORY SHIELD]: Skipping Gemini for "${title}".`);
    return existingStory.summary;
  }

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

    if (res.status === 429) {
      console.warn(`GEMINI 429: Rate limited on story "${title}".`);
      return null;
    }

    const data = await res.json();
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    // 2. SAVE the summary to Supabase for future deployments
    if (summary) {
      await supabase.from("stories").upsert({
        url: url,
        title: title,
        summary: summary,
        updated_at: new Date().toISOString()
      });
    }

    return summary;
  } catch (error) {
    console.error(`GEMINI FETCH FAILED: ${error.message}`);
    return null;
  }
}

/**
 * Generates the daily executive brief with a database-first check.
 */
export async function generateDailyBrief(stories, date = new Date().toISOString().split('T')[0]) {
  if (!process.env.GEMINI_API_KEY) return null;

  // 1. BRIEF SHIELD: Prevent re-generating today's brief
  const existing = await getExistingBrief(date);
  if (existing && existing.summary) {
    console.log(`[BRIEF SHIELD]: Brief for ${date} found. Skipping Gemini.`);
    return existing.summary;
  }

  console.log(`[BRIEF SHIELD]: Generating new brief for ${date}...`);

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

    if (!res.ok) {
      const errorData = await res.json();
      console.error(`GEMINI API ERROR (${res.status}):`, JSON.stringify(errorData));
      return null;
    }

    const data = await res.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (result) {
      console.log(`[BRIEF SHIELD]: Saving generated brief for ${date}.`);
      await supabase.from("daily_briefs").upsert({
        date: date,
        summary: result,
        updated_at: new Date().toISOString(),
      });
    }

    return result;
  } catch (error) {
    console.error("[BRIEF SHIELD CRASH]:", error.message);
    return null;
  }
    }
