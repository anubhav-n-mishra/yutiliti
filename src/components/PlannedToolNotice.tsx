import Link from "next/link";
import { Wrench, ArrowRight } from "lucide-react";
import { Tool } from "@/src/types";
import Header from "@/src/components/Header";
import HoverFooter from "@/src/components/ui/hover-footer";
import { getCategoryName, toolPath } from "@/src/lib/site";

/**
 * Shown for tools that are listed but not yet built.
 *
 * The previous behaviour rendered a generic "Primary Value (X) x Secondary
 * Parameter (Y)" widget on ~48 pages that advertised specific calculators.
 * That is a broken promise to the searcher, and the pages are noindexed for
 * exactly that reason. This page says so plainly and sends the visitor to
 * something that works instead of wasting the click.
 */
export default function PlannedToolNotice({
  tool,
  alternatives,
}: {
  tool: Tool;
  alternatives: Tool[];
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col justify-between">
      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-28 pb-16 sm:px-6 sm:pt-36">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/tools" className="hover:text-blue-600 dark:hover:text-cyan-300">All tools</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/category/${tool.category}`} className="hover:text-blue-600 dark:hover:text-cyan-300">
            {getCategoryName(tool.category)}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-zinc-800 dark:text-zinc-100">{tool.title}</span>
        </nav>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20 sm:p-8">
          <Wrench className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight">
            {tool.title} is not built yet
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            This tool is on our roadmap but has no working implementation yet, so there is
            nothing here for you to use. We would rather tell you that than show you a
            placeholder that pretends to calculate something.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {tool.description}
          </p>
        </div>

        {alternatives.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold tracking-tight">
              Working {getCategoryName(tool.category).toLowerCase()} tools you can use now
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {alternatives.map((alt) => (
                <Link
                  key={alt.id}
                  href={toolPath(alt.id)}
                  className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-cyan-500/60"
                >
                  <h3 className="font-display font-bold group-hover:text-blue-600 dark:group-hover:text-cyan-300">
                    {alt.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {alt.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-cyan-300">
                    Open tool <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="mt-10 text-sm text-zinc-500 dark:text-zinc-400">
          Looking for something else? Browse{" "}
          <Link href="/tools" className="font-semibold text-blue-600 hover:underline dark:text-cyan-300">
            every working tool on Yuitility
          </Link>
          .
        </p>
      </main>

      <HoverFooter />
    </div>
  );
}
