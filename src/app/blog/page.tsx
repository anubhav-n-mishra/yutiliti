import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Tag, ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/src/lib/blogs";

export const metadata: Metadata = {
  title: "Yuitility Blog — Developer Guides, Financial Formulas & Privacy Insights",
  description: "Explore in-depth articles, tutorials, and guides on scientific calculations, salary breakdowns, in-browser PDF security, and image optimization.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/brand/yuitility-logo.png" alt="Yuitility logo" className="h-9 w-9 object-contain" />
            <span className="font-display text-lg font-bold tracking-tight text-zinc-950 dark:text-white">Yuitility Blog</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400">
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        <div className="text-center space-y-3">
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-800">
            GUIDES & TUTORIALS
          </span>
          <h1 className="text-4xl font-display font-extrabold tracking-tight">Yuitility Knowledge Base</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            In-depth documentation, mathematical formulas, financial breakdowns, and client-side browser optimization guides.
          </p>
        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 font-medium rounded-lg text-zinc-700 dark:text-zinc-300">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {post.readTime}
                  </div>
                </div>

                <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-mono">{post.date}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
                >
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
