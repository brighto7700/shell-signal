"use client";
import { useState, useEffect } from "react";
import StoryCard from "@/components/StoryCard";
import TerminalBar from "@/components/TerminalBar";
import TerminalOutput from "@/components/TerminalOutput"; // Ensure this exists!
import Link from "next/link";

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [latestDate, setLatestDate] = useState(null);
  const [generatedCommand, setGeneratedCommand] = useState(""); // Holds the AI script

  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then(({ stories, fetched }) => {
        setStories(stories || []);
        setFetchedAt(fetched);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const today = new Date().toISOString().split("T")[0];
    setLatestDate(today);
  }, []);

  const githubCount = stories.filter((s) => s.github).length;
  const avgScore = stories.length > 0 ? Math.round(stories.reduce((a, s) => a + s.score, 0) / stories.length) : 0;

  return (
    <main className="main">
      {/* 📊 SIGNAL BAR */}
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
            {fetchedAt ? new Date(fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
          </span>
        </div>
      </div>

      {/* 🚀 SYSTEM COMMANDS */}
      <div className="daily-brief-card">
        <p className="section-heading">SYSTEM COMMANDS</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Link href={`/daily-brief/${latestDate}`} className="btn-terminal-run">
            [ RUN ] ./latest_brief.sh
          </Link>
          <Link href="/daily-brief" className="btn-terminal-view">
            [ VIEW ] ./archives
          </Link>
        </div>
      </div>

      {/* 🖥️ TERMINAL OUTPUT WINDOW: Appears over content when a script is generated */}
      <TerminalOutput 
        command={generatedCommand} 
        onClose={() => setGeneratedCommand("")} 
      />

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

      {/* 📱 FLOATING TERMINAL BAR */}
      <div style={{ height: '100px' }} /> 
      <TerminalBar onResult={(cmd) => setGeneratedCommand(cmd)} />
    </main>
  );
            }
      
