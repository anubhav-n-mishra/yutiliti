import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/src/lib/site";
import { LIVE_TOOLS } from "@/src/lib/toolRegistry";
import ServiceWorkerRegister from "@/src/components/ServiceWorkerRegister";
import CookieBanner from "@/src/components/CookieBanner";
import AiChatbot from "@/src/components/AiChatbot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Yuitility: Browser Tools That Never Upload Your Files",
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Yuitility Team", url: SITE_URL }],
  creator: "Yuitility",
  publisher: "Yuitility",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    other: [
      { rel: "manifest", url: "/manifest.webmanifest" },
    ],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: "Yuitility: Browser Tools That Never Upload Your Files",
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/brand/yuitility-logo.png",
        alt: `${SITE_NAME} logo`,
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yuitility",
    creator: "@yuitility",
    title: `${SITE_NAME}: Browser Tools That Never Upload Your Files`,
    description: SITE_DESCRIPTION,
    images: ["/brand/yuitility-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "theme-color": "#2563eb",
    "color-scheme": "light dark",
  },
  // NOTE: no `verification` block. It previously emitted literal placeholder
  // strings ("google-site-verification-code") as real meta tags. Add the real
  // token here only once it exists, or verify via DNS/Search Console instead.
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/brand/yuitility-logo.png`,
    },
    // CONTENT TODO: add sameAs entries only for profiles that actually exist
    // and are controlled by Yuitility. Pointing at profiles that 404 is a
    // negative entity signal, not a positive one.
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": SITE_URL,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/yuitility-logo.png`,
  // CONTENT TODO: add verified sameAs profile URLs when they exist.
  description: SITE_DESCRIPTION,
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "WebApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  author: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  featureList: [
    `${LIVE_TOOLS.length} browser-based tools`,
    "Client-side processing - no file or data upload",
    "No account required",
    "Works offline after first load",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  const accent = localStorage.getItem('accent_color') || 'blue';
                  document.documentElement.classList.add('theme-' + accent);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ServiceWorkerRegister />
        <CookieBanner />
        <AiChatbot />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }} />
        {children}
      </body>
    </html>
  );
}
