import "./globals.css";
import Script from 'next/script';

export const metadata = {
  title: "ShellSignal — Terminal-Style Dev Dashboard & AI Brief",
  metadataBase: new URL('https://shellsignal.vercel.app'),
  description: "A sharp, terminal-style dashboard for senior developers. Real-time HN/GitHub trends and AI-powered technical takeaways.",
  alternates: {
    canonical: 'https://shellsignal.vercel.app', 
  },
  openGraph: {
    title: "ShellSignal",
    description: "The technical signal in the noise.",
    url: "https://shellsignal.vercel.app",
    siteName: "ShellSignal",
    images: [{ url: "/og-main.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShellSignal",
    description: "Real-time technical signal for developers.",
    images: ["https://shellsignal.vercel.app/og-main.png"],
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "ShellSignal — Real-Time Tech Dashboard",
    "description": "A terminal-style dashboard for developers tracking Hacker News and GitHub.",
    "author": {
      "@type": "Person",
      "name": "Brighto G"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ShellSignal",
      "logo": {
        "@type": "ImageObject",
        "url": "https://shellsignal.vercel.app/og-main.png"
      }
    }
  };

  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1RKZ4EN7EM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1RKZ4EN7EM');
          `}
        </Script>
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* The ghost UI (header/footer) is gone so the new design can shine, 
          but all your analytics and schema markup stay intact! 
        */}
        {children}

      </body>
    </html>
  );
}
