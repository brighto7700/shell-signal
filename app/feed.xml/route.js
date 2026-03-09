import { supabase } from '@/lib/supabase';

// Cache the feed for 1 hour. RSS feeds don't need second-by-second 
// updates, and this protects your Supabase database from read spikes.
export const revalidate = 3600; 

export async function GET() {
  // 1. Fetch the latest 15 briefs
  const { data: briefs, error } = await supabase
    .from('daily_briefs')
    .select('date, summary')
    .order('date', { ascending: false })
    .limit(15);

  if (error) {
    return new Response('Error fetching feed data', { status: 500 });
  }

  const siteUrl = 'https://shellsignal.brgt.site';

  // 2. Map the data into valid RSS <item> nodes
  const rssItems = briefs.map((brief) => {
    // RSS requires a very specific date format (RFC-822)
    const pubDate = new Date(brief.date).toUTCString();
    
    return `
      <item>
        <title>Shell Signal // ${brief.date}</title>
        <link>${siteUrl}/daily-brief/${brief.date}</link>
        <guid isPermaLink="true">${siteUrl}/daily-brief/${brief.date}</guid>
        <pubDate>${pubDate}</pubDate>
        <description><![CDATA[${brief.summary}]]></description>
      </item>
    `;
  }).join('');

  // 3. Wrap everything in the master RSS 2.0 XML structure
  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Shell Signal</title>
        <link>${siteUrl}</link>
        <description>Real-time developer news, AI-curated briefs, and technical signals. Built for the next billion engineers.</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
        ${rssItems}
      </channel>
    </rss>`;

  // 4. Return as a pure XML file
  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
