import React, { useState } from 'react';
import { Percent, Copy, Check, Scale, ArrowRight } from 'lucide-react';

interface RatioProportionCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export default function RatioProportionCalculator({ onCopy }: RatioProportionCalculatorProps) {
  // Proportion A : B = C : D (Solve for D or any empty)
  const [propA, setPropA] = useState<string>('4');
  const [propB, setPropB] = useState<string>('5');
  const [propC, setPropC] = useState<string>('20');
  const [propD, setPropD] = useState<string>('');

  // Ratio Simplifier
  const [simpA, setSimpA] = useState<string>('24');
  const [simpB, setSimpB] = useState<string>('36');

  // Divide Total by Ratio
  const [totalSum, setTotalSum] = useState<string>('500');
  const [ratioParts, setRatioParts] = useState<string>('2 : 3 : 5');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyVal = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    if (onCopy) onCopy(val);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Solve Proportion A/B = C/D
  const solvedProportion = (() => {
    const a = parseFloat(propA);
    const b = parseFloat(propB);
    const c = parseFloat(propC);
    const d = parseFloat(propD);

    const emptyCount = [propA, propB, propC, propD].filter((s) => s.trim() === '').length;
    if (emptyCount !== 1) return null;

    let unknown = '';
    let answer = 0;

    if (propA.trim() === '' && !isNaN(b) && !isNaN(c) && !isNaN(d) && d !== 0) {
      unknown = 'A';
      answer = (b * c) / d;
    } else if (propB.trim() === '' && !isNaN(a) && !isNaN(c) && !isNaN(d) && c !== 0) {
      unknown = 'B';
      answer = (a * d) / c;
    } else if (propC.trim() === '' && !isNaN(a) && !isNaN(b) && !isNaN(d) && b !== 0) {
      unknown = 'C';
      answer = (a * d) / b;
    } else if (propD.trim() === '' && !isNaN(a) && !isNaN(b) && !isNaN(c) && a !== 0) {
      unknown = 'D';
      answer = (b * c) / a;
    } else {
      return null;
    }

    return { unknown, answer: Number(answer.toFixed(4)) };
  })();

  // Simplify Ratio
  const simplified = (() => {
    const a = parseFloat(simpA);
    const b = parseFloat(simpB);
    if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) return null;

    // Multiply up if decimals
    let mult = 1;
    while (!Number.isInteger(a * mult) || !Number.isInteger(b * mult)) {
      mult *= 10;
      if (mult > 10000) break;
    }
    const intA = Math.round(a * mult);
    const intB = Math.round(b * mult);
    const g = gcd(intA, intB);

    return {
      simplified: `${intA / g} : ${intB / g}`,
      decimal: (a / b).toFixed(4),
    };
  })();

  // Divide Total by Ratio
  const dividedResult = (() => {
    const sum = parseFloat(totalSum);
    if (isNaN(sum) || sum <= 0) return null;

    const parts = ratioParts
      .split(/[:,\s]+/)
      .map((p) => parseFloat(p))
      .filter((p) => !isNaN(p) && p > 0);

    if (parts.length < 2) return null;

    const totalRatio = parts.reduce((acc, p) => acc + p, 0);
    const shares = parts.map((p) => {
      const share = (p / totalRatio) * sum;
      return {
        part: p,
        share: Number(share.toFixed(2)),
        pct: ((p / totalRatio) * 100).toFixed(1),
      };
    });

    return { shares, totalRatio };
  })();

  return (
    <div className="space-y-6">
      {/* 1. Proportion Solver */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-semibold text-white mb-1">Proportion Solver (A : B = C : D)</h3>
        <p className="text-xs text-slate-400 mb-4">Leave any one box blank to solve for the missing term.</p>

        <div className="flex flex-wrap items-center gap-3 font-mono text-sm">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="A"
              value={propA}
              onChange={(e) => setPropA(e.target.value)}
              className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-center text-white focus:outline-none focus:border-indigo-500"
            />
            <span className="text-slate-500 font-bold">:</span>
            <input
              type="number"
              placeholder="B"
              value={propB}
              onChange={(e) => setPropB(e.target.value)}
              className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-center text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <span className="text-indigo-400 font-bold text-lg">=</span>

          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="C"
              value={propC}
              onChange={(e) => setPropC(e.target.value)}
              className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-center text-white focus:outline-none focus:border-indigo-500"
            />
            <span className="text-slate-500 font-bold">:</span>
            <input
              type="number"
              placeholder="D (blank)"
              value={propD}
              onChange={(e) => setPropD(e.target.value)}
              className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-center text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {solvedProportion && (
          <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Solved Missing Value</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {solvedProportion.unknown} = {solvedProportion.answer}
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyVal(solvedProportion.answer.toString(), 'prop')}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
            >
              {copiedId === 'prop' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Ratio Simplifier */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Simplify Ratio</h3>
            <p className="text-xs text-slate-400 mb-4">Reduce a 2-part ratio to simplest integer terms.</p>

            <div className="flex items-center gap-3 font-mono mb-4">
              <input
                type="number"
                value={simpA}
                onChange={(e) => setSimpA(e.target.value)}
                className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-center text-white"
              />
              <span className="text-slate-500 font-bold">:</span>
              <input
                type="number"
                value={simpB}
                onChange={(e) => setSimpB(e.target.value)}
                className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-center text-white"
              />
            </div>
          </div>

          {simplified && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Simplest Form</span>
                <span className="text-xl font-bold font-mono text-indigo-400">{simplified.simplified}</span>
              </div>
              <button
                type="button"
                onClick={() => copyVal(simplified.simplified, 'simp')}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
              >
                {copiedId === 'simp' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        {/* 3. Divide Sum by Ratio */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1">Divide Total by Ratio</h3>
            <p className="text-xs text-slate-400 mb-4">Split money, shares, or mixture parts proportionally.</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Total Amount</label>
                <input
                  type="number"
                  value={totalSum}
                  onChange={(e) => setTotalSum(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Ratio (e.g. 2 : 3 : 5)</label>
                <input
                  type="text"
                  value={ratioParts}
                  onChange={(e) => setRatioParts(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {dividedResult && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5 font-mono text-xs">
              {dividedResult.shares.map((s, idx) => (
                <div key={idx} className="flex justify-between items-center text-slate-300">
                  <span>Part {idx + 1} ({s.part} shares, {s.pct}%):</span>
                  <span className="font-bold text-white">{s.share}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
