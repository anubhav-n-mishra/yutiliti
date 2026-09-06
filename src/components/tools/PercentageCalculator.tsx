import React, { useState } from 'react';
import { Percent, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';

interface PercentageCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function PercentageCalculator({ onCopy }: PercentageCalculatorProps) {
  // Mode 1: What is X% of Y?
  const [m1X, setM1X] = useState<string>('15');
  const [m1Y, setM1Y] = useState<string>('240');

  // Mode 2: X is what percent of Y?
  const [m2X, setM2X] = useState<string>('45');
  const [m2Y, setM2Y] = useState<string>('180');

  // Mode 3: Percentage increase / decrease from X to Y
  const [m3X, setM3X] = useState<string>('120');
  const [m3Y, setM3Y] = useState<string>('150');

  // Mode 4: Add / Subtract X% from Y
  const [m4X, setM4X] = useState<string>('18');
  const [m4Y, setM4Y] = useState<string>('250');
  const [m4Op, setM4Op] = useState<'add' | 'sub'>('add');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyVal = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    if (onCopy) onCopy(val);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Calculations
  const r1 = (() => {
    const x = parseFloat(m1X);
    const y = parseFloat(m1Y);
    if (isNaN(x) || isNaN(y)) return null;
    const res = (x / 100) * y;
    return { val: res.toLocaleString(undefined, { maximumFractionDigits: 4 }), num: res };
  })();

  const r2 = (() => {
    const x = parseFloat(m2X);
    const y = parseFloat(m2Y);
    if (isNaN(x) || isNaN(y) || y === 0) return null;
    const res = (x / y) * 100;
    return { val: res.toLocaleString(undefined, { maximumFractionDigits: 4 }), num: res };
  })();

  const r3 = (() => {
    const x = parseFloat(m3X);
    const y = parseFloat(m3Y);
    if (isNaN(x) || isNaN(y) || x === 0) return null;
    const diff = y - x;
    const pct = (diff / Math.abs(x)) * 100;
    const isIncrease = diff >= 0;
    return {
      val: Math.abs(pct).toLocaleString(undefined, { maximumFractionDigits: 4 }),
      isIncrease,
      diff: diff.toLocaleString(undefined, { maximumFractionDigits: 4 }),
    };
  })();

  const r4 = (() => {
    const x = parseFloat(m4X);
    const y = parseFloat(m4Y);
    if (isNaN(x) || isNaN(y)) return null;
    const delta = (x / 100) * y;
    const final = m4Op === 'add' ? y + delta : y - delta;
    return {
      val: final.toLocaleString(undefined, { maximumFractionDigits: 4 }),
      delta: delta.toLocaleString(undefined, { maximumFractionDigits: 4 }),
    };
  })();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: What is X% of Y? */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-indigo-400">
              <Percent className="w-5 h-5" />
              <h3 className="font-semibold text-white">What is X% of Y?</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Calculate tax, tips, or fractional proportions.</p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1">
                <label className="text-xs text-slate-400 block mb-1">Percentage (X%)</label>
                <input
                  type="number"
                  value={m1X}
                  onChange={(e) => setM1X(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <span className="text-slate-500 font-bold mt-5">% of</span>
              <div className="flex-1">
                <label className="text-xs text-slate-400 block mb-1">Total Value (Y)</label>
                <input
                  type="number"
                  value={m1Y}
                  onChange={(e) => setM1Y(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Result</span>
              <span className="text-xl font-bold font-mono text-white">{r1 ? r1.val : '—'}</span>
            </div>
            {r1 && (
              <button
                type="button"
                onClick={() => copyVal(r1.val, 'm1')}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
              >
                {copiedId === 'm1' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Card 2: X is what % of Y? */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-cyan-400">
              <Percent className="w-5 h-5" />
              <h3 className="font-semibold text-white">X is what % of Y?</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Find marks percentage, discount shares, or progress.</p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1">
                <label className="text-xs text-slate-400 block mb-1">Part Value (X)</label>
                <input
                  type="number"
                  value={m2X}
                  onChange={(e) => setM2X(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <span className="text-slate-500 font-bold mt-5">is % of</span>
              <div className="flex-1">
                <label className="text-xs text-slate-400 block mb-1">Whole Value (Y)</label>
                <input
                  type="number"
                  value={m2Y}
                  onChange={(e) => setM2Y(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Result</span>
              <span className="text-xl font-bold font-mono text-cyan-400">{r2 ? `${r2.val}%` : '—'}</span>
            </div>
            {r2 && (
              <button
                type="button"
                onClick={() => copyVal(`${r2.val}%`, 'm2')}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
              >
                {copiedId === 'm2' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Card 3: Percentage Change (Increase / Decrease) */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-emerald-400">
              <Percent className="w-5 h-5" />
              <h3 className="font-semibold text-white">Percentage Increase / Decrease</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Calculate growth rate, price hike, or loss percent.</p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1">
                <label className="text-xs text-slate-400 block mb-1">Initial Value (X)</label>
                <input
                  type="number"
                  value={m3X}
                  onChange={(e) => setM3X(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 mt-5 shrink-0" />
              <div className="flex-1">
                <label className="text-xs text-slate-400 block mb-1">Final Value (Y)</label>
                <input
                  type="number"
                  value={m3Y}
                  onChange={(e) => setM3Y(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Rate of Change</span>
              <span className={`text-xl font-bold font-mono ${r3?.isIncrease ? 'text-emerald-400' : 'text-rose-400'}`}>
                {r3 ? `${r3.isIncrease ? '+' : '-'}${r3.val}%` : '—'}
              </span>
              {r3 && <span className="text-xs text-slate-400 block mt-0.5">Absolute difference: {r3.diff}</span>}
            </div>
            {r3 && (
              <button
                type="button"
                onClick={() => copyVal(`${r3.isIncrease ? '+' : '-'}${r3.val}%`, 'm3')}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
              >
                {copiedId === 'm3' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Card 4: Add / Subtract Percentage */}
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-amber-400">
              <Percent className="w-5 h-5" />
              <h3 className="font-semibold text-white">Add or Subtract %</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Calculate final price with sales tax, VAT, or markdown.</p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1">
                <label className="text-xs text-slate-400 block mb-1">Base Price / Value (Y)</label>
                <input
                  type="number"
                  value={m4Y}
                  onChange={(e) => setM4Y(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="w-20">
                <label className="text-xs text-slate-400 block mb-1">Action</label>
                <select
                  value={m4Op}
                  onChange={(e) => setM4Op(e.target.value as 'add' | 'sub')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="add">+ Add</option>
                  <option value="sub">- Sub</option>
                </select>
              </div>
              <div className="w-24">
                <label className="text-xs text-slate-400 block mb-1">% Rate (X)</label>
                <input
                  type="number"
                  value={m4X}
                  onChange={(e) => setM4X(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Final Total</span>
              <span className="text-xl font-bold font-mono text-amber-400">{r4 ? r4.val : '—'}</span>
              {r4 && <span className="text-xs text-slate-400 block mt-0.5">{m4Op === 'add' ? 'Added' : 'Deducted'}: {r4.delta}</span>}
            </div>
            {r4 && (
              <button
                type="button"
                onClick={() => copyVal(r4.val, 'm4')}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
              >
                {copiedId === 'm4' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
