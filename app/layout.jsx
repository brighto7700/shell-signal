import "./globals.css";
import Script from 'next/script';
import AppShell from '@/components/AppShell';
import { JetBrains_Mono, Rajdhani } from 'next/font/google';

/** * Font Optimization: Using next/font to prevent layout shift 
 * and eliminate external network requests.
 */
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
  // Structured Data for Search Engine Result Branding
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Shell Signal",
    "url": "https://shellsignal.brgt.site",
    "author": {
      "@type": "Person",
      "name": "Bright Emmanuel",
      "url": "https://brgt.site"
    }
  };

  return (
    <html lang="en" className={`${mono.variable} ${sans.variable}`}>
      <head>
        {/* Google Analytics: Lazy loaded for performance optimization */}
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
