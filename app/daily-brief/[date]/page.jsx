export const dynamic = 'force-dynamic'; // Tells Vercel: "Don't build this during deployment"

import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

// 1. Merged Metadata Function
export async function generateMetadata({ params }) {
  const { date } = await params;
  
  return {
    title: `Dev Brief ${date} — ShellSignal`,
    description: `Top developer stories and AI summary for ${date}. Built for engineers.`,
    openGraph: {
      title: `ShellSignal — ${date}`,
      description: `Daily executive summary for developers.`,
      images: [`/daily-brief/${date}/opengraph-image`], // Points to your dynamic OG generator
    },
  };
}

export default async function DailyBriefPage({ params }) {
  // 2. Handle params as async for Next.js 15 compatibility
  const { date } = await params;

  const { data: brief } = await supabase
    .from("daily_briefs")
    .select("*")
    .eq("date", date)
    .single();

  if (!brief) notFound();

  const stories = brief.top_stories || [];

  return (
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
            // Removed whiteSpace: "pre-wrap" because ReactMarkdown handles spacing
          }}>
            <ReactMarkdown
              components={{
                // Custom rendering to match your ShellSignal terminal theme
                strong: ({node, ...props}) => <span style={{ color: "var(--green)", fontWeight: "bold" }} {...props} />,
                p: ({node, ...props}) => <p style={{ marginBottom: "1rem" }} {...props} />,
                ul: ({node, ...props}) => <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem", listStyleType: "square" }} {...props} />,
                li: ({node, ...props}) => <li style={{ marginBottom: "0.5rem" }} {...props} />
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
  );
                                                    }
