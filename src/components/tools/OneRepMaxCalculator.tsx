import React, { useState } from 'react';
import { Dumbbell, Copy, Check, Table } from 'lucide-react';

interface OneRepMaxCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function OneRepMaxCalculator({ onCopy }: OneRepMaxCalculatorProps) {
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [liftWeight, setLiftWeight] = useState<string>('100');
  const [reps, setReps] = useState<string>('5');
  const [copied, setCopied] = useState<boolean>(false);

  const w = parseFloat(liftWeight);
  const r = parseInt(reps, 10);

  const isValid = !isNaN(w) && !isNaN(r) && w > 0 && r >= 1 && r <= 30;

  const results = (() => {
    if (!isValid) return null;
    if (r === 1) {
      return {
        epley: w,
        brzycki: w,
        lombardi: w,
        average: w,
      };
    }

    const epley = w * (1 + r / 30);
    const brzycki = w * (36 / (37 - r));
    const lombardi = w * Math.pow(r, 0.1);
    const oconner = w * (1 + 0.025 * r);

    const average = Math.round((epley + brzycki + lombardi + oconner) / 4);

    return {
      epley: Math.round(epley),
      brzycki: Math.round(brzycki),
      lombardi: Math.round(lombardi),
      average,
    };
  })();

  // Percentage table
  const percentages = [95, 90, 85, 80, 75, 70, 65, 60, 50].map((pct) => ({
    pct,
    weight: results ? Math.round((results.average * pct) / 100) : 0,
    repsRange:
      pct >= 95
        ? '1 – 2 reps'
        : pct >= 90
        ? '3 – 4 reps'
        : pct >= 85
        ? '5 – 6 reps'
        : pct >= 80
        ? '7 – 8 reps'
        : pct >= 75
        ? '9 – 10 reps'
        : pct >= 70
        ? '11 – 12 reps'
        : '15+ reps',
  }));

  const handleCopy = () => {
    if (!results) return;
    const text = `Estimated 1RM: ${results.average} ${unit} (Tested: ${liftWeight} ${unit} × ${reps} reps)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400">
          <Dumbbell className="w-5 h-5" />
          <span className="text-sm font-semibold text-white">One Rep Max (1RM) Estimator</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUnit('kg')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              unit === 'kg' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            kg
          </button>
          <button
            type="button"
            onClick={() => setUnit('lbs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              unit === 'lbs' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            lbs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Enter Working Set</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Weight Lifted ({unit})</label>
              <input
                type="number"
                value={liftWeight}
                onChange={(e) => setLiftWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-base"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Reps Performed (1-30)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-base"
              />
            </div>
          </div>

          {results && (
            <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-4 border-t border-slate-800">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">Epley</span>
                <span className="text-white font-bold">{results.epley} {unit}</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">Brzycki</span>
                <span className="text-white font-bold">{results.brzycki} {unit}</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">Lombardi</span>
                <span className="text-white font-bold">{results.lombardi} {unit}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
              Estimated Consensus 1RM
            </span>
            <div className="text-5xl font-black font-mono text-white my-2">
              {results ? `${results.average} ${unit}` : '—'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Based on performing {liftWeight} {unit} for {reps} repetition{parseInt(reps, 10) > 1 ? 's' : ''}.
            </p>
          </div>

          {results && (
            <button
              type="button"
              onClick={handleCopy}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy 1RM Result'}
            </button>
          )}
        </div>
      </div>

      {/* Percentage Reps Table */}
      {results && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 bg-slate-950 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Table className="w-4 h-4 text-indigo-400" /> Training Percentages & Rep Ranges
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-mono">
              <thead className="bg-slate-950/60 text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-6 py-2.5">% 1RM</th>
                  <th className="px-6 py-2.5">Weight ({unit})</th>
                  <th className="px-6 py-2.5">Estimated Rep Capacity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {percentages.map((row) => (
                  <tr key={row.pct} className="hover:bg-slate-900/40">
                    <td className="px-6 py-2.5 text-indigo-400 font-bold">{row.pct}%</td>
                    <td className="px-6 py-2.5 text-white font-bold">{row.weight} {unit}</td>
                    <td className="px-6 py-2.5 text-slate-400">{row.repsRange}</td>
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
