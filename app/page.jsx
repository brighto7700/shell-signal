export const metadata = {
  title: "The Dev Signal — Real-Time Tech Dashboard for Developers",
  description: "A sharp, terminal-style dashboard tracking Hacker News and GitHub. Get AI-generated technical takeaways and live project health stats.",
  openGraph: {
    title: "The Dev Signal",
    description: "Real-time tech trends, GitHub health, and AI-powered dev insights.",
    url: "https://dev-signal.vercel.app",
    siteName: "The Dev Signal",
    type: "website",
    // Link this to a static logo or screenshot in your public folder
    images: [
      {
        url: "https://dev-signal.vercel.app/og-main.png", 
        width: 1200,
        height: 630,
        alt: "The Dev Signal Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Dev Signal",
    description: "The developer's real-time signal in the noise.",
    images: ["https://dev-signal.vercel.app/og-main.png"],
  },
};

"use client";
import { useState, useEffect } from "react";
import StoryCard from "@/components/StoryCard";

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState(null);

  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then(({ stories, fetched }) => {
        setStories(stories || []);
        setFetchedAt(fetched);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const githubCount = stories.filter((s) => s.github).length;
  const avgScore =
    stories.length > 0
      ? Math.round(stories.reduce((a, s) => a + s.score, 0) / stories.length)
      : 0;

  return (
    <main className="main">
      <div className="signal-bar">
        <div className="signal-item">
          <span className="signal-label">STORIES</span>
          <span className="signal-value">{stories.length}</span>
        </div>
        <div className="signal-item">
          <span className="signal-label">GITHUB REPOS</span>
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
        <div className="signal-item">
          <span className="signal-label">SOURCE</span>
          <span className="signal-value">HN + GITHUB</span>
        </div>
      </div>

      <div className="ad-slot">
        [ CARBON ADS / BUYSELLADS SLOT — developer-targeted advertising ]
      </div>

      <p className="section-heading">TOP STORIES · RANKED BY SCORE</p>

      {loading ? (
        <div className="loading">FETCHING SIGNAL...</div>
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
