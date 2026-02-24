"use client";
import { useState, useEffect } from "react";
import StoryCard from "@/components/StoryCard";
import TerminalBar from "@/components/TerminalBar";
import Link from "next/link";

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [latestDate, setLatestDate] = useState(null);

  useEffect(() => {
    // 1. Fetch live stories for the stats bar
    fetch("/api/stories")
      .then((r) => r.json())
      .then(({ stories, fetched }) => {
        setStories(stories || []);
        setFetchedAt(fetched);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // 2. Set the latest date for the brief link
    const today = new Date().toISOString().split("T")[0];
    setLatestDate(today);
  }, []);

  const githubCount = stories.filter((s) => s.github).length;
  const avgScore =
    stories.length > 0
      ? Math.round(stories.reduce((a, s) => a + s.score, 0) / stories.length)
      : 0;

  return (
    <main className="main">
      {/* 📊 TOP SIGNAL BAR: Technical data visualization */}
      <div className="signal-bar">
        <div className="signal-item">
          <span className="signal-label">STORIES</span>
          <span className="signal-value">{stories.length}</span>
        </div>
        <div className="signal-item">
          <span className="signal-label">GITHUB</span>
          <span className="signal-value">{githubCount}</span>
        </div>
        <div className="signal-item">
          <span className="signal-label">AVG SCORE</span>
          <span className="signal-value">{avgScore}</span>
        </div>
        <div className="signal-item">
          <span className="signal-label">UPDATED</span>
          <span className="signal-value">
            {fetchedAt ? new Date(fetchedAt).toLocaleTimeString() : "—"}
          </span>
        </div>
      </div>

      {/* 🚀 SYSTEM COMMANDS: Quick access to Daily Briefs */}
      <div className="daily-brief-card" style={{ borderLeft: '4px solid var(--green)' }}>
        <p className="section-heading" style={{ marginBottom: '1rem' }}>SYSTEM COMMANDS</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Link 
            href={`/daily-brief/${latestDate}`}
            style={{ 
              padding: '0.8rem', 
              border: '1px solid var(--green)', 
              color: 'var(--green)', 
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: '0.75rem',
              fontFamily: 'var(--mono)',
              borderRadius: '4px',
              background: 'rgba(62, 207, 142, 0.05)'
            }}
          >
            [ RUN ] ./latest_brief.sh
          </Link>
          <Link 
            href="/daily-brief"
            style={{ 
              padding: '0.8rem', 
              border: '1px solid var(--border)', 
              color: 'var(--text-bright)', 
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: '0.75rem',
              fontFamily: 'var(--mono)',
              borderRadius: '4px'
            }}
          >
            [ VIEW ] ./archives
          </Link>
        </div>
      </div>

      {/* 📡 LIVE FEED SECTION */}
      <p className="section-heading">LIVE SIGNAL · TOP NEWS</p>

      {loading ? (
        <div className="loading">CONNECTING TO SATELLITE...</div>
      ) : (
        <div className="stories-list">
          {stories.map((story, i) => (
            <StoryCard key={story.id} story={story} index={i} />
          ))}
        </div>
      )}

      {/* 📱 TERMINAL INTERFACE: Floating input bar from the mockup */}
      <div style={{ height: '100px' }} /> {/* Prevent overlap with last story */}
      <TerminalBar />
    </main>
  );
                                               }
              
