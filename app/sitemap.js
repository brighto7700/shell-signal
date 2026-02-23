import { supabase } from "@/lib/supabase";

export default async function sitemap() {
  const baseUrl = "https://dev-signal.vercel.app";

  // 1. Fetch all brief dates from your Supabase archive
  const { data: briefs } = await supabase
    .from("daily_briefs")
    .select("date")
    .order("date", { ascending: false });

  // 2. Map them into the format Google expects
  const dynamicUrls = briefs?.map((brief) => ({
    url: `${baseUrl}/daily-brief/${brief.date}`,
    lastModified: new Date(brief.date),
    changeFrequency: "never", // Since it's an archive, it won't change after publication
    priority: 0.8,
  })) || [];

  // 3. Define your static routes
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly", // The homepage updates constantly
      priority: 1.0,
    },
    {
      url: `${baseUrl}/daily-brief`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // 4. Combine and return
  return [...staticUrls, ...dynamicUrls];
    }
