"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppShell({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState("");
  const [copied, setCopied] = useState(false);
  
  const pathname = usePathname();
  const today = new Date().toISOString().split("T")[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt || generating) return;

    setGenerating(true);
    setGeneratedScript(""); 

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.command) {
        setGeneratedScript(data.command);
        setPrompt("");
      }
    } catch (err) {
      console.error("Fetch failed:", err);
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
            <span style={{ color: 'var(--bright)', fontFamily: 'var(--sans)', fontWeight: 'bold', letterSpacing: '0.1em' }}>SYSTEM_DIAGNOSTICS</span>
            <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontFamily: 'var(--mono)' }}>[CLOSE]</button>
          </div>
          <ul style={{ listStyle: 'none', fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: '2' }}>
            <li>STATUS: <span style={{ color: 'var(--green)' }}>ONLINE</span></li>
            <li>PING: <span style={{ color: 'var(--amber)' }}>24ms</span></li>
            <li>API_LIMIT: <span style={{ color: 'var(--bright)' }}>STABLE</span></li>
          </ul>
        </div>
      )}

      {/* SCRIPT OUTPUT WINDOW WITH COPY BUTTON */}
      {generatedScript && (
        <div className="output-window">
          <div className="output-header">
            <span style={{ fontSize: '0.65rem', color: 'var(--green)', fontFamily: 'var(--mono)' }}>GENERATED_SCRIPT.SH</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleCopy} style={{ background: 'none', border: 'none', color: copied ? 'var(--green)' : 'var(--amber)', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.65rem' }}>
                {copied ? "[COPIED!]" : "[COPY]"}
              </button>
              <button onClick={() => setGeneratedScript("")} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '0.65rem' }}>[X]</button>
            </div>
          </div>
          <div className="output-body">
            {generatedScript}
          </div>
        </div>
      )}

      <div className="scroll-area">
        <div className="header">
          <div className="logo">
            <span>&gt;&gt;&gt;&gt;</span> SHELL/SIGNAL [LIVE]<span className="live-dot"></span>
          </div>
          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span><span></span><span></span>
          </div>
        </div>
        <div className="date-line">{today}</div>

        <div className="tabs">
          <Link href="/" className={`tab ${pathname === '/' ? 'active' : ''}`}>HOME</Link>
          <Link href="/daily-brief" className={`tab ${pathname?.startsWith('/daily-brief') ? 'active' : ''}`}>ARCHIVE</Link>
          <div className="tab-scripts" style={{color: 'var(--text-dim)'}}>SCRIPTS</div>
          <div className="tab-icon">⬡</div>
        </div>

        {children}
      </div>

      <form className="terminal-bar" onSubmit={handleGenerate}>
        <div className="terminal-input">
          <span className="terminal-prompt">user@shell/signal:$</span>
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={generating}
            placeholder={generating ? "COMPILING..." : "ask for a script..."}
            style={{ background: 'transparent', border: 'none', color: 'var(--bright)', outline: 'none', width: '100%', fontFamily: 'var(--mono)', fontSize: '0.8rem' }}
          />
          {!prompt && !generating && <span className="terminal-cursor"></span>}
        </div>
        <button type="submit" className="gen-btn" disabled={generating}>
          {generating ? "WAIT" : "GENERATE"}
        </button>
      </form>
    </div>
  );
      }
                                                   
