import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User, Wrench, ArrowRight } from "lucide-react";
import HoverFooter from "@/src/components/ui/hover-footer";
import Header from "@/src/components/Header";
import { BLOG_POSTS } from "@/src/lib/blogs";
import { TOOLS } from "@/src/types";
import { SITE_NAME, SITE_URL } from "@/src/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
};

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-zinc-950 dark:text-zinc-50">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-[var(--accent-primary)] font-mono text-xs rounded border border-zinc-200 dark:border-zinc-700">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function parseMarkdownToReact(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let inList = false;

  const flushList = (key: string | number) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc pl-5 space-y-4 my-6 text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
          {currentList}
        </ul>
      );
      currentList = [];
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(idx);
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList(idx);
      elements.push(
        <h3 key={idx} className="text-xl sm:text-2xl font-black font-display mt-8 mb-4 text-zinc-950 dark:text-white tracking-tight">
          {parseInlineMarkdown(trimmed.replace("### ", ""))}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList(idx);
      elements.push(
        <h2 key={idx} className="text-2xl sm:text-3xl font-black font-display mt-10 mb-4 text-zinc-950 dark:text-white tracking-tight">
          {parseInlineMarkdown(trimmed.replace("## ", ""))}
        </h2>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      inList = true;
      const cleanLine = trimmed.replace(/^[-*]\s+/, "");
      currentList.push(
        <li key={idx} className="leading-relaxed">
          {parseInlineMarkdown(cleanLine)}
        </li>
      );
    } else {
      flushList(idx);
      elements.push(
        <p key={idx} className="text-sm sm:text-base text-zinc-650 dark:text-zinc-300 leading-relaxed my-4">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  flushList("end");
  return elements;
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
    return { title: "Post Not Found - Yuitility" };
  }

  const ogImageUrl = `/brand/yuitility-logo.png`;

  return {
    title: `${post.title} - Yuitility Guide`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} - Yuitility Guide`,
      description: post.description,
      images: [ogImageUrl],
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

  const relatedGuides = BLOG_POSTS
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => (a.category === post.category ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans relative overflow-hidden flex flex-col justify-between">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none -z-10" />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${SITE_URL}/blog/${post.slug}`,
            },
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              "@type": "Person",
              name: post.author,
            },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/brand/yuitility-logo.png`,
              },
            },
            url: `${SITE_URL}/blog/${post.slug}`,
            inLanguage: "en-US",
            keywords: post.keywords.join(", "),
          }),
        }}
      />

      <Header />

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-28 pb-16 sm:pt-36 sm:pb-24 flex-1 space-y-12">
        {/* Back navigation */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[var(--accent-primary)] dark:text-zinc-400 dark:hover:text-[var(--accent-primary)] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal
        </Link>

        {/* Split Grid Layout for Premium Editorial feel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left panel: Meta details & Tool promotion */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            {/* Meta details list */}
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-xs text-zinc-650 dark:text-zinc-400 font-medium">
                <User className="w-4 h-4 text-zinc-400 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Author</p>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-200">{post.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-650 dark:text-zinc-400 font-medium">
                <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Published</p>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-200">{formatDate(post.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-650 dark:text-zinc-400 font-medium">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-400">Read Time</p>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-200">{post.readTime}</p>
                </div>
              </div>
            </div>

            {/* Premium Integrated Tool Promotion */}
            {linkedTool && (
              <div className="relative p-6 bg-zinc-900 text-white rounded-3xl overflow-hidden border border-zinc-800 shadow-xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-glow)] via-transparent to-transparent opacity-60 pointer-events-none" />
                <div className="relative z-10 space-y-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-[var(--accent-primary)] bg-[var(--accent-glow)] px-2 py-0.5 rounded border border-[var(--accent-primary)]/20">Interactive Tool</span>
                    <h3 className="text-base font-bold mt-2.5">{linkedTool.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">{linkedTool.description}</p>
                  </div>
                  <Link
                    href={`/tools/${linkedTool.id}`}
                    className="w-full py-2.5 bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Wrench className="w-4 h-4 text-zinc-800" /> Open Tool Now
                  </Link>
                </div>
              </div>
            )}
          </aside>

          {/* Right panel: Header & Main Article Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-8">
              <div className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-wider">
                {post.category}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-[1.1] text-zinc-950 dark:text-white">
                {post.title}
              </h1>
            </div>

            <article className="max-w-none text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed space-y-6">
              {parseMarkdownToReact(post.content)}
            </article>
          </div>
        </div>

        {/* Related Guides Section */}
        {relatedGuides.length > 0 && (
          <section className="pt-16 border-t border-zinc-200/60 dark:border-zinc-800/60 mt-16 animate-card-reveal" style={{ animationDelay: "150ms" }}>
            <h2 className="text-2xl font-black font-display text-zinc-950 dark:text-white mb-6">Related Guides & Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/blog/${guide.slug}`}
                  className="group p-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl hover:border-[var(--accent-primary)]/45 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-wider">{guide.category}</span>
                    <h3 className="text-base font-bold text-zinc-950 dark:text-white group-hover:text-[var(--accent-primary)] transition-colors leading-snug">{guide.title}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">{guide.description}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform">
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer actions */}
        <div className="pt-12 border-t border-zinc-200/60 dark:border-zinc-800/60 text-center space-y-4 max-w-2xl mx-auto">
          <p className="text-xs text-zinc-500 font-medium">Enjoyed this article? Share it with colleagues or try out our 140+ free browser tools.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs rounded-xl shadow-lg shadow-[var(--accent-glow)] transition-all"
          >
            Explore All Tools
          </Link>
        </div>
      </main>
      <HoverFooter />
    </div>
  );
}
