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
