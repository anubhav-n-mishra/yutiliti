import React, { useState } from 'react';
import { Layers, Copy, Check, Calculator, Sparkles } from 'lucide-react';

interface PermutationCombinationCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

// Factorial using BigInt
function bigFactorial(n: bigint): bigint {
  let res = 1n;
  for (let i = 2n; i <= n; i++) {
    res *= i;
  }
  return res;
}

// nPr = n! / (n-r)!
function bigNPr(n: bigint, r: bigint): bigint {
  if (r < 0n || r > n) return 0n;
  let res = 1n;
  for (let i = n; i > n - r; i--) {
    res *= i;
  }
  return res;
}

// nCr = n! / (r! * (n-r)!)
function bigNCr(n: bigint, r: bigint): bigint {
  if (r < 0n || r > n) return 0n;
  if (r === 0n || r === n) return 1n;
  const k = r > n - r ? n - r : r;
  let num = 1n;
  let den = 1n;
  for (let i = 1n; i <= k; i++) {
    num *= n - (k - i);
    den *= i;
  }
  return num / den;
}

export default function PermutationCombinationCalculator({ onCopy }: PermutationCombinationCalculatorProps) {
  const [nVal, setNVal] = useState<string>('8');
  const [rVal, setRVal] = useState<string>('3');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const n = parseInt(nVal, 10);
  const r = parseInt(rVal, 10);

  const isValid = !isNaN(n) && !isNaN(r) && n >= 0 && r >= 0 && r <= n && n <= 500;

  const results = (() => {
    if (!isValid) return null;
    const bn = BigInt(n);
    const br = BigInt(r);

    const nPr = bigNPr(bn, br);
    const nCr = bigNCr(bn, br);

    // Repetition
    let nPowR: bigint | null = null;
    try {
      if (n <= 100 && r <= 100) {
        nPowR = bn ** br;
      }
    } catch {
      nPowR = null;
    }

    // Combination with repetition: (n+r-1)! / (r! * (n-1)!)
    let nCrRep: bigint | null = null;
    if (n > 0) {
      nCrRep = bigNCr(bn + br - 1n, br);
    }

    return {
      nPr: nPr.toString(),
      nCr: nCr.toString(),
      nPowR: nPowR ? nPowR.toString() : '—',
      nCrRep: nCrRep ? nCrRep.toString() : '—',
    };
  })();

  const copyVal = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    if (onCopy) onCopy(val);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-white">Enter Set Size (n) and Subset Selection (r)</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1">Total Items in Set (n)</label>
            <input
              type="number"
              min="0"
              max="500"
              value={nVal}
              onChange={(e) => setNVal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1">Items to Choose (r)</label>
            <input
              type="number"
              min="0"
              max={nVal}
              value={rVal}
              onChange={(e) => setRVal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {!isValid && (
          <p className="text-xs text-rose-400">
            Ensure 0 ≤ r ≤ n (and n ≤ 500 for high-precision computation).
          </p>
        )}
      </div>

      {/* Main Results Grid */}
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Combinations nCr */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Combinations (nCr) — Order Does NOT Matter
                </span>
                <span className="text-xs font-mono text-slate-500">C({n}, {r})</span>
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white my-3 break-all">
                {results.nCr}
              </div>

              <p className="text-xs text-slate-400">
                Formula: <code className="text-indigo-300 font-mono">n! / (r! × (n-r)!)</code>
              </p>

              <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>With Repetition Allowed:</span>
                  <span className="font-mono text-slate-200">{results.nCrRep}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyVal(results.nCr, 'ncr')}
              className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {copiedId === 'ncr' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedId === 'ncr' ? 'Copied' : 'Copy Combinations (nCr)'}
            </button>
          </div>

          {/* Permutations nPr */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Permutations (nPr) — Order DOES Matter
                </span>
                <span className="text-xs font-mono text-slate-500">P({n}, {r})</span>
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white my-3 break-all">
                {results.nPr}
              </div>

              <p className="text-xs text-slate-400">
                Formula: <code className="text-cyan-300 font-mono">n! / (n-r)!</code>
              </p>

              <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>With Repetition (nʳ):</span>
                  <span className="font-mono text-slate-200">{results.nPowR}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyVal(results.nPr, 'npr')}
              className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {copiedId === 'npr' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedId === 'npr' ? 'Copied' : 'Copy Permutations (nPr)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
