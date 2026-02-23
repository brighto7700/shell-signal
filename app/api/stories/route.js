import { getTopStories } from "@/lib/hackernews";
import { enrichWithGitHub } from "@/lib/github";
import { supabaseAdmin } from "@/lib/supabase";
import { summarizeStory } from "@/lib/gemini"; // 1. ADD THIS IMPORT

export const revalidate = 300;

export async function GET() {
  try {
    const stories = await getTopStories(30);
    const enriched = await enrichWithGitHub(stories.slice(0, 15));

    // 2. ADD GEMINI SUMMARIES (Limiting to top 5 to prevent Vercel timeouts)
    const withSummaries = await Promise.all(
      enriched.map(async (story, index) => {
        if (index < 5) {
          const summary = await summarizeStory(story.title, story.url);
          return { ...story, summary };
        }
        return story;
      })
    );

    // 3. Update the final array to use the summarized stories
    const final = [...withSummaries, ...stories.slice(15)];

    supabaseAdmin
      .from("cached_stories")
      .upsert(
        final.map((s) => ({
          id: s.id,
          title: s.title,
          url: s.url,
          score: s.score,
          by: s.by,
          time: s.time,
          descendants: s.descendants,
          hn_url: s.hnUrl,
          github: s.github || null,
          summary: s.summary || null, // Optional: save summary to Supabase!
        })),
        { onConflict: "id" }
      )
      .then(() => {})
      .catch(() => {});

    return Response.json({ stories: final, fetched: Date.now() });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
