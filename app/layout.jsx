import "./globals.css";
import Script from 'next/script';
import AppShell from '@/components/AppShell';
import { JetBrains_Mono, Rajdhani } from 'next/font/google';

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
  title: "Shell Signal — Terminal-Style Dev Dashboard",
  metadataBase: new URL('https://shellsignal.brgt.site'),
  description: "Real-time developer news, AI-curated briefs, and technical signals.",
  alternates: {
    canonical: 'https://shellsignal.brgt.site',
  },
  openGraph: {
    title: "Shell Signal",
    description: "The technical signal in the noise.",
    url: "https://shellsignal.brgt.site",
    siteName: "Shell Signal",
    images: [{ url: "/og-main.png" }],
    type: "website",
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
  twitter: {
    card: "summary_large_image",
    title: "Shell Signal",
    creator: "@brighto7700",
    images: ["https://shellsignal.brgt.site/og-main.png"],
  },
};

export default function RootLayout({ children }) {
  // Advanced Sitelinks Searchbox Schema 
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": "ShellSignal",
    "url": "https://shellsignal.brgt.site",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://shellsignal.brgt.site/daily-brief?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "author": {
      "@type": "Person",
      "name": "Bright Emmanuel",
      "url": "https://brgt.site"
    }
  };

  return (
    <html lang="en" className={`${mono.variable} ${sans.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1RKZ4EN7EM"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
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
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
