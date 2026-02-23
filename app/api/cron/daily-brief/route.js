import { getTopStories } from "@/lib/hackernews";
import { enrichWithGitHub } from "@/lib/github";
import { generateDailyBrief } from "@/lib/gemini";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request) {
  // 1. Verify this is a legitimate cron call
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error("Cron Auth Failed");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split("T")[0];
    console.log(`Starting cron job for: ${today}`);

    // 2. Safely check if we already ran today using maybeSingle()
    const { data: existing, error: checkError } = await supabaseAdmin
      .from("daily_briefs")
      .select("id")
      .eq("date", today)
      .maybeSingle(); 

    if (checkError) {
      console.error("Supabase Check Error:", checkError);
      throw checkError;
    }

    if (existing) {
      console.log("Brief already exists. Skipping.");
      return Response.json({ message: "Already generated for today" });
    }

    console.log("Fetching stories...");
    // 3. Fetch and enrich stories
    const stories = await getTopStories(10);
    const enriched = await enrichWithGitHub(stories);

    console.log("Generating AI summary...");
    // 4. Generate AI summary
    const summary = await generateDailyBrief(enriched);

    if (!summary) {
       throw new Error("Gemini returned a null summary.");
    }

    console.log("Saving to Supabase...");
    // 5. Save to Supabase
    const { error: insertError } = await supabaseAdmin
      .from("daily_briefs")
      .insert({
        date: today,
        summary,
        top_stories: enriched,
      });

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      throw insertError;
    }

    console.log("Success!");
    return Response.json({ success: true, date: today });
  } catch (err) {
    console.error("Cron Job Failed:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
                                                  }
