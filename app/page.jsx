"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function getDomain(url) {
  try { return new URL(url).hostname.replace("www.", ""); }
  catch { return url; }
}

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls the new HUD menu
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then(({ stories }) => {
        setStories(stories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt || generating) return;

    setGenerating(true);
    setGeneratedScript(""); 
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.command) {
        setGeneratedScript(data.command);
        setPrompt("");
      }
    } catch (err) {
      console.error("OpenRouter API Failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="phone">
      
      {/* ── SYSTEM HUD MENU OVERLAY ── */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute', top: '60px', left: '1rem', right: '1rem',
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '1.2rem', zIndex: 5000,
          boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(57,217,138,0.2)',
          animation: 'fadeUp 0.2s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-bright)', fontFamily: 'var(--sans)', fontWeight: 'bold', letterSpacing: '0.1em' }}>SYSTEM_DIAGNOSTICS</span>
            <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontFamily: 'var(--mono)' }}>[CLOSE]</button>
          </div>
          <ul style={{ listStyle: 'none', fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: '2' }}>
            <li>STATUS: <span style={{ color: 'var(--green)' }}>ONLINE</span></li>
            <li>PING: <span style={{ color: 'var(--amber)' }}>24ms</span></li>
            <li>API_LIMIT: <span style={{ color: 'var(--text-bright)' }}>84% REMAINING</span></li>
            <li>THEME: <span style={{ color: 'var(--green)' }}>MATRIX_NIGHT</span></li>
          </ul>
          <button style={{
            width: '100%', marginTop: '1rem', padding: '8px', background: '#000',
            border: '1px dashed var(--text-dim)', color: 'var(--text-bright)',
            fontFamily: 'var(--mono)', fontSize: '0.7rem', cursor: 'pointer'
          }}>
            &gt; CONFIGURE API KEYS
          </button>
        </div>
      )}

      <div className="scroll-area">
        {/* HEADER */}
        <div className="header">
          <div className="logo">
            <span>&gt;&gt;&gt;&gt;</span> SHELL/SIGNAL [LIVE]<span className="live-dot"></span>
          </div>
          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span><span></span><span></span>
          </div>
        </div>
        <div className="date-line">{today}</div>

        {/* TABS (Now fully wired with Next.js Links!) */}
        <div className="tabs">
          <Link href="/" className="tab active">HOME</Link>
          <Link href="/daily-brief" className="tab">ARCHIVE</Link>
          <div className="tab-scripts">SCRIPTS</div>
          <div className="tab-icon">⬡</div>
        </div>

        {/* DAILY BRIEF (Now a massive clickable button!) */}
        <Link href={`/daily-brief/${today}`} style={{ display: 'block' }}>
          <div className="brief-card" style={{ transition: 'transform 0.1s', cursor: 'pointer' }}>
            <div className="brief-label">DAILY BRIEF</div>
            <ul className="brief-checks">
              <li><span className="check-icon">✔</span> AI Summary</li>
              <li><span className="check-icon">✔</span> AI curated list and trends</li>
            </ul>

            <div className="snippet-wrap">
              <div className="snippet-header">
                <span className="snippet-icon">📁</span>
                <span className="snippet-title-text">Daily Snippet</span>
              </div>
              <div className="snippet-body">
                <span className="c-amber">{"((<echo \"AI Summary:\\n m#sh:}:)"}</span><br/>
                &nbsp;&nbsp;<span className="c-blue">{"$(docker stats --no-stream --format"}</span> <span className="c-amber">{"\"table {{.Name}}\\t{n})"}</span><br/>
                &nbsp;&nbsp;<span className="c-dim">{";demo@stta=-]"}</span><br/>
                &nbsp;&nbsp;<span className="c-dim">{";MemUsage}}>\"(krxeonlc)"}</span><br/>
                <span className="c-dim">{"d.ckp>)"}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* TOP STORIES */}
        <div className="section-title">TOP STORIES</div>

        {loading ? (
          <div style={{ color: 'var(--green)', fontFamily: 'var(--mono)', fontSize: '0.8rem', textAlign: 'center', padding: '2rem' }}>
            CONNECTING...
          </div>
        ) : (
          stories.slice(0, 15).map((story) => (
            <a key={story.id} href={story.url} target="_blank" rel="noopener noreferrer" className="story">
              <img 
                className="avatar" 
                src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${story.id}&backgroundColor=1a2230`} 
                alt="avatar" 
              />
              <div className="story-content">
                <div className="story-title-text">{story.title}</div>
                <div className="story-meta">{getDomain(story.url)} • {story.score} PTS</div>
              </div>
              
              {/* RESTORED DEV HEALTH STATS (STARS + ISSUES) */}
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
            </a>
          ))
        )}
      </div>

      {/* SCRIPT OUTPUT WINDOW */}
      {generatedScript && (
        <div className="output-window">
          <div className="output-header">
            <span style={{ fontSize: '0.65rem', color: 'var(--green)', fontFamily: 'var(--mono)' }}>GENERATED_SCRIPT.SH</span>
            <button onClick={() => setGeneratedScript("")} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontFamily: 'var(--mono)' }}>[X]</button>
          </div>
          <div className="output-body">
            {generatedScript}
          </div>
        </div>
      )}

      {/* TERMINAL BAR */}
      <form className="terminal-bar" onSubmit={handleGenerate}>
        <div className="terminal-input">
          <span className="terminal-prompt">user@shell/signal:$</span>
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={generating}
            placeholder={generating ? "COMPILING..." : ""}
            style={{ background: 'transparent', border: 'none', color: 'var(--bright)', outline: 'none', width: '100%', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}
          />
          {!prompt && !generating && <span className="terminal-cursor"></span>}
        </div>
        <button type="submit" className="gen-btn" disabled={generating}>
          {generating ? "WAIT" : "GENERATE SCRIPT"}
        </button>
      </form>
    </div>
  );
    }
          
