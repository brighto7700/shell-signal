import "./globals.css";

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


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <a href="/" className="logo">
            THE DEV<span>/</span>SIGNAL
          </a>
          <nav className="site-nav">
            <a href="/">FEED</a>
            <a href="/daily-brief">DAILY BRIEF</a>
          </nav>
          <div className="live-badge">
            <span className="live-dot" />
            LIVE
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <p>
            THE DEV SIGNAL · Data from{" "}
            <a href="https://news.ycombinator.com" target="_blank" rel="noopener">
              Hacker News
            </a>{" "}
            &amp;{" "}
            <a href="https://github.com" target="_blank" rel="noopener">
              GitHub
            </a>{" "}
            · Summaries by Gemini Flash
          </p>
        </footer>
      </body>
    </html>
  );
}
