import React, { useState } from 'react';
import { PieChart, Copy, Check, Utensils } from 'lucide-react';

interface MacroRatioCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

type PresetDiet = 'balanced' | 'highProtein' | 'keto' | 'endurance' | 'custom';

export default function MacroRatioCalculator({ onCopy }: MacroRatioCalculatorProps) {
  const [calories, setCalories] = useState<string>('2200');
  const [preset, setPreset] = useState<PresetDiet>('balanced');
  const [carbsPct, setCarbsPct] = useState<number>(40);
  const [proteinPct, setProteinPct] = useState<number>(30);
  const [fatPct, setFatPct] = useState<number>(30);
  const [mealsCount, setMealsCount] = useState<number>(4);
  const [copied, setCopied] = useState<boolean>(false);

  const applyPreset = (p: PresetDiet) => {
    setPreset(p);
    if (p === 'balanced') {
      setCarbsPct(40);
      setProteinPct(30);
      setFatPct(30);
    } else if (p === 'highProtein') {
      setCarbsPct(30);
      setProteinPct(45);
      setFatPct(25);
    } else if (p === 'keto') {
      setCarbsPct(5);
      setProteinPct(25);
      setFatPct(70);
    } else if (p === 'endurance') {
      setCarbsPct(60);
      setProteinPct(20);
      setFatPct(20);
    }
  };

  const totalCalories = parseFloat(calories);
  const totalPct = carbsPct + proteinPct + fatPct;

  const results = (() => {
    if (isNaN(totalCalories) || totalCalories <= 500) return null;

    const carbCals = (carbsPct / 100) * totalCalories;
    const proteinCals = (proteinPct / 100) * totalCalories;
    const fatCals = (fatPct / 100) * totalCalories;

    const carbGrams = Math.round(carbCals / 4);
    const proteinGrams = Math.round(proteinCals / 4);
    const fatGrams = Math.round(fatCals / 9);

    return {
      carbGrams,
      proteinGrams,
      fatGrams,
      perMealCarbs: Math.round(carbGrams / mealsCount),
      perMealProtein: Math.round(proteinGrams / mealsCount),
      perMealFat: Math.round(fatGrams / mealsCount),
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `Daily Macros (${calories} kcal): ${results.proteinGrams}g Protein, ${results.carbGrams}g Carbs, ${results.fatGrams}g Fat (${mealsCount} meals: ~${results.perMealProtein}g P / ${results.perMealCarbs}g C / ${results.perMealFat}g F per meal)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Presets */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        {[
          { id: 'balanced', label: 'Balanced (40/30/30)' },
          { id: 'highProtein', label: 'High Protein Cut (30/45/25)' },
          { id: 'keto', label: 'Keto / Low Carb (5/25/70)' },
          { id: 'endurance', label: 'Endurance (60/20/20)' },
          { id: 'custom', label: 'Custom' },
        ].map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => applyPreset(d.id as PresetDiet)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              preset === d.id
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-1 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Calorie & Macro Targets</h3>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Target Calories (kcal/day)</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-base focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Protein ({proteinPct}%)</span>
                <span className="font-mono text-indigo-400">4 kcal / g</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={proteinPct}
                onChange={(e) => {
                  setPreset('custom');
                  setProteinPct(parseInt(e.target.value, 10));
                }}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Carbohydrates ({carbsPct}%)</span>
                <span className="font-mono text-cyan-400">4 kcal / g</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={carbsPct}
                onChange={(e) => {
                  setPreset('custom');
                  setCarbsPct(parseInt(e.target.value, 10));
                }}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Fats ({fatPct}%)</span>
                <span className="font-mono text-amber-400">9 kcal / g</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={fatPct}
                onChange={(e) => {
                  setPreset('custom');
                  setFatPct(parseInt(e.target.value, 10));
                }}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="flex justify-between text-xs font-mono pt-1">
              <span className="text-slate-500">Total Split:</span>
              <span className={totalPct === 100 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {totalPct}% {totalPct !== 100 && '(must equal 100%)'}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Meals Per Day</label>
            <div className="flex gap-2">
              {[3, 4, 5, 6].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMealsCount(m)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                    mealsCount === m ? 'bg-slate-700 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {m} meals
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Macro Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                Protein ({proteinPct}%)
              </span>
              <div className="text-4xl font-extrabold font-mono text-white my-1">
                {results ? `${results.proteinGrams}g` : '—'}
              </div>
              <span className="text-xs text-slate-500 font-mono">
                ~{results ? results.perMealProtein : 0}g / meal
              </span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                Carbohydrates ({carbsPct}%)
              </span>
              <div className="text-4xl font-extrabold font-mono text-white my-1">
                {results ? `${results.carbGrams}g` : '—'}
              </div>
              <span className="text-xs text-slate-500 font-mono">
                ~{results ? results.perMealCarbs : 0}g / meal
              </span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                Dietary Fats ({fatPct}%)
              </span>
              <div className="text-4xl font-extrabold font-mono text-white my-1">
                {results ? `${results.fatGrams}g` : '—'}
              </div>
              <span className="text-xs text-slate-500 font-mono">
                ~{results ? results.perMealFat : 0}g / meal
              </span>
            </div>
          </div>

          {/* Visual Proportion Bar */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-xs text-slate-400 block">Caloric Ratio Breakdown</span>
            <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden flex">
              <div className="bg-indigo-500 h-full" style={{ width: `${proteinPct}%` }} title="Protein" />
              <div className="bg-cyan-500 h-full" style={{ width: `${carbsPct}%` }} title="Carbs" />
              <div className="bg-amber-500 h-full" style={{ width: `${fatPct}%` }} title="Fats" />
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Protein
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" /> Carbs
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Fats
              </span>
            </div>
          </div>

          {results && (
            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Macronutrient Plan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
