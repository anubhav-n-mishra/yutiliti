import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/src/components/Header";
import HoverFooter from "@/src/components/ui/hover-footer";
import { CATEGORIES } from "@/src/types";
import { LIVE_TOOLS, liveToolsInCategory } from "@/src/lib/toolRegistry";
import { absoluteUrl, CATEGORY_META, SITE_NAME, SITE_URL, toolPath } from "@/src/lib/site";

/**
 * Crawlable hub for the whole tool corpus.
 *
 * The homepage renders its grid client-side with 24-per-page pagination and
 * click handlers rather than anchors, so before this page existed most tool
 * pages had no internal link from anywhere except their category page. This
 * page is the internal-linking backbone: one server-rendered anchor per live
 * tool, grouped by topic, with the tool's own description as context.
 */

export const metadata: Metadata = {
  title: "All Yuitility Tools, Grouped by What They Do | Yuitility",
  description:
    "Every working Yuitility tool in one list: finance calculators, PDF and image utilities, developer tools and everyday converters. All of them run in your browser.",
  alternates: { canonical: "/tools" },
};

const orderedCategories = CATEGORIES.filter((c) => c.id !== "all").filter(
  (c) => liveToolsInCategory(c.id).length > 0,
);

export default function ToolsIndexPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Yuitility tools",
    url: absoluteUrl("/tools"),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: LIVE_TOOLS.length,
      itemListElement: LIVE_TOOLS.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(toolPath(tool.id)),
        name: tool.title,
      })),
    },
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-28 pb-16 sm:px-6 sm:pt-36">
        <header className="max-w-3xl">
          <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
            All {LIVE_TOOLS.length} Yuitility tools
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Every tool listed here is built and working. They all run inside your browser tab:
            files you open and numbers you type are processed on your own device and are never
            uploaded to a server.
          </p>
        </header>

        <nav aria-label="Jump to category" className="mt-8 flex flex-wrap gap-2">
          {orderedCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm font-semibold transition hover:border-blue-300 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-cyan-500/60 dark:hover:text-cyan-300"
            >
              {CATEGORY_META[cat.id]?.name ?? cat.label}
              <span className="ml-1.5 text-xs font-normal text-zinc-400">
                {liveToolsInCategory(cat.id).length}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-14 space-y-14">
          {orderedCategories.map((cat) => {
            const tools = liveToolsInCategory(cat.id);
            const meta = CATEGORY_META[cat.id];
            return (
              <section key={cat.id} id={cat.id} aria-labelledby={`heading-${cat.id}`}>
                <div className="max-w-3xl border-b border-zinc-200 pb-5 dark:border-zinc-800">
                  <h2 id={`heading-${cat.id}`} className="font-display text-2xl font-bold tracking-tight">
                    <Link href={`/category/${cat.id}`} className="hover:text-blue-600 dark:hover:text-cyan-300">
                      {meta?.name ?? cat.label}
                    </Link>
                  </h2>
                  {meta && (
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {meta.intro}
                    </p>
                  )}
                </div>

                <ul className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.map((tool) => (
                    <li key={tool.id}>
                      <Link
                        href={toolPath(tool.id)}
                        className="group block rounded-2xl p-3 -m-3 transition hover:bg-white dark:hover:bg-zinc-900"
                      >
                        <span className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-cyan-300">
                          {tool.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                          {tool.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </main>

      <HoverFooter />
    </div>
  );
}
