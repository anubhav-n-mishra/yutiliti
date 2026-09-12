import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/src/lib/site";
import dynamic from "next/dynamic";
import ServiceWorkerRegister from "@/src/components/ServiceWorkerRegister";
import CookieBanner from "@/src/components/CookieBanner";

const AiChatbot = dynamic(() => import("@/src/components/AiChatbot"));

const inter = localFont({
  src: "../../public/fonts/Inter-Medium.woff",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const spaceGrotesk = localFont({
  src: "../../public/fonts/SpaceGrotesk-Bold.woff",
  variable: "--font-display",
  display: "swap",
  weight: "300 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Free Browser Tools & Calculators (100% Private) | Yuitility",
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
    title: "Free Browser Tools & Calculators (100% Private) | Yuitility",
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [
        {
          url: "/brand/og-home.png",
          alt: `${SITE_NAME} — Free Browser Tools`,
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
    title: "Free Browser Tools & Calculators (100% Private) | Yuitility",
    description: SITE_DESCRIPTION,
    images: ["/brand/og-home.png"],
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
    other: {
      "msvalidate.01": "0637265E8689996B664AD2392FF31E7D",
    },
  },
};

const rootGraphSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: `${SITE_URL}/brand/yuitility-logo-512.png`,
        contentUrl: `${SITE_URL}/brand/yuitility-logo-512.png`,
        caption: `${SITE_NAME} Logo`,
        width: 512,
        height: 512,
      },
      image: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#og-image`,
        url: `${SITE_URL}/brand/og-home.png`,
        width: 1200,
        height: 630,
      },
      description: SITE_DESCRIPTION,
      foundingDate: "2024",
      sameAs: [
        "https://x.com/yuitility",
        "https://github.com/yuitility",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@yuitility.app",
          url: `${SITE_URL}/contact`,
        },
      ],
      knowsAbout: [
        "https://en.wikipedia.org/wiki/Client-side_computing",
        "https://www.wikidata.org/wiki/Q11072",
        "https://en.wikipedia.org/wiki/WebAssembly",
        "https://www.wikidata.org/wiki/Q21686016",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "en-US",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
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
      <body suppressHydrationWarning>
        <ServiceWorkerRegister />
        <CookieBanner />
        <AiChatbot />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootGraphSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
