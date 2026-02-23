import { supabase } from "@/lib/supabase";

export default async function sitemap() {
  const { data: briefs } = await supabase
    .from("daily_briefs")
    .select("date")
    .order("date", { ascending: false });

  const dynamicBriefs = briefs?.map((b) => ({
    url: `https://dev-signal.vercel.app/daily-brief/${b.date}`,
    lastModified: new Date(),
    changeFrequency: 'never',
    priority: 0.7,
  })) || [];

  return [
    {
      url: 'https://dev-signal.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...dynamicBriefs,
  ];
}
