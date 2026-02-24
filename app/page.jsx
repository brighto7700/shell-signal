"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import StoryCard from "@/components/StoryCard";

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

    // 2. We'll grab the latest brief date so the button is always current
    // Note: In a real "Senior" setup, you'd fetch this from a dedicated small API
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
      {/* 🟢 TOP SIGNAL BAR: Keeps the technical data visualization */}
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

      {/* 🚀 NEW: COMMAND CENTER ACCESS */}
      <div style={{ 
        background: 'var(--bg2)', 
        border: '1px solid var(--border)', 
        padding: '1.5rem', 
        borderRadius: '4px',
        margin: '2rem 0',
        borderLeft: '4px solid var(--green)'
      }}>
        <p className="section-heading" style={{ marginBottom: '1rem' }}>SYSTEM COMMANDS</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Link 
            href={`/daily-brief/${latestDate}`}
            className="btn-terminal"
            style={{ 
              padding: '1rem', 
              border: '1px solid var(--green)', 
              color: 'var(--green)', 
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}
          >
            [ RUN ] ./latest_brief.sh
          </Link>
          <Link 
            href="/daily-brief"
            style={{ 
              padding: '1rem', 
              border: '1px solid var(--border)', 
              color: 'var(--text-bright)', 
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: '0.8rem'
            }}
          >
            [ VIEW ] ./archives
          </Link>
        </div>
      </div>

      {/* 🤖 SCRIPT GENERATOR PLACEHOLDER (Our next big build) */}
      <div style={{ 
        marginBottom: '2rem',
        padding: '1rem', 
        border: '1px dashed var(--border)', 
        textAlign: 'center',
        color: 'var(--text)',
        fontSize: '0.8rem',
        opacity: 0.6
      }}>
        &gt;_ SCRIPT GENERATOR: [ STATUS: OFFLINE ] — INITIALIZING API...
      </div>

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
    </main>
  );
      }
      
