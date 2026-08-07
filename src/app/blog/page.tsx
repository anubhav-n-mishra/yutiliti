import type { Metadata } from "next";
import HoverFooter from "@/src/components/ui/hover-footer";
import Header from "@/src/components/Header";
import BlogList from "@/src/components/BlogList";
import { BLOG_POSTS } from "@/src/lib/blogs";

export const metadata: Metadata = {
  title: "Yuitility Journal - Engineering Guides & Privacy Insights",
  description: "Explore in-depth articles, tutorials, and guides on scientific calculations, salary breakdowns, in-browser PDF security, and image optimization.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans relative overflow-hidden flex flex-col justify-between">
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
