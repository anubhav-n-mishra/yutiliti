import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/private/",
        // Embed widget pages are noindexed in metadata; disallow saves crawl budget
        "/embed/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: "www.yuitility.app",
  };
}