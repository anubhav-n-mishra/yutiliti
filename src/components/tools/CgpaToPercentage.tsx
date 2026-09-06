import React, { useState } from 'react';
import { Award, Copy, Check, GraduationCap, Calculator } from 'lucide-react';

interface CgpaToPercentageProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

type FormulaType = 'cbse' | 'mumbai' | 'linear10' | 'linear4' | 'custom';

export default function CgpaToPercentage({ onCopy }: CgpaToPercentageProps) {
  const [cgpa, setCgpa] = useState<string>('8.4');
  const [formula, setFormula] = useState<FormulaType>('cbse');
  const [customMultiplier, setCustomMultiplier] = useState<string>('9.5');
  const [copied, setCopied] = useState<boolean>(false);

  const numCgpa = parseFloat(cgpa);

  let percentage: number | null = null;
  let formulaDisplay = '';

  if (!isNaN(numCgpa)) {
    if (formula === 'cbse') {
      percentage = numCgpa * 9.5;
      formulaDisplay = `${numCgpa} × 9.5 = ${percentage.toFixed(2)}%`;
    } else if (formula === 'mumbai') {
      percentage = (numCgpa - 0.75) * 10;
      formulaDisplay = `(${numCgpa} - 0.75) × 10 = ${percentage.toFixed(2)}%`;
    } else if (formula === 'linear10') {
      percentage = (numCgpa / 10) * 100;
      formulaDisplay = `(${numCgpa} / 10) × 100 = ${percentage.toFixed(2)}%`;
    } else if (formula === 'linear4') {
      percentage = (numCgpa / 4) * 100;
      formulaDisplay = `(${numCgpa} / 4) × 100 = ${percentage.toFixed(2)}%`;
    } else if (formula === 'custom') {
      const mult = parseFloat(customMultiplier);
      if (!isNaN(mult)) {
        percentage = numCgpa * mult;
        formulaDisplay = `${numCgpa} × ${mult} = ${percentage.toFixed(2)}%`;
      }
    }
  }

  // Division / Honors classification
  let division = '';
  let badgeColor = '';
  if (percentage !== null) {
    if (percentage >= 75) {
      division = 'First Class with Distinction';
      badgeColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
    } else if (percentage >= 60) {
      division = 'First Division / First Class';
      badgeColor = 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40';
    } else if (percentage >= 50) {
      division = 'Second Division';
      badgeColor = 'text-amber-400 border-amber-500/30 bg-amber-950/40';
    } else if (percentage >= 40) {
      division = 'Pass Class';
      badgeColor = 'text-orange-400 border-orange-500/30 bg-orange-950/40';
    } else {
      division = 'Needs Improvement';
      badgeColor = 'text-rose-400 border-rose-500/30 bg-rose-950/40';
    }
  }

  const handleCopy = () => {
    if (percentage === null) return;
    const text = `${percentage.toFixed(2)}% (CGPA: ${cgpa}, Division: ${division})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-2 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1">Enter your CGPA</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="e.g. 8.4"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-2xl font-bold font-mono text-white focus:outline-none focus:border-indigo-500"
              />
              <span className="absolute right-4 top-3.5 text-xs text-slate-500">Scale max 10.0</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Conversion Formula</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFormula('cbse')}
                className={`p-3 text-left rounded-xl border transition ${
                  formula === 'cbse'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold text-sm">CBSE & AICTE Standard</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">CGPA × 9.5</div>
              </button>

              <button
                type="button"
                onClick={() => setFormula('mumbai')}
                className={`p-3 text-left rounded-xl border transition ${
                  formula === 'mumbai'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold text-sm">Engineering / Mumbai / VTU</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">(CGPA - 0.75) × 10</div>
              </button>

              <button
                type="button"
                onClick={() => setFormula('linear10')}
                className={`p-3 text-left rounded-xl border transition ${
                  formula === 'linear10'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold text-sm">Linear 10-Point Scale</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">(CGPA / 10) × 100</div>
              </button>

              <button
                type="button"
                onClick={() => setFormula('custom')}
                className={`p-3 text-left rounded-xl border transition ${
                  formula === 'custom'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold text-sm">Custom Multiplier</div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">CGPA × Custom</div>
              </button>
            </div>
          </div>

          {formula === 'custom' && (
            <div>
              <label className="block text-xs text-slate-400 mb-1">Custom Multiplier Factor</label>
              <input
                type="number"
                step="0.1"
                value={customMultiplier}
                onChange={(e) => setCustomMultiplier(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          )}
        </div>

        {/* Right Output Card */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Equivalent Percentage</span>
              <Award className="w-5 h-5 text-indigo-400" />
            </div>

            <div className="text-5xl font-black font-mono text-indigo-400 tracking-tight my-2">
              {percentage !== null ? `${percentage.toFixed(2)}%` : '—'}
            </div>

            {formulaDisplay && (
              <div className="text-xs text-slate-400 font-mono bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 my-3">
                {formulaDisplay}
              </div>
            )}

            {division && (
              <div className={`mt-4 px-3 py-2 rounded-xl border text-xs font-semibold inline-block ${badgeColor}`}>
                {division}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={percentage === null}
            onClick={handleCopy}
            className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard' : 'Copy Result'}
          </button>
        </div>
      </div>

      {/* Quick Reference Conversion Table */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-indigo-400" /> CBSE 10-Point CGPA to Percentage Reference Table
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs font-mono">
          {[10.0, 9.5, 9.0, 8.5, 8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 5.0, 4.0].map((val) => (
            <div key={val} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 flex justify-between">
              <span className="text-slate-400">{val.toFixed(1)} CGPA</span>
              <span className="text-indigo-300 font-bold">{(val * 9.5).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
