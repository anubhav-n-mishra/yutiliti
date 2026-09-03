import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Activity, Calculator, FileText, Image as ImageIcon, Code, Palette, Repeat, ShieldCheck, Zap, Box, LayoutGrid } from "lucide-react";
import { CATEGORIES } from "@/src/types";
import { getToolById, isToolLive, liveToolsInCategory } from "@/src/lib/toolRegistry";
import { absoluteUrl, CATEGORY_META, SITE_NAME, SITE_URL, toolPath } from "@/src/lib/site";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  finance: Calculator,
  utility: Box,
  developer: Code,
  pdf: FileText,
  media: ImageIcon,
  math: Calculator,
  health: Activity,
  conversion: Repeat,
};

function getCategoryTools(category: string) {
  return liveToolsInCategory(category);
}

export function generateStaticParams() {
  return CATEGORIES.filter((c) => c.id !== "all").map((cat) => ({ slug: cat.id }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.id === slug);
  if (!category) return {};

  const tools = getCategoryTools(slug);
  const meta = CATEGORY_META[slug];
  const title = meta?.title ?? `${category.label} | ${SITE_NAME}`;
  const description =
    meta?.description ??
    `${category.label} tools that run entirely in your browser. Nothing you open or type is uploaded.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/category/${slug}`,
    },
    // A category with no live tools would be an empty listing page. Keep it
    // reachable but out of the index until it has something to list.
    robots: tools.length > 0 ? { index: true, follow: true } : { index: false, follow: true },
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
  };
}

const categorySchema = (slug: string, tools: ReturnType<typeof getCategoryTools>) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: CATEGORY_META[slug]?.name ?? slug,
  description: CATEGORY_META[slug]?.description,
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
      { "@type": "ListItem", position: 1, name: "All tools", item: absoluteUrl("/tools") },
      { "@type": "ListItem", position: 2, name: CATEGORY_META[slug]?.name ?? slug, item: absoluteUrl(`/category/${slug}`) },
    ],
  },
});

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.id === slug);

  if (!category) notFound();

  const tools = getCategoryTools(slug);
  const Icon = categoryIcons[slug] || Box;
  const meta = CATEGORY_META[slug];
  const siblings = CATEGORIES.filter(
    (c) => c.id !== "all" && c.id !== slug && liveToolsInCategory(c.id).length > 0,
  );

  // Large categories are rendered as named sub-clusters rather than one long
  // grid, so the page reads as a topic rather than an inventory.
  const rawGroups = meta?.groups
    ?.map((g) => ({
      ...g,
      tools: g.toolIds.filter(isToolLive).map(getToolById).filter((t): t is NonNullable<typeof t> => Boolean(t)),
    }))
    .filter((g) => g.tools.length > 0);
  const groups = rawGroups && rawGroups.length > 0 ? rawGroups : null;
  const groupedIds = new Set(groups?.flatMap((g) => g.tools.map((t) => t.id)) ?? []);
  // Anything not named in a group still gets listed - nothing is dropped.
  const ungrouped = tools.filter((t) => !groupedIds.has(t.id));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema(slug, tools)) }}
      />
      <div className="min-h-screen bg-white dark:bg-zinc-950">
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
              <Link href="/tools" className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-cyan-300">
                <LayoutGrid className="h-3.5 w-3.5" />
                All tools
              </Link>
              <span aria-hidden="true">/</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{meta?.name ?? category.label}</span>
            </nav>

            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center rounded-2xl bg-blue-100 p-3 dark:bg-blue-900/30">
                <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                  {meta?.name ?? category.label}
                </h1>
                <p className="mt-2 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-2xl">
                  {meta?.description}
                </p>
              </div>
            </div>
          </div>

          {meta?.intro && (
            <p className="-mt-6 mb-10 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
              {meta.intro}
            </p>
          )}

          {groups && (
            <div className="space-y-14">
              {groups.map((group) => (
                <section key={group.name} aria-labelledby={`group-${group.name}`}>
                  <div className="max-w-3xl">
                    <h2
                      id={`group-${group.name}`}
                      className="font-display text-2xl font-bold tracking-tight text-zinc-950 dark:text-white"
                    >
                      {group.name}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {group.blurb}
                    </p>
                  </div>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {group.tools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={toolPath(tool.id)}
                        className="group relative flex flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-cyan-500/60"
                      >
                        <h3 className="font-display font-bold text-zinc-950 group-hover:text-blue-600 dark:text-white dark:group-hover:text-cyan-300 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                          {tool.description}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-cyan-300">
                          Open the {tool.title.toLowerCase()} <span aria-hidden="true">&rarr;</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {(!groups || ungrouped.length > 0) && (
          <section aria-labelledby="tools-heading" className={groups ? "mt-14" : undefined}>
            <h2 id="tools-heading" className={groups ? "font-display text-2xl font-bold tracking-tight text-zinc-950 dark:text-white mb-6" : "sr-only"}>
              {groups ? "Everything else in this category" : `${meta?.name ?? category.label} tools`}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(groups ? ungrouped : tools).map((tool) => (
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
          )}

          <section className="mt-16 border-t border-zinc-200 pt-10 dark:border-zinc-800">
            <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Other tool categories
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {siblings.map((sib) => (
                <Link
                  key={sib.id}
                  href={`/category/${sib.id}`}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-blue-300 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-cyan-500/60 dark:hover:text-cyan-300"
                >
                  {CATEGORY_META[sib.id]?.name ?? sib.label}
                  <span className="ml-1.5 text-xs font-normal text-zinc-400">
                    {liveToolsInCategory(sib.id).length}
                  </span>
                </Link>
              ))}
            </div>
            <p className="mt-5 text-sm text-zinc-500 dark:text-zinc-400">
              Or see{" "}
              <Link href="/tools" className="font-semibold text-blue-600 hover:underline dark:text-cyan-300">
                every Yuitility tool on one page
              </Link>
              .
            </p>
          </section>

          <section className="mt-16 rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto max-w-3xl text-center">
              <ShieldCheck className="mx-auto h-10 w-10 text-blue-600 dark:text-cyan-300" />
              <h2 className="mt-4 font-display text-2xl font-bold text-zinc-950 dark:text-white">
                Local-first by design
              </h2>
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