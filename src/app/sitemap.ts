import type { MetadataRoute } from "next";
import { TOOLS, CATEGORIES } from "@/src/types";
import { absoluteUrl, toolPath } from "@/src/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const toolUrls = TOOLS
    .filter((tool) => !tool.disabled)
    .map((tool) => ({
      url: absoluteUrl(toolPath(tool.id)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: tool.popular ? 0.95 : 0.85,
    }));

  const categoryUrls = CATEGORIES.filter((c) => c.id !== "all").map((category) => ({
    url: absoluteUrl(`/category/${category.id}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...categoryUrls,
    ...toolUrls,
  ];
}
