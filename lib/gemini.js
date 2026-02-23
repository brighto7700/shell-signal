const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function summarizeStory(title, url) {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI API ERROR: Missing API Key in environment variables.");
    return null;
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

    const data = await res.json();

    // 🚨 DEBUG LOGGING: Catches rate limits (429), bad keys (403), etc.
    if (!res.ok || !data.candidates) {
      console.error(
        "GEMINI API ERROR (summarizeStory):",
        JSON.stringify(data, null, 2)
      );
      return null;
    }

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.error("GEMINI FETCH FAILED (summarizeStory):", error.message);
    return null;
  }
}

export async function generateDailyBrief(stories) {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI API ERROR: Missing API Key in environment variables.");
    return null;
  }

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

    // 🚨 DEBUG LOGGING: Catches rate limits (429), bad keys (403), etc.
    if (!res.ok || !data.candidates) {
      console.error(
        "GEMINI API ERROR (generateDailyBrief):",
        JSON.stringify(data, null, 2)
      );
      return null;
    }

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.error("GEMINI FETCH FAILED (generateDailyBrief):", error.message);
    return null;
  }
                }
