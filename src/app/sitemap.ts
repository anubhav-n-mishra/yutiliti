import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/src/types";
import { BLOG_POSTS } from "@/src/lib/blogs";
import { LIVE_TOOLS, liveToolsInCategory } from "@/src/lib/toolRegistry";
import { absoluteUrl, toolPath } from "@/src/lib/site";
import { getAllToolPresets } from "@/src/lib/toolPresets";

/**
 * Only pages we want Google to spend crawl budget on.
 *
 * Deliberately excluded:
 *   - tools with no working implementation (see toolRegistry.IMPLEMENTED_TOOL_IDS)
 *   - categories that currently contain no live tools (empty listing pages)
 *   - /privacy, /terms, /cookies — indexable, but they do not need prompting
 *
 * `priority` and `changeFrequency` are omitted: Google has stated it ignores
 * both, and carrying them invites the fiction that they do something.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Calibrated release date instead of dynamically asserting every page was modified
  // at the exact build instant (which causes search engines to ignore lastmod).
  const baselineRelease = new Date("2026-09-06");

  const toolUrls = LIVE_TOOLS.map((tool) => ({
    url: absoluteUrl(toolPath(tool.id)),
    lastModified: baselineRelease,
  }));

  const presetUrls = getAllToolPresets().map((preset) => ({
    url: absoluteUrl(`/tools/${preset.toolId}/${preset.presetSlug}`),
    lastModified: baselineRelease,
  }));

  const categoryUrls = CATEGORIES.filter(
    (c) => c.id !== "all" && liveToolsInCategory(c.id).length > 0,
  ).map((category) => ({
    url: absoluteUrl(`/category/${category.id}`),
    lastModified: baselineRelease,
  }));

  const blogPostUrls = BLOG_POSTS.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
  }));

  return [
    { url: absoluteUrl("/"), lastModified: baselineRelease },
    { url: absoluteUrl("/tools"), lastModified: baselineRelease },
    { url: absoluteUrl("/blog"), lastModified: baselineRelease },
    { url: absoluteUrl("/about"), lastModified: baselineRelease },
    { url: absoluteUrl("/contact"), lastModified: baselineRelease },
    { url: absoluteUrl("/sitemap"), lastModified: baselineRelease },
    ...categoryUrls,
    ...toolUrls,
    ...presetUrls,
    ...blogPostUrls,
  ];
}
