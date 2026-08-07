import type { MetadataRoute } from "next";
import { TOOLS, CATEGORIES } from "@/src/types";
import { BLOG_POSTS } from "@/src/lib/blogs";
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

  const blogPostUrls = BLOG_POSTS.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/cookies"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...categoryUrls,
    ...blogPostUrls,
    ...toolUrls,
  ];
}
