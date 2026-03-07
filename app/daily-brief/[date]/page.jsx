export const dynamic = 'force-dynamic';
export const revalidate = 0; 

import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

// 1. Upgraded Metadata for Article rich results on brgt.site
export async function generateMetadata({ params }) {
  const { date } = await params;
  
  return {
    title: `Dev Brief ${date} — ShellSignal`,
    description: `Top developer stories and AI summary for ${date}. Built for engineers by Bright Emmanuel.`,
    metadataBase: new URL('https://shellsignal.brgt.site'), // 🔥 DOMAIN UPDATED
    authors: [{ name: "Bright Emmanuel", url: "https://brgt.site" }], // 🔥 UPDATED
    openGraph: {
      title: `ShellSignal — ${date}`,
      description: `Daily executive summary for developers.`,
      url: `https://shellsignal.brgt.site/daily-brief/${date}`, // 🔥 UPDATED
      type: "article",
      publishedTime: `${date}T08:00:00+01:00`,
      authors: ["Bright Emmanuel"],
      images: [`/daily-brief/${date}/opengraph-image`], 
    },
    twitter: {
      card: "summary_large_image",
      title: `ShellSignal Dev Brief | ${date}`,
      description: `Daily executive summary for developers.`,
      images: [`https://shellsignal.brgt.site/og-main.png`], // 🔥 UPDATED
    },
  };
}

export default async function DailyBriefPage({ params }) {
  const { date } = await params;

  const { data: brief } = await supabase
    .from("daily_briefs")
    .select("*")
    .eq("date", date)
    .single();

  if (!brief) notFound();

  const stories = brief.top_stories || [];

  // Create a strict ISO datetime string (8:00 AM WAT)
  const isoDate = `${date}T08:00:00+01:00`;

  // 2. The Heavyweight E-E-A-T Schema (Now pointing to brgt.site)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": `ShellSignal Dev Brief: ${date}`,
    "image": [
      "https://shellsignal.brgt.site/og-main.png" // 🔥 UPDATED
    ],
    "datePublished": isoDate, 
    "dateModified": isoDate,  
    "url": `https://shellsignal.brgt.site/daily-brief/${date}`, // 🔥 UPDATED
    "description": `Top developer stories and AI summary for ${date}.`,
    "author": {
      "@type": "Person",
      "name": "Bright Emmanuel",
      "url": "https://brgt.site", // 🔥 UPDATED
      "sameAs": [
        "https://github.com/brighto7700",
        "https://x.com/brighto7700",
        "https://www.linkedin.com/in/brighto7700",
        "https://dev.to/brighto7700",
        "https://www.sitepoint.com/author/bright-emmanuel"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "ShellSignal",
      "logo": {
        "@type": "ImageObject",
        "url": "https://shellsignal.brgt.site/og-main.png" // 🔥 UPDATED
      }
    }
  };

  return (
    <>
      {/* 3. Inject the JSON-LD silently into the DOM */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="main">
        <div style={{ marginBottom: "2rem" }}>
          <p className="section-heading">DAILY DEV BRIEF</p>
          <div style={{ fontFamily: "var(--mono)", color: "var(--amber)", fontSize: "0.8rem", marginBottom: "1rem" }}>
            {date}
          </div>
          {brief.summary && (
            <div style={{ 
              background: "var(--bg2)", 
              border: "1px solid var(--border)", 
              borderLeft: "3px solid var(--green)", 
              padding: "1.25rem", 
              borderRadius: "3px", 
              lineHeight: 1.8 
            }}>
              <ReactMarkdown
                components={{
                  strong: ({node, ...props}) => <span style={{ color: "var(--green)", fontWeight: "bold" }} {...props} />,
                  p: ({node, ...props}) => <p style={{ marginBottom: "1rem" }} {...props} />,
                  ul: ({node, ...props}) => <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem", listStyleType: "square" }} {...props} />,
                  li: ({node, ...props}) => <li style={{ marginBottom: "0.5rem" }} {...props} />,
                  pre: ({node, ...props}) => <pre style={{ overflowX: "auto", background: "#0a0a0a", padding: "1rem", borderRadius: "4px", marginTop: "1rem", border: "1px solid var(--border)" }} {...props} />,
                  code: ({node, ...props}) => <code style={{ fontFamily: "var(--mono)", color: "var(--amber)", fontSize: "0.85rem" }} {...props} />
                }}
              >
                {brief.summary}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <p className="section-heading">TOP STORIES THAT DAY</p>
        <div className="stories-list">
          {stories.map((story, i) => (
            <div key={story.id || i} style={{ padding: "1rem 0", borderBottom: "1px solid var(--border)" }}>
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--text-bright)", textDecoration: "none", fontWeight: 600 }}
              >
                {story.title}
              </a>
              {story.github && (
                <div className="dev-health" style={{ marginTop: 8 }}>
                  <span className="health-label">DEV HEALTH</span>
                  <span>★ {story.github.stars?.toLocaleString()}</span>
                  <span>! {story.github.openIssues} issues</span>
                  <span>⏱ {story.github.lastCommit}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
