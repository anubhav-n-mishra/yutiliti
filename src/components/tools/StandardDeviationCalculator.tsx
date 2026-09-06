import React, { useState } from 'react';
import { Sigma, Copy, Check, Sparkles, HelpCircle } from 'lucide-react';

interface StandardDeviationCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

const SAMPLE_VALUES = '10, 12, 23, 23, 16, 23, 21, 16';

export default function StandardDeviationCalculator({ onCopy }: StandardDeviationCalculatorProps) {
  const [inputData, setInputData] = useState<string>(SAMPLE_VALUES);
  const [copied, setCopied] = useState<boolean>(false);

  const numbers = inputData
    .split(/[\s,;\n\t]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !isNaN(n));

  const n = numbers.length;

  const stats = (() => {
    if (n === 0) return null;

    const sum = numbers.reduce((acc, v) => acc + v, 0);
    const mean = sum / n;

    // Squared deviations
    const deviations = numbers.map((x) => {
      const dev = x - mean;
      return { x, dev, devSq: dev * dev };
    });

    const sumDevSq = deviations.reduce((acc, d) => acc + d.devSq, 0);

    // Population stats (div by n)
    const popVariance = sumDevSq / n;
    const popStdDev = Math.sqrt(popVariance);

    // Sample stats (div by n - 1)
    const sampleVariance = n > 1 ? sumDevSq / (n - 1) : 0;
    const sampleStdDev = n > 1 ? Math.sqrt(sampleVariance) : 0;

    // Standard Error of Mean
    const standardError = n > 0 ? sampleStdDev / Math.sqrt(n) : 0;

    return {
      sum,
      mean,
      deviations,
      sumDevSq,
      popVariance,
      popStdDev,
      sampleVariance,
      sampleStdDev,
      standardError,
    };
  })();

  const handleCopy = () => {
    if (!stats) return;
    const text = `Sample Std Dev (s): ${stats.sampleStdDev.toFixed(4)}\nPopulation Std Dev (σ): ${stats.popStdDev.toFixed(4)}\nMean (μ): ${stats.mean.toFixed(4)}\nSample Variance (s²): ${stats.sampleVariance.toFixed(4)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-200">
            Enter Numbers (comma, space, or line separated)
          </label>
          <button
            type="button"
            onClick={() => setInputData(SAMPLE_VALUES)}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
          >
            <Sparkles className="w-3.5 h-3.5" /> Sample Set
          </button>
        </div>

        <textarea
          rows={3}
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder="e.g. 10, 12, 23, 23, 16, 23, 21, 16"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Main Results Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sample Standard Deviation Card (Most commonly needed) */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Sample Standard Deviation (s)
                </span>
                <span className="text-xs font-mono text-slate-500">n - 1 divisor</span>
              </div>

              <div className="text-4xl font-extrabold font-mono text-white my-2">
                {stats.sampleStdDev.toFixed(4)}
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Used when your data represents a <em>sample</em> taken from a broader population.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400 font-mono">
                <div className="flex justify-between">
                  <span>Sample Variance (s²):</span>
                  <span className="text-slate-200">{stats.sampleVariance.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Std Error of Mean (SE):</span>
                  <span className="text-slate-200">{stats.standardError.toFixed(4)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Summary' : 'Copy All Stats'}
            </button>
          </div>

          {/* Population Standard Deviation Card */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Population Standard Deviation (σ)
                </span>
                <span className="text-xs font-mono text-slate-500">N divisor</span>
              </div>

              <div className="text-4xl font-extrabold font-mono text-white my-2">
                {stats.popStdDev.toFixed(4)}
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Used when your dataset represents the <em>entire complete population</em>.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400 font-mono">
                <div className="flex justify-between">
                  <span>Population Variance (σ²):</span>
                  <span className="text-slate-200">{stats.popVariance.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mean (μ):</span>
                  <span className="text-slate-200">{stats.mean.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Count (N):</span>
                  <span className="text-slate-200">{n}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step-by-Step Deviations Breakdown */}
      {stats && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sigma className="w-4 h-4 text-indigo-400" /> Calculation Steps & Deviations
            </h3>
            <span className="text-xs font-mono text-slate-400">Sum of (x - μ)² = {stats.sumDevSq.toFixed(4)}</span>
          </div>

          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-slate-950/60 text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-6 py-2.5">i</th>
                  <th className="px-6 py-2.5">xᵢ</th>
                  <th className="px-6 py-2.5">(xᵢ - μ)</th>
                  <th className="px-6 py-2.5">(xᵢ - μ)²</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats.deviations.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-900/40">
                    <td className="px-6 py-2 text-slate-500">{i + 1}</td>
                    <td className="px-6 py-2 text-white font-semibold">{row.x}</td>
                    <td className="px-6 py-2 text-slate-300">
                      {row.dev >= 0 ? `+${row.dev.toFixed(4)}` : row.dev.toFixed(4)}
                    </td>
                    <td className="px-6 py-2 text-indigo-300">{row.devSq.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
