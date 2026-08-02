import React, { useState, useMemo } from 'react';
import { Calculator, RefreshCw, Hash } from 'lucide-react';

interface MeanCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function MeanCalculator({ onCopy }: MeanCalculatorProps) {
  const [inputText, setInputText] = useState<string>('10, 15, 20, 25, 30, 35, 40');

  const stats = useMemo(() => {
    const numbers = inputText
      .split(/[\s,;\n]+/)
      .map((v) => parseFloat(v.trim()))
      .filter((v) => !isNaN(v));

    if (numbers.length === 0) return null;

    const count = numbers.length;
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / count;

    // Geometric Mean (only valid if all numbers > 0)
    let geometricMean: number | null = null;
    if (numbers.every((n) => n > 0)) {
      const logSum = numbers.reduce((acc, n) => acc + Math.log(n), 0);
      geometricMean = Math.exp(logSum / count);
    }

    // Harmonic Mean (only valid if all numbers > 0)
    let harmonicMean: number | null = null;
    if (numbers.every((n) => n > 0)) {
      const recipSum = numbers.reduce((acc, n) => acc + 1 / n, 0);
      harmonicMean = count / recipSum;
    }

    // Variance & Standard Deviation
    const sqDiffs = numbers.map((n) => Math.pow(n - mean, 2));
    const popVariance = sqDiffs.reduce((acc, v) => acc + v, 0) / count;
    const sampleVariance = count > 1 ? sqDiffs.reduce((acc, v) => acc + v, 0) / (count - 1) : popVariance;
    const stdDev = Math.sqrt(sampleVariance);

    return {
      count,
      sum: sum.toFixed(2),
      mean: mean.toFixed(4),
      geometricMean: geometricMean ? geometricMean.toFixed(4) : 'N/A (Requires > 0)',
      harmonicMean: harmonicMean ? harmonicMean.toFixed(4) : 'N/A (Requires > 0)',
      sampleVariance: sampleVariance.toFixed(4),
      stdDev: stdDev.toFixed(4),
    };
  }, [inputText]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <Calculator className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Input Dataset
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Numbers (Separated by commas or spaces)
            </label>
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. 10, 15, 20, 25, 30"
              className="w-full rounded-xl border border-zinc-300 bg-white p-3 font-mono text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {stats ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Arithmetic Mean (Average)</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {stats.mean}
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Sum = {stats.sum} across {stats.count} values</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Geometric Mean</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{stats.geometricMean}</div>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Harmonic Mean</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{stats.harmonicMean}</div>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Std Deviation (s)</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{stats.stdDev}</div>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Variance (s²)</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{stats.sampleVariance}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`Arithmetic Mean: ${stats.mean} | Sum: ${stats.sum} | Count: ${stats.count}`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Mean Results
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Enter numbers above to compute mean.</div>
          )}
        </div>
      </div>
    </div>
  );
}
