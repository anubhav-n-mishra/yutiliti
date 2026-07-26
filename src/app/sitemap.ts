import type { MetadataRoute } from "next";
import { TOOLS } from "@/src/types";
import { absoluteUrl, toolPath } from "@/src/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const toolUrls = TOOLS.map((tool) => ({
    url: absoluteUrl(toolPath(tool.id)),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: tool.popular ? 0.9 : 0.85,
    alternates: {
      languages: {
        en: absoluteUrl(toolPath(tool.id)),
        "x-default": absoluteUrl(toolPath(tool.id)),
      },
    },
  }));

  const categoryUrls = [
    "finance",
    "utility",
    "developer",
    "pdf",
  ].map((category) => ({
    url: absoluteUrl(`/?category=${category}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          en: absoluteUrl("/"),
          "x-default": absoluteUrl("/"),
        },
      },
    },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/tools"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    ...categoryUrls,
    ...toolUrls,
  ];
}
