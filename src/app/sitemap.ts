import type { MetadataRoute } from "next";
import { TOOLS } from "@/src/types";
import { absoluteUrl, toolPath } from "@/src/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...TOOLS.map((tool) => ({
      url: absoluteUrl(toolPath(tool.id)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: tool.popular ? 0.9 : 0.8,
    })),
  ];
}
