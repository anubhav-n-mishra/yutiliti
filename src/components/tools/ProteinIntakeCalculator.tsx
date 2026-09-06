import React, { useState } from 'react';
import { Dumbbell, Copy, Check, UtensilsCrossed } from 'lucide-react';

interface ProteinIntakeCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

type Goal = 'sedentary' | 'moderate' | 'hypertrophy' | 'cutting';

export default function ProteinIntakeCalculator({ onCopy }: ProteinIntakeCalculatorProps) {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState<string>('75');
  const [goal, setGoal] = useState<Goal>('hypertrophy');
  const [copied, setCopied] = useState<boolean>(false);

  const wKg = unit === 'metric' ? parseFloat(weight) : parseFloat(weight) * 0.45359237;

  const results = (() => {
    if (isNaN(wKg) || wKg <= 20) return null;

    let minFactor = 0.8;
    let maxFactor = 1.0;
    let goalName = '';

    if (goal === 'sedentary') {
      minFactor = 0.8;
      maxFactor = 1.0;
      goalName = 'Sedentary / RDA Minimum';
    } else if (goal === 'moderate') {
      minFactor = 1.2;
      maxFactor = 1.6;
      goalName = 'Active / Fitness Maintenance';
    } else if (goal === 'hypertrophy') {
      minFactor = 1.6;
      maxFactor = 2.2;
      goalName = 'Muscle Growth & Hypertrophy';
    } else if (goal === 'cutting') {
      minFactor = 2.0;
      maxFactor = 2.6;
      goalName = 'Fat Loss with Muscle Retention';
    }

    const minGrams = Math.round(wKg * minFactor);
    const maxGrams = Math.round(wKg * maxFactor);
    const avgGrams = Math.round((minGrams + maxGrams) / 2);

    // Food equivalents for avgGrams
    const chickenBreastGrams = Math.round((avgGrams / 31) * 100); // 31g P / 100g cooked chicken breast
    const eggsCount = Math.round(avgGrams / 6.3); // ~6.3g P per large egg
    const wheyScoops = (avgGrams / 25).toFixed(1); // 25g P per scoop

    return {
      minGrams,
      maxGrams,
      avgGrams,
      goalName,
      perMeal: Math.round(avgGrams / 4),
      chickenBreastGrams,
      eggsCount,
      wheyScoops,
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `Recommended Daily Protein: ${results.minGrams}g – ${results.maxGrams}g (${results.goalName})`;
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
          <span className="text-sm font-semibold text-white">Daily Protein Requirements</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUnit('metric')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              unit === 'metric' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Metric (kg)
          </button>
          <button
            type="button"
            onClick={() => setUnit('imperial')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              unit === 'imperial' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Imperial (lbs)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Inputs */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Bodyweight & Goal</h3>

          <div>
            <label className="text-xs text-slate-300 block mb-1">
              Body Weight ({unit === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-2xl font-bold font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-2">Training Goal</label>
            <div className="space-y-2">
              {[
                { id: 'sedentary', label: 'Sedentary / Baseline Health', desc: '0.8 – 1.0 g / kg' },
                { id: 'moderate', label: 'Active Lifestyle / Cardio', desc: '1.2 – 1.6 g / kg' },
                { id: 'hypertrophy', label: 'Muscle Building & Hypertrophy', desc: '1.6 – 2.2 g / kg' },
                { id: 'cutting', label: 'Deficit / Fat Loss (Muscle Spared)', desc: '2.0 – 2.6 g / kg' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id as Goal)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    goal === g.id
                      ? 'border-indigo-500 bg-indigo-950/40 text-white'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs">{g.label}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{g.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
              Recommended Daily Target Range
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono text-white my-2">
              {results ? `${results.minGrams}g – ${results.maxGrams}g` : '—'}
            </div>
            <span className="text-xs text-slate-500 font-mono block">
              Optimal midpoint: ~{results ? results.avgGrams : 0}g/day (or ~{results ? results.perMeal : 0}g across 4 meals)
            </span>

            {results && (
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5">
                <span className="text-xs font-semibold text-slate-300 block flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-indigo-400" /> Whole Food Equivalents ({results.avgGrams}g)
                </span>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-500 text-[10px] block">Chicken Breast</span>
                    <span className="text-white font-bold">{results.chickenBreastGrams}g</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-500 text-[10px] block">Whole Eggs</span>
                    <span className="text-white font-bold">{results.eggsCount} eggs</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-500 text-[10px] block">Whey Scoops</span>
                    <span className="text-white font-bold">{results.wheyScoops} scoops</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {results && (
            <button
              type="button"
              onClick={handleCopy}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Protein Plan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
