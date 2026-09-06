import React, { useState } from 'react';
import { Copy, Check, Sparkles, Binary } from 'lucide-react';

interface FactorialCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

function countTrailingZeros(n: number): number {
  let count = 0;
  for (let i = 5; Math.floor(n / i) >= 1; i *= 5) {
    count += Math.floor(n / i);
  }
  return count;
}

export default function FactorialCalculator({ onCopy }: FactorialCalculatorProps) {
  const [nVal, setNVal] = useState<string>('20');
  const [copied, setCopied] = useState<boolean>(false);

  const n = parseInt(nVal, 10);
  const isValid = !isNaN(n) && n >= 0 && n <= 1000;

  const result = (() => {
    if (!isValid) return null;
    let fact = 1n;
    for (let i = 2n; i <= BigInt(n); i++) {
      fact *= i;
    }

    // Double factorial: n!!
    let doubleFact = 1n;
    for (let i = BigInt(n); i >= 2n; i -= 2n) {
      doubleFact *= i;
    }

    const str = fact.toString();
    const digits = str.length;
    const trailingZeros = countTrailingZeros(n);

    // Scientific notation representation
    let sci = '';
    if (digits > 1) {
      sci = `${str[0]}.${str.slice(1, 5)} × 10^${digits - 1}`;
    } else {
      sci = str;
    }

    return {
      exact: str,
      doubleFact: doubleFact.toString(),
      digits,
      trailingZeros,
      scientific: sci,
    };
  })();

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.exact);
    setCopied(true);
    if (onCopy) onCopy(result.exact);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-200">
            Enter Non-Negative Integer (n!)
          </label>
          <div className="flex gap-2 text-xs">
            {[5, 10, 20, 50, 100].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setNVal(preset.toString())}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition font-mono"
              >
                {preset}!
              </button>
            ))}
          </div>
        </div>

        <input
          type="number"
          min="0"
          max="1000"
          value={nVal}
          onChange={(e) => setNVal(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-2xl font-bold font-mono text-white focus:outline-none focus:border-indigo-500"
        />

        {!isValid && (
          <p className="text-xs text-rose-400">Please enter an integer between 0 and 1,000.</p>
        )}
      </div>

      {result && (
        <div className="space-y-4">
          {/* Main Card */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Factorial Result: {n}!
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Exact Value'}
              </button>
            </div>

            <div className="font-mono text-xl sm:text-2xl font-bold text-white break-all my-3 max-h-48 overflow-y-auto p-3 bg-slate-950 rounded-xl border border-slate-800">
              {result.exact}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
              <span>Scientific: <strong className="text-slate-200">{result.scientific}</strong></span>
              <span>Total Digits: <strong className="text-emerald-400">{result.digits}</strong></span>
              <span>Trailing Zeros: <strong className="text-cyan-400">{result.trailingZeros}</strong></span>
            </div>
          </div>

          {/* Double Factorial Card */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex items-center justify-between font-mono text-xs">
            <div>
              <span className="text-slate-500 block">Double Factorial: {n}!!</span>
              <span className="text-base font-bold text-slate-200 break-all">{result.doubleFact}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
