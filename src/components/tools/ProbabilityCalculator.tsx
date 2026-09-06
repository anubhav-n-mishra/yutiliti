import React, { useState } from 'react';
import { Percent, Copy, Check, Sparkles, HelpCircle } from 'lucide-react';

interface ProbabilityCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function ProbabilityCalculator({ onCopy }: ProbabilityCalculatorProps) {
  // Single Event
  const [favorable, setFavorable] = useState<string>('3');
  const [total, setTotal] = useState<string>('6');

  // Two Events
  const [probA, setProbA] = useState<string>('0.5');
  const [probB, setProbB] = useState<string>('0.25');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyVal = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    if (onCopy) onCopy(val);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Single event computation
  const single = (() => {
    const fav = parseFloat(favorable);
    const tot = parseFloat(total);
    if (isNaN(fav) || isNaN(tot) || tot <= 0 || fav < 0 || fav > tot) return null;

    const p = fav / tot;
    const pNot = 1 - p;
    const pct = p * 100;
    const oddsFor = `${fav} : ${tot - fav}`;
    const oddsAgainst = `${tot - fav} : ${fav}`;

    return {
      p,
      pNot,
      pct,
      oddsFor,
      oddsAgainst,
    };
  })();

  // Two event computation (assuming independent)
  const two = (() => {
    const a = parseFloat(probA);
    const b = parseFloat(probB);
    if (isNaN(a) || isNaN(b) || a < 0 || a > 1 || b < 0 || b > 1) return null;

    const pAnd = a * b;
    const pOr = a + b - pAnd;
    const pANotB = a * (1 - b);
    const pBNotA = b * (1 - a);
    const pNeither = (1 - a) * (1 - b);

    return {
      pAnd,
      pOr,
      pANotB,
      pBNotA,
      pNeither,
    };
  })();

  return (
    <div className="space-y-6">
      {/* Single Event Probability */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-semibold text-white mb-1">Single Event Probability</h3>
        <p className="text-xs text-slate-400 mb-4">
          Calculate the likelihood of a single outcome (e.g. rolling a specific number on a die).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-xs text-slate-300 block mb-1">Favorable Outcomes (A)</label>
            <input
              type="number"
              min="0"
              value={favorable}
              onChange={(e) => setFavorable(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1">Total Possible Outcomes (S)</label>
            <input
              type="number"
              min="1"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {single && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-slate-500 block mb-1">Probability P(A)</span>
              <span className="text-xl font-bold text-indigo-400">{single.p.toFixed(4)}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{single.pct.toFixed(2)}%</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-slate-500 block mb-1">Complement P(A&apos;)</span>
              <span className="text-xl font-bold text-rose-400">{single.pNot.toFixed(4)}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{(single.pNot * 100).toFixed(2)}%</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-slate-500 block mb-1">Odds in Favor</span>
              <span className="text-base font-bold text-emerald-400">{single.oddsFor}</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-slate-500 block mb-1">Odds Against</span>
              <span className="text-base font-bold text-amber-400">{single.oddsAgainst}</span>
            </div>
          </div>
        )}
      </div>

      {/* Two Independent Events */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-semibold text-white mb-1">Two Independent Events: P(A) & P(B)</h3>
        <p className="text-xs text-slate-400 mb-4">
          Calculate joint, union, and exclusive compound probabilities for two separate events.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-xs text-slate-300 block mb-1">Probability of Event A: P(A)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={probA}
              onChange={(e) => setProbA(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1">Probability of Event B: P(B)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={probB}
              onChange={(e) => setProbB(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {two && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-slate-500 block mb-1">Both Occur: P(A ∩ B)</span>
              <span className="text-lg font-bold text-cyan-400">{two.pAnd.toFixed(4)}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{(two.pAnd * 100).toFixed(2)}%</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-slate-500 block mb-1">At Least One: P(A ∪ B)</span>
              <span className="text-lg font-bold text-emerald-400">{two.pOr.toFixed(4)}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{(two.pOr * 100).toFixed(2)}%</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-slate-500 block mb-1">Neither Occurs: P(A&apos; ∩ B&apos;)</span>
              <span className="text-lg font-bold text-rose-400">{two.pNeither.toFixed(4)}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{(two.pNeither * 100).toFixed(2)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
