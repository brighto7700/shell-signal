"use client";
import { useState } from "react";

function timeAgo(unixTime) {
  const diff = Date.now() / 1000 - unixTime;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export default function StoryCard({ story, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="story-card">
      <div className="story-rank">{String(index + 1).padStart(2, "0")}</div>
      <div className="story-body">
        <a href={story.url} target="_blank" rel="noopener noreferrer" className="story-title">
          {story.title}
        </a>
        <div className="story-meta">
          <span className="story-domain">{getDomain(story.url)}</span>
          <span className="dot">·</span>
          <span>▲ {story.score}</span>
          <span className="dot">·</span>
          <span>{story.descendants} comments</span>
          <span className="dot">·</span>
          <span>{timeAgo(story.time)}</span>
          <span className="dot">·</span>
          <a href={story.hnUrl} target="_blank" rel="noopener noreferrer" className="hn-link">
            discuss
          </a>
        </div>

        {story.github && (
          <div className="dev-health">
            <span className="health-label">DEV HEALTH</span>
            <span>★ {story.github.stars?.toLocaleString()}</span>
            <span>⑂ {story.github.forks?.toLocaleString()}</span>
            <span>! {story.github.openIssues} issues</span>
            <span>⏱ {story.github.lastCommit}</span>
          </div>
        )}

        {story.summary && (
          <div className="summary">
            <button className="summary-toggle" onClick={() => setExpanded(!expanded)}>
              {expanded ? "▼" : "▶"} KEY TAKEAWAYS
            </button>
            {expanded && (
              <pre className="summary-text">{story.summary}</pre>
            )}
          </div>
        )}
      </div>
    </article>
  );
            }
