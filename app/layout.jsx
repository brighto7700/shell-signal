import "./globals.css";
import Script from 'next/script';
import AppShell from '@/components/AppShell';
import { JetBrains_Mono, Inter } from 'next/font/google'; // Optimizing fonts

// 1. Font Optimization: This eliminates render-blocking font requests
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata = {
  title: "Bright Emmanuel — Full-Stack Developer & Technical Writer",
  metadataBase: new URL('https://brgt.site'),
  description: "Portfolio of Bright Emmanuel. Specializing in Node.js, Go, and Python. Author at SitePoint & Dev.to.",
  alternates: {
    canonical: '/', 
  },
  openGraph: {
    title: "Bright Emmanuel",
    description: "Full-stack developer building the technical signal.",
    url: "https://brgt.site",
    siteName: "Bright Emmanuel",
    images: [{ url: "/og-main.png" }], // Ensure this exists in your public folder
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bright Emmanuel",
    description: "Full-stack engineer & Technical Writer.",
    images: ["https://brgt.site/og-main.png"],
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person", // Root domain should focus on YOU
    "name": "Bright Emmanuel",
    "url": "https://brgt.site",
    "image": "https://brgt.site/og-main.png",
    "jobTitle": "Full-Stack Developer",
    "sameAs": [
      "https://github.com/brighto7700",
      "https://x.com/brighto7700",
      "https://www.linkedin.com/in/brighto7700",
      "https://dev.to/brighto7700",
      "https://www.sitepoint.com/author/bright-emmanuel"
    ],
    "knowsAbout": ["Web Development", "Node.js", "Go", "Python", "Technical Writing"]
  };

  return (
    <html lang="en" className={`${jetbrains.variable} ${inter.variable}`}>
      <head>
        {/* Preconnect to external assets to speed up performance */}
        <link rel="preconnect" href="https://api.dicebear.com" />
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
      <body style={{ fontFamily: 'var(--font-sans)' }}>
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
