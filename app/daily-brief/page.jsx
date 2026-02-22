import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const metadata = {
  title: "Daily Dev Brief Archive — The Dev Signal",
  description: "Daily AI-generated summaries of the top developer news stories.",
};

export default async function DailyBriefIndexPage() {
  const { data: briefs } = await supabase
    .from("daily_briefs")
    .select("date, summary")
    .order("date", { ascending: false })
    .limit(30);

  return (
    <main className="main">
      <p className="section-heading">DAILY DEV BRIEF · ARCHIVE</p>
      {!briefs || briefs.length === 0 ? (
        <p style={{ fontFamily: "var(--mono)", color: "var(--text-dim)", fontSize: "0.8rem" }}>
          No briefs yet. The first one will appear tomorrow at 08:00 UTC.
        </p>
      ) : (
        <div className="stories-list">
          {briefs.map((b) => (
            <Link
              key={b.date}
              href={`/daily-brief/${b.date}`}
              style={{ display: "block", padding: "1rem 0", borderBottom: "1px solid var(--border)", textDecoration: "none" }}
            >
              <div style={{ fontFamily: "var(--mono)", color: "var(--amber)", fontSize: "0.75rem", marginBottom: 6 }}>
                {b.date}
              </div>
              <div style={{ color: "var(--text)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                {b.summary?.slice(0, 120)}...
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
    }
