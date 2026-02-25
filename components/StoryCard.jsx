"use client";
import { useState } from "react";

function getDomain(url) {
  try { return new URL(url).hostname.replace("www.", ""); }
  catch { return url; }
}

export default function StoryCard({ story }) {
  const [expanded, setExpanded] = useState(false);
  const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${story.id}&backgroundColor=1a2230`;

  return (
    <div style={{ marginBottom: '0.6rem' }}>
      {/* 1. THE MAIN STORY CARD */}
      <a href={story.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
        <div 
          className="story" 
          style={{ 
            marginBottom: 0, 
            borderBottomLeftRadius: expanded ? 0 : '12px', 
            borderBottomRightRadius: expanded ? 0 : '12px' 
          }}
        >
          <img src={avatarUrl} alt="avatar" className="avatar" />
          
          <div className="story-content">
            <div className="story-title-text">{story.title}</div>
            <div className="story-meta">{getDomain(story.url)} • {story.score} PTS</div>
          </div>
          
          {/* DEV HEALTH STATS */}
          {story.github ? (
            <div className="story-badge">
              <span className="badge-label">DEV HEALTH</span>
              <span className="badge-score">
                ★ <span style={{ color: 'var(--green)', fontSize: '0.78rem' }}>
                  {story.github.stars >= 1000 ? (story.github.stars / 1000).toFixed(1) + 'k' : story.github.stars}
                </span>
                <span style={{ marginLeft: '4px', color: 'var(--amber)' }}>!</span> 
                <span style={{ color: 'var(--green)', fontSize: '0.78rem', marginLeft: '2px' }}>
                  {story.github.openIssues}
                </span>
                <span className="badge-arrow" style={{ marginLeft: '2px' }}> ›</span>
              </span>
            </div>
          ) : (
            <div className="story-badge" style={{ opacity: 0.5 }}>
              <span className="badge-label">SIGNAL</span>
              <span className="badge-score" style={{ color: 'var(--text-dim)' }}>READ <span className="badge-arrow">›</span></span>
            </div>
          )}
        </div>
      </a>

      {/* 2. THE AI TAKEAWAYS DROPDOWN */}
      {story.summary && (
        <div style={{ 
          background: 'var(--bg2)', 
          border: '1px solid var(--border)', 
          borderTop: 'none',
          borderBottomLeftRadius: '12px', 
          borderBottomRightRadius: '12px',
          padding: '8px 11px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          animation: 'fadeUp 0.3s ease-out'
        }}>
          <button 
            onClick={(e) => { 
              e.preventDefault(); 
              setExpanded(!expanded); 
            }}
            style={{ 
              background: 'transparent',
              border: '1px solid var(--green-dim)', 
              color: expanded ? 'var(--amber)' : 'var(--green)',
              fontFamily: 'var(--mono)',
              fontSize: '0.6rem',
              fontWeight: 'bold',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              transition: 'all 0.2s'
            }}
          >
            {expanded ? "[ - ] HIDE SUMMARY" : "[ + ] AI TAKEAWAYS"}
          </button>
          
          {expanded && (
            <div style={{ 
              marginTop: '10px', 
              padding: '12px', 
              background: '#050709', 
              borderLeft: '2px solid var(--amber)',
              color: 'var(--bright)',
              fontFamily: 'var(--mono)',
              fontSize: '0.7rem',
              whiteSpace: 'pre-wrap',
              width: '100%',
              borderRadius: '0 4px 4px 0',
              lineHeight: '1.6'
            }}>
              {story.summary}
            </div>
          )}
        </div>
      )}
    </div>
  );
          }
        
