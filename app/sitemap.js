// app/sitemap.js
import { supabase } from "@/lib/supabase";

export default async function sitemap() {
  // Fetch your dynamic brief dates from Supabase
  const { data: briefs } = await supabase
    .from("daily_briefs")
    .select("date")
    .order("date", { ascending: false });

  const dynamicEntries = briefs?.map((b) => ({
    url: `https://devterminal.vercel.app/daily-brief/${b.date}`,
    lastModified: new Date(),
    changeFrequency: 'never', // Briefs don't change once written
    priority: 0.7,
  })) || [];

  return [
    {
      url: 'https://devterminal.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'always', // Homepage changes constantly
      priority: 1,
    },
    ...dynamicEntries,
  ];
}
