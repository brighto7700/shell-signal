import "./globals.css";
import Script from 'next/script';
import AppShell from '@/components/AppShell';
import { JetBrains_Mono, Rajdhani } from 'next/font/google';

// 🔥 PERFORMANCE: Localized fonts to kill the 2.5s render-blocking delay
const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const sans = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata = {
  title: "ShellSignal — Terminal-Style Dev Dashboard & AI Brief",
  metadataBase: new URL('https://shellsignal.brgt.site'), // CORRECTED
  description: "A real-time, terminal-style news dashboard and AI-powered daily brief for developers. Built by Bright Emmanuel.",
  alternates: {
    canonical: 'https://shellsignal.brgt.site', // CORRECTED
  },
  openGraph: {
    title: "ShellSignal",
    description: "The technical signal in the noise. Terminal-style dev dashboard.",
    url: "https://shellsignal.brgt.site", // CORRECTED
    siteName: "ShellSignal",
    images: [{ url: "/og-main.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShellSignal — Dev Dashboard",
    description: "Terminal-style news dashboard & AI brief.",
    images: ["https://shellsignal.brgt.site/og-main.png"], // CORRECTED
    creator: "@brighto7700",
  },
};

export default function RootLayout({ children }) {
  // 🧠 SCHEMA: Identifying ShellSignal as a WebApplication
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ShellSignal",
    "url": "https://shellsignal.brgt.site",
    "applicationCategory": "DeveloperTool",
    "operatingSystem": "Web",
    "author": {
      "@type": "Person",
      "name": "Bright Emmanuel",
      "url": "https://brgt.site" // Link back to your main portfolio
    },
    "description": "Terminal-style dashboard providing AI-curated developer news and scripts."
  };

  return (
    <html lang="en" className={`${mono.variable} ${sans.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.dicebear.com" />
        
        {/* Google Analytics */}
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
        
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
