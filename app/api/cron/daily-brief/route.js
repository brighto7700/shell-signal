import { getTopStories } from "@/lib/hackernews";
import { enrichWithGitHub } from "@/lib/github";
import { generateDailyBrief } from "@/lib/gemini";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request) {
  // Verify this is a legitimate cron call
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split("T")[0];

    // Check if we already ran today
    const { data: existing } = await supabaseAdmin
      .from("daily_briefs")
      .select("id")
      .eq("date", today)
      .maybeSingle();

    if (existing) {
      return Response.json({ message: "Already generated for today" });
    }

    // Fetch and enrich stories
    const stories = await getTopStories(10);
    const enriched = await enrichWithGitHub(stories);

    // Generate AI summary
    const summary = await generateDailyBrief(enriched);

    // Save to Supabase
    await supabaseAdmin.from("daily_briefs").insert({
      date: today,
      summary,
      top_stories: enriched,
    });

    return Response.json({ success: true, date: today });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
