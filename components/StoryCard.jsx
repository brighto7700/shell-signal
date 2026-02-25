"use client";

function getDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch { return url; }
}

export default function StoryCard({ story }) {
  // Using a dummy placeholder for the avatar to match the mockup look
  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${story.id}&backgroundColor=1e2530`;

  return (
    <a href={story.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
      <div className="story-card-row">
        
        {/* LEFT: Avatar */}
        <img src={avatarUrl} alt="avatar" className="story-avatar" />
        
        {/* MIDDLE: Title and Meta */}
        <div className="story-content">
          <div className="story-card-title">{story.title}</div>
          <div className="story-card-meta">
            {getDomain(story.url)} • {story.score} PTS
          </div>
        </div>

        {/* RIGHT: Dev Health Badge */}
        {story.github ? (
          <div className="story-health-badge">
            <span className="health-badge-label">DEV HEALTH</span>
            <span>★ {story.github.stars >= 1000 ? (story.github.stars / 1000).toFixed(1) + 'k' : story.github.stars} &gt;</span>
          </div>
        ) : (
          <div className="story-health-badge" style={{ opacity: 0.3 }}>
            <span className="health-badge-label">SIGNAL</span>
            <span>READ &gt;</span>
          </div>
        )}
        
      </div>
    </a>
  );
}
