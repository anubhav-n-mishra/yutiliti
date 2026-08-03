import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/src/lib/site";
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
    default: "Yuitility – Free Online Tools for PDF, Finance & Dev",
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "free online tools",
    "browser tools",
    "PDF tools",
    "image tools",
    "financial calculators",
    "developer tools",
    "utility tools",
    "private tools",
    "no signup tools",
    "client-side tools",
    "EMI calculator",
    "SIP calculator",
    "password generator",
    "QR code generator",
    "image compressor",
    "PDF merger",
    "PDF splitter",
    "background remover",
    "unit converter",
    "color palette generator",
    "JSON formatter",
    "word counter",
    "age calculator",
    "salary calculator",
    "meme generator",
    "favicon generator",
    "OG image generator",
    "social media resizer",
    "fake data generator",
    "photo collage maker",
    "PDF compressor",
    "PDF watermark",
    "PDF metadata editor",
    "image to PDF",
    "image resizer",
    "format converter",
    "ZIP extractor",
  ],
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
    title: "Yuitility – Free Online Tools for PDF, Finance & Dev",
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
    title: `${SITE_NAME} — Free Online Tools`,
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
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-verification-code",
    other: {
      "me": ["https://github.com/yuitility"],
    },
  },
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
    sameAs: [
      "https://github.com/yuitility",
      "https://twitter.com/yuitility",
    ],
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
  sameAs: [
    "https://github.com/yuitility",
    "https://twitter.com/yuitility",
  ],
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
    "140+ free browser-based tools",
    "100% client-side processing",
    "No account required",
    "Privacy-focused",
    "Works offline after first load",
  ],
  screenshot: `${SITE_URL}/brand/screenshot.png`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
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
