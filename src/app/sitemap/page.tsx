import { Metadata } from "next";
import Link from "next/link";
import { LIVE_TOOLS } from "@/src/lib/toolRegistry";
import { CATEGORIES } from "@/src/types";
import { BLOG_POSTS } from "@/src/lib/blogs";
import { getAllToolPresets } from "@/src/lib/toolPresets";
import { absoluteUrl, SITE_NAME, toolPath } from "@/src/lib/site";
import { Wrench, BookOpen, Layers, ShieldCheck, ChevronRight, FileText, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "HTML Sitemap: All Tools, Categories & Guides - Yuitility",
  description:
    "Complete directory of all 132 free client-side browser tools, financial calculators, converters, category hubs, and technical guides on Yuitility.",
  alternates: {
    canonical: absoluteUrl("/sitemap"),
  },
  openGraph: {
    title: "HTML Sitemap: All Tools, Categories & Guides - Yuitility",
    description:
      "Explore the complete index of 132 private browser utilities, calculators, and guides across Yuitility.",
    url: absoluteUrl("/sitemap"),
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function HtmlSitemapPage() {
  const activeCategories = CATEGORIES.filter((c) => c.id !== "all");

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Breadcrumb Header */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-800 dark:text-zinc-200 font-medium">HTML Sitemap</span>
        </nav>

        {/* Hero Section */}
        <header className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Yuitility HTML Sitemap
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            A comprehensive, human-readable index of every verified browser utility, category pillar, calculation guide, and platform resource available across Yuitility.
          </p>
        </header>

        {/* 1. Category Hubs */}
        <section aria-labelledby="heading-categories" className="space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <Layers className="w-5 h-5 text-rose-500" />
            <h2 id="heading-categories" className="text-xl font-display font-semibold text-zinc-900 dark:text-zinc-50">
              Tool Categories ({activeCategories.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {activeCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-rose-400 dark:hover:border-rose-500/50 hover:shadow-sm transition-all group"
              >
                <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                  {cat.label}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  View category hub &rarr;
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 2. All 82+ Verified Tools Grouped by Category */}
        <section aria-labelledby="heading-tools" className="space-y-8">
          <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <Wrench className="w-5 h-5 text-rose-500" />
            <h2 id="heading-tools" className="text-xl font-display font-semibold text-zinc-900 dark:text-zinc-50">
              Live Browser Tools ({LIVE_TOOLS.length})
            </h2>
          </div>

          <div className="space-y-10">
            {activeCategories.map((cat) => {
              const categoryTools = LIVE_TOOLS.filter((t) => t.category === cat.id);
              if (categoryTools.length === 0) return null;

              return (
                <div key={cat.id} className="space-y-4">
                  <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    {cat.label} ({categoryTools.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoryTools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={toolPath(tool.id)}
                        className="p-3.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group"
                      >
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 truncate">
                          {tool.title}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {tool.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Specialized Calculation Presets (pSEO) */}
        <section aria-labelledby="heading-presets" className="space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 id="heading-presets" className="text-xl font-display font-semibold text-zinc-900 dark:text-zinc-50">
              Specialized Institutional & Financial Presets ({getAllToolPresets().length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {getAllToolPresets().map((preset) => (
              <Link
                key={`${preset.toolId}-${preset.presetSlug}`}
                href={`/tools/${preset.toolId}/${preset.presetSlug}`}
                className="p-3.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-amber-400/50 transition-colors group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
                      {preset.badge}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {preset.h1}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {preset.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Blog Guides */}
        <section aria-labelledby="heading-guides" className="space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <BookOpen className="w-5 h-5 text-rose-500" />
            <h2 id="heading-guides" className="text-xl font-display font-semibold text-zinc-900 dark:text-zinc-50">
              Technical Guides & Articles ({BLOG_POSTS.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group"
              >
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                  {post.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Platform, Legal & Trust Pages */}
        <section aria-labelledby="heading-platform" className="space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-rose-500" />
            <h2 id="heading-platform" className="text-xl font-display font-semibold text-zinc-900 dark:text-zinc-50">
              Platform & Legal Pages
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { title: "Home", href: "/" },
              { title: "All Tools Hub", href: "/tools" },
              { title: "About Us", href: "/about" },
              { title: "Contact Support", href: "/contact" },
              { title: "Blog Hub", href: "/blog" },
              { title: "Privacy Policy", href: "/privacy" },
              { title: "Terms of Service", href: "/terms" },
              { title: "XML Sitemap", href: "/sitemap.xml" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center font-medium text-xs text-zinc-800 dark:text-zinc-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
