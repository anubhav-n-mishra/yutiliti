import type { Metadata } from "next";
import HoverFooter from "@/src/components/ui/hover-footer";
import Header from "@/src/components/Header";
import BlogList from "@/src/components/BlogList";
import { BLOG_POSTS } from "@/src/lib/blogs";
import { SITE_NAME, SITE_URL } from "@/src/lib/site";

export const metadata: Metadata = {
  title: "Engineering Guides & Privacy Insights | Yuitility Journal",
  description: "Explore in-depth articles, tutorials, and guides on scientific calculations, salary breakdowns, in-browser PDF security, and image optimization.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    title: "Engineering Guides & Privacy Insights | Yuitility Journal",
    description: "Explore in-depth articles, tutorials, and guides on scientific calculations, salary breakdowns, in-browser PDF security, and image optimization.",
    images: [{ url: `${SITE_URL}/brand/yuitility-logo-512.png`, alt: "Yuitility Journal" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yuitility",
    creator: "@yuitility",
    title: "Engineering Guides & Privacy Insights | Yuitility Journal",
    description: "Explore in-depth articles, tutorials, and guides on scientific calculations, salary breakdowns, in-browser PDF security, and image optimization.",
    images: [`${SITE_URL}/brand/yuitility-logo-512.png`],
  },
};

export default function BlogIndexPage() {
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Yuitility Journal - Engineering Guides & Privacy Insights",
    description: "Explore in-depth articles, tutorials, and guides on scientific calculations, salary breakdowns, in-browser PDF security, and image optimization.",
    url: `${SITE_URL}/blog`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: BLOG_POSTS.length,
      itemListElement: BLOG_POSTS.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans relative overflow-hidden flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      {/* Decorative background glows */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-blue-500/[0.02] blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-28 pb-16 sm:pt-36 sm:pb-20 flex-1 space-y-16">
        {/* Editorial Heading */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-[1.1] text-zinc-950 dark:text-white">
            Engineering <br />
            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)] bg-clip-text text-transparent">
              & Privacy Insights
            </span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            In-depth guides, mechanical breakdowns of our browser tools, and articles on local-first data privacy.
          </p>
        </div>

        {/* Paginated Blog List */}
        <BlogList posts={BLOG_POSTS} />
      </main>
      <HoverFooter />
    </div>
  );
}
