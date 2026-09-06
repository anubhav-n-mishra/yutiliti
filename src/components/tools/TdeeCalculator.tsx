import React, { useState } from 'react';
import { Flame, Copy, Check, PieChart, Activity } from 'lucide-react';

interface TdeeCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function TdeeCalculator({ onCopy }: TdeeCalculatorProps) {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('26');
  const [weight, setWeight] = useState<string>('72');
  const [height, setHeight] = useState<string>('178');
  const [activity, setActivity] = useState<number>(1.55); // Moderate
  const [bodyFat, setBodyFat] = useState<string>('18');
  const [copied, setCopied] = useState<boolean>(false);

  const wKg = unit === 'metric' ? parseFloat(weight) : parseFloat(weight) * 0.45359237;
  const hCm = unit === 'metric' ? parseFloat(height) : parseFloat(height) * 2.54;
  const ageYears = parseFloat(age);
  const bf = parseFloat(bodyFat);

  const isValid = !isNaN(wKg) && !isNaN(hCm) && !isNaN(ageYears) && wKg > 20 && hCm > 80;

  const results = (() => {
    if (!isValid) return null;

    // 1. Mifflin - St Jeor
    let bmrMifflin = 10 * wKg + 6.25 * hCm - 5 * ageYears;
    bmrMifflin += gender === 'male' ? 5 : -161;

    // 2. Katch-McArdle (if body fat valid)
    let bmrKatch: number | null = null;
    if (!isNaN(bf) && bf > 3 && bf < 60) {
      const lbmKg = wKg * (1 - bf / 100);
      bmrKatch = 370 + 21.6 * lbmKg;
    }

    // 3. Harris - Benedict
    let bmrHarris = 0;
    if (gender === 'male') {
      bmrHarris = 88.362 + 13.397 * wKg + 4.799 * hCm - 5.677 * ageYears;
    } else {
      bmrHarris = 447.593 + 9.247 * wKg + 3.098 * hCm - 4.33 * ageYears;
    }

    const tdeeMifflin = Math.round(bmrMifflin * activity);
    const tdeeKatch = bmrKatch ? Math.round(bmrKatch * activity) : null;
    const tdeeHarris = Math.round(bmrHarris * activity);

    // Component breakdown of TDEE
    const bmrFinal = Math.round(bmrMifflin);
    const tef = Math.round(tdeeMifflin * 0.1); // ~10% thermic effect of food
    const neat = Math.round(tdeeMifflin * 0.15); // NEAT
    const eat = Math.max(0, tdeeMifflin - bmrFinal - tef - neat); // Exercise

    return {
      tdee: tdeeMifflin,
      bmr: bmrFinal,
      tef,
      neat,
      eat,
      tdeeKatch,
      tdeeHarris,
      cut: tdeeMifflin - 500,
      bulk: tdeeMifflin + 500,
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `TDEE: ${results.tdee} kcal/day (BMR: ${results.bmr} kcal, Cut: ${results.cut} kcal, Bulk: ${results.bulk} kcal)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Unit & Gender Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGender('male')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
              gender === 'male' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Male
          </button>
          <button
            type="button"
            onClick={() => setGender('female')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
              gender === 'female' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Female
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUnit('metric')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              unit === 'metric' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Metric (kg, cm)
          </button>
          <button
            type="button"
            onClick={() => setUnit('imperial')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              unit === 'imperial' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Imperial (lbs, in)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-1 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Body Parameters</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Body Fat % (opt)</label>
              <input
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Weight ({unit === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Height ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Activity Multiplier</label>
            <select
              value={activity}
              onChange={(e) => setActivity(parseFloat(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
            >
              <option value="1.2">Sedentary: Desk job, little exercise</option>
              <option value="1.375">Light: 1-2 workouts / week</option>
              <option value="1.55">Moderate: 3-5 workouts / week</option>
              <option value="1.725">Heavy: 6-7 intense workouts / week</option>
              <option value="1.9">Athlete: 2x daily training or manual labor</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                Total Daily Energy Expenditure (TDEE)
              </span>
              <div className="text-5xl font-black font-mono text-white my-2">
                {results ? `${results.tdee.toLocaleString()} kcal` : '—'}
                <span className="text-sm font-normal text-slate-400"> / day</span>
              </div>

              {results && (
                <div className="grid grid-cols-3 gap-3 font-mono text-xs mt-4 pt-4 border-t border-slate-800">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-500 block text-[10px]">Basal Metabolic Rate</span>
                    <span className="text-base font-bold text-slate-200">{results.bmr} kcal</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-500 block text-[10px]">Fat Loss Target (-500)</span>
                    <span className="text-base font-bold text-emerald-400">{results.cut} kcal</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-500 block text-[10px]">Muscle Gain Target (+500)</span>
                    <span className="text-base font-bold text-amber-400">{results.bulk} kcal</span>
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
                {copied ? 'Copied' : 'Copy TDEE Summary'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
