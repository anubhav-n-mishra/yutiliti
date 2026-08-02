import React, { useState, useMemo } from 'react';
import { Binary, RefreshCw, Copy, Check, Hash } from 'lucide-react';

interface MedianCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function MedianCalculator({ onCopy }: MedianCalculatorProps) {
  const [inputText, setInputText] = useState<string>('12, 5, 22, 30, 7, 18, 14, 42');

  const stats = useMemo(() => {
    const rawNumbers = inputText
      .split(/[\s,;\n]+/)
      .map((v) => parseFloat(v.trim()))
      .filter((v) => !isNaN(v));

    if (rawNumbers.length === 0) return null;

    const sorted = [...rawNumbers].sort((a, b) => a - b);
    const count = sorted.length;

    let median = 0;
    let medianSteps = '';

    if (count % 2 === 1) {
      const midIdx = Math.floor(count / 2);
      median = sorted[midIdx];
      medianSteps = `Middle element at position ${midIdx + 1}: ${median}`;
    } else {
      const mid1 = sorted[count / 2 - 1];
      const mid2 = sorted[count / 2];
      median = (mid1 + mid2) / 2;
      medianSteps = `Average of middle elements at positions ${count / 2} and ${count / 2 + 1}: (${mid1} + ${mid2}) / 2 = ${median}`;
    }

    const min = sorted[0];
    const max = sorted[count - 1];
    const range = max - min;

    // Quartiles
    const calcQuartile = (q: number) => {
      const pos = (count - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;
      if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
      }
      return sorted[base];
    };

    const q1 = calcQuartile(0.25);
    const q3 = calcQuartile(0.75);
    const iqr = q3 - q1;

    return {
      count,
      median,
      medianSteps,
      sorted: sorted.join(', '),
      min,
      max,
      range,
      q1: q1.toFixed(2),
      q3: q3.toFixed(2),
      iqr: iqr.toFixed(2),
    };
  }, [inputText]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <Hash className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Input Dataset
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Numbers (Separated by commas, spaces, or newlines)
            </label>
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. 10, 20, 15, 40, 25"
              className="w-full rounded-xl border border-zinc-300 bg-white p-3 font-mono text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setInputText('12, 5, 22, 30, 7, 18, 14, 42')}
              className="text-xs text-blue-600 hover:underline dark:text-cyan-400"
            >
              Load Example
            </button>
            <span className="text-xs text-zinc-400">·</span>
            <button
              type="button"
              onClick={() => setInputText('')}
              className="text-xs text-zinc-500 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {stats ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Median Value</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {stats.median}
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{stats.medianSteps}</p>
              </div>

              <div className="space-y-2 rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                <div className="text-xs text-zinc-500">Sorted Dataset ({stats.count} items)</div>
                <div className="max-h-20 overflow-y-auto font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  {stats.sorted}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg bg-white p-2.5 shadow-sm dark:bg-zinc-800">
                  <div className="text-zinc-500">Min / Max</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{stats.min} / {stats.max}</div>
                </div>
                <div className="rounded-lg bg-white p-2.5 shadow-sm dark:bg-zinc-800">
                  <div className="text-zinc-500">Range</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{stats.range}</div>
                </div>
                <div className="rounded-lg bg-white p-2.5 shadow-sm dark:bg-zinc-800">
                  <div className="text-zinc-500">IQR (Q3-Q1)</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{stats.iqr}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`Median: ${stats.median} | Sorted: [${stats.sorted}]`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Median Result
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Enter numbers above to compute median.</div>
          )}
        </div>
      </div>
    </div>
  );
}
