import { AlertTriangle, FunctionSquare, Lightbulb, ListChecks } from "lucide-react";
import { Tool } from "@/src/types";
import type { DeepContent } from "@/src/lib/toolDeepContent";

/**
 * The "information gain" block: the formula, a checked worked example, the
 * mistakes that change the answer, and the edge cases competing pages skip.
 *
 * This is the section that makes the page worth ranking rather than merely
 * relevant. It is not padding — if there is nothing specific to say about a
 * tool, it gets no entry in toolDeepContent.ts and this component does not
 * render at all.
 */
export default function ToolDeepDive({ tool, deep }: { tool: Tool; deep: DeepContent }) {
  return (
    <section className="mt-12" aria-labelledby="deep-dive-heading">
      <h2
        id="deep-dive-heading"
        className="font-display text-2xl font-bold tracking-tight text-zinc-950 dark:text-white"
      >
        The maths behind the {tool.title.toLowerCase()}
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        So you can check the result rather than take it on trust.
      </p>

      <div className="mt-6 space-y-6">
        {deep.formula && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
            <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-300">
              <FunctionSquare className="h-5 w-5" />
              <h3 className="font-display text-lg font-bold">The formula</h3>
            </div>
            <p className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-mono text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
              {deep.formula.expression}
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {deep.formula.where.map((line) => (
                <li key={line} className="flex gap-2">
                  <span aria-hidden="true" className="text-zinc-400">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {deep.workedExample && (
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-cyan-950/20 sm:p-8">
            <div className="flex items-center gap-2 text-blue-700 dark:text-cyan-300">
              <ListChecks className="h-5 w-5" />
              <h3 className="font-display text-lg font-bold">Worked example</h3>
            </div>
            <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
              {deep.workedExample.scenario}
            </p>

            <dl className="mt-5 divide-y divide-blue-200/60 rounded-2xl border border-blue-200/70 bg-white/70 dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/50">
              {deep.workedExample.steps.map((step) => (
                <div key={step.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{step.label}</dt>
                  <dd className="font-mono text-sm text-zinc-900 dark:text-zinc-100 sm:text-right">{step.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 text-base font-bold leading-relaxed text-zinc-950 dark:text-white">
              {deep.workedExample.result}
            </p>

            <div className="mt-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                {deep.workedExample.takeaway}
              </p>
            </div>
          </div>
        )}

        {deep.pitfalls && deep.pitfalls.length > 0 && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-display text-lg font-bold">Where this calculation usually goes wrong</h3>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {deep.pitfalls.map((p) => (
                <div key={p.title}>
                  <h4 className="text-sm font-bold text-zinc-950 dark:text-white">{p.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {deep.edgeCases && deep.edgeCases.length > 0 && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
            <h3 className="font-display text-lg font-bold text-zinc-950 dark:text-white">Edge cases worth knowing</h3>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {deep.edgeCases.map((e) => (
                <div key={e.title}>
                  <h4 className="text-sm font-bold text-zinc-950 dark:text-white">{e.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{e.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {deep.statutoryReferences && deep.statutoryReferences.length > 0 && (
          <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 p-6 dark:border-emerald-900/40 dark:from-zinc-900 dark:via-zinc-950 dark:to-emerald-950/20 sm:p-8">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <h3 className="font-display text-lg font-bold text-zinc-950 dark:text-white">
                Statutory Authorities &amp; Official References
              </h3>
            </div>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
              Regulatory standards, published statutory gazettes, and official research governing this computation.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {deep.statutoryReferences.map((ref) => (
                <a
                  key={ref.title}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-emerald-200/70 bg-white/80 p-4 transition hover:border-emerald-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-emerald-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {ref.authority}
                    </span>
                    <svg className="h-3.5 w-3.5 text-zinc-400 group-hover:text-emerald-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <h4 className="mt-1.5 text-sm font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400 leading-snug">
                    {ref.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                    {ref.citation}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

        {deep.assumptionNote && (
          <p className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-xs leading-relaxed text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <strong className="font-semibold text-zinc-700 dark:text-zinc-300">Note on assumptions:</strong>{" "}
            Figures used in the worked example above are illustrative planning assumptions, not current
            official rates. Check the applicable rate for your own situation before relying on the result.
          </p>
        )}
      </div>
    </section>
  );
}
