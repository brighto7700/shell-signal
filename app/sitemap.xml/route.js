import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic'; // Prevents static HTML caching

export async function GET() {
  const { data: briefs } = await supabase
    .from("daily_briefs")
    .select("date")
    .order("date", { ascending: false });

  const dynamicEntries = briefs?.map((b) => `
    <url>
      <loc>https://dev-signal.vercel.app/daily-brief/${b.date}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>`).join('') || '';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://dev-signal.vercel.app</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      ${dynamicEntries}
    </urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml", // Forces the XML header
      "Cache-Control": "no-store, max-age=0", // Ensures Google always sees fresh data
    },
  });
}
