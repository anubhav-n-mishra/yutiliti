import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_URL } from "@/src/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Yuitility",
    description: "Free, private browser tools for PDFs, images, calculations, developer workflows, and everyday tasks.",
    start_url: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
    background_color: "#fafafa",
    theme_color: "#2563eb",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    dir: "ltr",
    categories: ["utilities", "productivity", "developer", "finance", "education"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
