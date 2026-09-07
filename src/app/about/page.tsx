import type { Metadata } from "next";
import AboutPageClient from "@/src/components/AboutPageClient";

import { SITE_NAME, SITE_URL } from "@/src/lib/site";

export const metadata: Metadata = {
  title: "About Yuitility: Why Nothing You Open Gets Uploaded",
  description: "Learn more about Yuitility. Why every Yuitility tool runs on your own device instead of our servers, what that means for your files, and how you can verify it yourself.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    title: "About Yuitility: Why Nothing You Open Gets Uploaded",
    description: "Learn more about Yuitility. Why every Yuitility tool runs on your own device instead of our servers, what that means for your files, and how you can verify it yourself.",
    images: [{ url: `${SITE_URL}/brand/yuitility-logo-512.png`, alt: "About Yuitility" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yuitility",
    creator: "@yuitility",
    title: "About Yuitility: Why Nothing You Open Gets Uploaded",
    description: "Learn more about Yuitility. Why every Yuitility tool runs on your own device instead of our servers, what that means for your files, and how you can verify it yourself.",
    images: [`${SITE_URL}/brand/yuitility-logo-512.png`],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
