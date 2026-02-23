import { getTopStories } from "@/lib/hackernews";
import { enrichWithGitHub } from "@/lib/github";
import { supabaseAdmin } from "@/lib/supabase";

export const revalidate = 300; // cache for 5 minutes

export async function GET() {
  try {
    // 1. Fetch top HN stories
    const stories = await getTopStories(30);

    // 2. Enrich GitHub repos (only first 15 to stay within rate limits)
    const enriched = await enrichWithGitHub(stories.slice(0, 15));
    const final = [...enriched, ...stories.slice(15)];

    // 3. Cache in Supabase (fire and forget)
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
