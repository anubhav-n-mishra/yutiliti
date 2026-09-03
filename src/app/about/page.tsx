import type { Metadata } from "next";
import AboutPageClient from "@/src/components/AboutPageClient";

export const metadata: Metadata = {
  title: "About Yuitility: Why Nothing You Open Gets Uploaded",
  description: "Learn more about Yuitility. Why every Yuitility tool runs on your own device instead of our servers, what that means for your files, and how you can verify it yourself.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
