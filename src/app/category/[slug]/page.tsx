import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calculator, FileText, Image as ImageIcon, Code, Palette, ShieldCheck, Zap, Lock, Box, LayoutGrid } from "lucide-react";
import { TOOLS, CATEGORIES } from "@/src/types";
import { absoluteUrl, SITE_NAME, SITE_URL, toolPath } from "@/src/lib/site";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  finance: Calculator,
  utility: Box,
  developer: Code,
  pdf: FileText,
  media: ImageIcon,
};

const categoryDescriptions: Record<string, string> = {
  finance: "Free financial calculators for loans, investments, and wealth planning. All calculations run locally in your browser for complete privacy.",
  utility: "Essential browser utilities for everyday tasks — file conversion, text processing, QR codes, and more. No uploads, no tracking.",
  developer: "Developer and designer tools for JSON formatting, color palettes, code generation, and debugging. Works offline, zero setup.",
  pdf: "Complete PDF toolkit: merge, split, compress, watermark, extract metadata, convert images to PDF. 100% client-side processing.",
  media: "Image tools for compression, resizing, format conversion, background removal, collages, and social media optimization.",
};

function getCategoryTools(category: string) {
  return TOOLS.filter((tool) => tool.category === category && !tool.disabled);
}

export function generateStaticParams() {
  return CATEGORIES.filter((c) => c.id !== "all").map((cat) => ({ slug: cat.id }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.id === slug);
  if (!category) return {};

  const tools = getCategoryTools(slug);
  const title = `${category.label} — Free Online Tools | ${SITE_NAME}`;
  const description = categoryDescriptions[slug] || `Free ${category.label.toLowerCase()} tools that run entirely in your browser. No signup, no data upload, complete privacy.`;

  return {
    title,
    description,
    keywords: [
      `free ${category.label.toLowerCase()} tools`,
      `online ${category.label.toLowerCase()}`,
      `browser ${category.label.toLowerCase()}`,
      `private ${category.label.toLowerCase()}`,
      ...tools.flatMap((t) => [t.title.toLowerCase(), `${t.title.toLowerCase()} online`]),
    ],
    alternates: {
      canonical: `/category/${slug}`,
    },
    openGraph: {
      type: "website",
      url: absoluteUrl(`/category/${slug}`),
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: absoluteUrl("/brand/yuitility-logo.png"), alt: `${category.label} - ${SITE_NAME}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/brand/yuitility-logo.png")],
    },
    robots: { index: true, follow: true },
  };
}

const categorySchema = (slug: string, tools: ReturnType<typeof getCategoryTools>) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `${CATEGORIES.find((c) => c.id === slug)?.label} Tools`,
  description: categoryDescriptions[slug],
  url: absoluteUrl(`/category/${slug}`),
  isPartOf: {
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: tool.title,
        url: absoluteUrl(toolPath(tool.id)),
        description: tool.description,
        applicationCategory: "WebApplication",
        operatingSystem: "Web Browser",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
      },
    })),
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Free Online Tools", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 3, name: CATEGORIES.find((c) => c.id === slug)?.label, item: absoluteUrl(`/category/${slug}`) },
    ],
  },
});

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.id === slug);

  if (!category) notFound();

  const tools = getCategoryTools(slug);
  const Icon = categoryIcons[slug] || Box;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema(slug, tools)) }}
      />
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl sticky top-0 z-30">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE_NAME} home`}>
              <img src="/brand/yuitility-logo.png" alt="" className="h-9 w-9 object-contain" />
              <span className="font-display text-lg font-bold tracking-tight text-zinc-950 dark:text-white">{SITE_NAME}</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-12">
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <Link href="/" className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-cyan-300">
                <LayoutGrid className="h-3.5 w-3.5" />
                All tools
              </Link>
              <span aria-hidden="true">/</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{category.label}</span>
            </nav>

            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center rounded-2xl bg-blue-100 p-3 dark:bg-blue-900/30">
                <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                  {category.label}
                </h1>
                <p className="mt-2 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-2xl">
                  {categoryDescriptions[slug]}
                </p>
              </div>
            </div>
          </div>

          <section aria-labelledby="tools-heading">
            <h2 id="tools-heading" className="sr-only">
              {category.label} Tools
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <Link
                  key={tool.id}
                  href={toolPath(tool.id)}
                  className="group relative flex flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-cyan-500/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-zinc-950 group-hover:text-blue-600 dark:text-white dark:group-hover:text-cyan-300 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                      <Zap className="h-5 w-5 text-zinc-500 group-hover:text-blue-600 dark:text-zinc-400 dark:group-hover:text-cyan-300 transition-colors" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      <ShieldCheck className="h-3 w-3" />
                      Private
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 group-hover:text-blue-600 dark:text-zinc-400 dark:group-hover:text-cyan-300 transition-colors">
                      <Palette className="h-3.5 w-3.5" />
                      Free
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-16 rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto max-w-3xl text-center">
              <ShieldCheck className="mx-auto h-10 w-10 text-blue-600 dark:text-cyan-300" />
              <h3 className="mt-4 font-display text-2xl font-bold text-zinc-950 dark:text-white">
                Local-first by design
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
                Every tool on this page runs entirely in your browser. Your files and data never leave your device — no
                uploads, no server processing, no tracking. Works offline after first load.
              </p>
            </div>
          </section>
        </main>

        <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} {SITE_NAME} · Private, practical browser tools.
          </div>
        </footer>
      </div>
    </>
  );
}