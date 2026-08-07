import { NextResponse } from "next/server";
import { BLOG_POSTS } from "@/src/lib/blogs";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/src/lib/site";

export async function GET() {
  const rssItems = BLOG_POSTS.map((post) => `
    <item>
      <title>${post.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <description>${post.description.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</description>
      <category>${post.category.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</category>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
    </item>
  `).join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${SITE_NAME} Journal</title>
  <link>${SITE_URL}/blog</link>
  <description>${SITE_DESCRIPTION}</description>
  <language>en-us</language>
  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
  ${rssItems}
</channel>
</rss>`;

  return new NextResponse(rssFeed.trim(), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
