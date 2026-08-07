import type { Metadata } from "next";
import AboutPageClient from "@/src/components/AboutPageClient";

export const metadata: Metadata = {
  title: "About Yuitility - 100% In-Browser Private Utility Suite",
  description: "Learn more about Yuitility. We provide 100+ free online utility tools that process all data locally in your browser with zero server uploads and complete privacy.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
