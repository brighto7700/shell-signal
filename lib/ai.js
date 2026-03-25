import { supabase } from "./supabase";

export async function summarizeWithAI(input, url = null) {
  // 1. Handle Daily Brief (Array of stories)
  if (Array.isArray(input)) {
    const briefContext = input.slice(0, 5).map(s => `- ${s.title}`).join('\n');
    
    const userPrompt = `Read the NEWS below. Write a 3-bullet summary of the trends, then write one useful bash command. NO conversational text.

<NEWS>
${briefContext}
</NEWS>

You MUST output exactly this format:
- [Write summary bullet 1 here]
- [Write summary bullet 2 here]
- [Write summary bullet 3 here]

**💻 Daily Snippet**
\`\`\`bash
# [Short comment]
[Bash command]
\`\`\`

---
*Originally published on [Shell Signal](https://shellsignal.brgt.site)*`;

    return await callOpenRouter(
      "You are a strict data processor. Output exactly the requested markdown format.",
      userPrompt
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
    "You are ShellSignal AI.",
    `Write EXACTLY 3 technical, witty bullet points (under 15 words each) summarizing this title: ${title}. NO introductory text.`
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
        "HTTP-Referer": "https://shellsignal.brgt.site", 
        "X-Title": "ShellSignal", 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",        
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
