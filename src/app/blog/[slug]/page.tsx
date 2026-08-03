import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User, Wrench, Share2 } from "lucide-react";
import HoverFooter from "@/src/components/ui/hover-footer";
import { BLOG_POSTS } from "@/src/lib/blogs";
import { TOOLS } from "@/src/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-zinc-950 dark:text-zinc-50">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-mono text-xs rounded border border-zinc-200 dark:border-zinc-700">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Post Not Found — Yuitility" };
  }

  return {
    title: `${post.title} — Yuitility Guide`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const linkedTool = post.toolId ? TOOLS.find((t) => t.id === post.toolId) : null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: {
              "@type": "Organization",
              name: post.author,
            },
          }),
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/blog" className="flex items-center gap-2 font-semibold text-sm text-zinc-600 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <Link href="/" className="font-display font-bold text-zinc-950 dark:text-white">
            Yuitility
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* Title Meta */}
        <div className="space-y-4">
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-800">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author}</div>
            <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</div>
            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</div>
          </div>
        </div>

        {/* Linked Tool Card */}
        {linkedTool && (
          <div className="p-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-3xl shadow-lg flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Interactive Tool</p>
              <h3 className="text-base font-bold">{linkedTool.title}</h3>
              <p className="text-xs text-blue-100 line-clamp-1 mt-0.5">{linkedTool.description}</p>
            </div>
            <Link
              href={`/tools/${linkedTool.id}`}
              className="px-4 py-2.5 bg-white text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-50 transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <Wrench className="w-4 h-4" /> Open Tool
            </Link>
          </div>
        )}

        {/* Article Markdown Body */}
        <article className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed space-y-5">
          {post.content.split("\n\n").map((block, idx) => {
            const trimmed = block.trim();
            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={idx} className="text-xl font-bold font-display mt-8 mb-3 text-zinc-950 dark:text-zinc-50">
                  {parseInlineMarkdown(trimmed.replace("### ", ""))}
                </h3>
              );
            }
            if (trimmed.startsWith("- ") || trimmed.includes("\n- ")) {
              const items = trimmed.split("\n").filter((line) => line.trim().startsWith("- "));
              return (
                <ul key={idx} className="list-disc pl-5 space-y-2.5 my-4 text-zinc-700 dark:text-zinc-300">
                  {items.map((item, i) => (
                    <li key={i} className="leading-relaxed">
                      {parseInlineMarkdown(item.replace(/^- /, ""))}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} className="leading-relaxed text-zinc-700 dark:text-zinc-300">
                {parseInlineMarkdown(trimmed)}
              </p>
            );
          })}
        </article>

        {/* Author Footer */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center space-y-3">
          <p className="text-xs text-zinc-500">Enjoyed this article? Share it with colleagues or try out our 152+ free browser tools.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-sm transition-all"
          >
            Explore All Tools
          </Link>
        </div>
      </main>
      <HoverFooter />
    </div>
  );
}
