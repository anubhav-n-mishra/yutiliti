import React, { useState } from 'react';
import { Flame, Copy, Check, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface DailyCalorieCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function DailyCalorieCalculator({ onCopy }: DailyCalorieCalculatorProps) {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('28');
  const [weight, setWeight] = useState<string>('70'); // kg or lbs
  const [height, setHeight] = useState<string>('175'); // cm or in
  const [activity, setActivity] = useState<number>(1.375); // Light exercise
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const wKg = unit === 'metric' ? parseFloat(weight) : parseFloat(weight) * 0.45359237;
  const hCm = unit === 'metric' ? parseFloat(height) : parseFloat(height) * 2.54;
  const ageYears = parseFloat(age);

  const isValid = !isNaN(wKg) && !isNaN(hCm) && !isNaN(ageYears) && wKg > 20 && hCm > 80 && ageYears > 10;

  const results = (() => {
    if (!isValid) return null;

    // Mifflin - St Jeor BMR
    let bmr = 10 * wKg + 6.25 * hCm - 5 * ageYears;
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const maintenance = Math.round(bmr * activity);

    return {
      bmr: Math.round(bmr),
      maintenance,
      mildLoss: maintenance - 250,
      weightLoss: maintenance - 500,
      extremeLoss: Math.max(1200, maintenance - 1000),
      mildGain: maintenance + 250,
      weightGain: maintenance + 500,
    };
  })();

  const copyVal = (val: number, id: string) => {
    navigator.clipboard.writeText(`${val} kcal/day`);
    setCopiedId(id);
    if (onCopy) onCopy(`${val} kcal/day`);
    setTimeout(() => setCopiedId(null), 1800);
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
          <h3 className="text-sm font-semibold text-white">Your Metrics</h3>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Age (years)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
            />
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
            <label className="text-xs text-slate-300 block mb-1">Physical Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(parseFloat(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
            >
              <option value="1.2">Sedentary (Little or no exercise)</option>
              <option value="1.375">Lightly Active (1-3 days/week)</option>
              <option value="1.55">Moderately Active (3-5 days/week)</option>
              <option value="1.725">Very Active (6-7 days/week)</option>
              <option value="1.9">Extra Active (Hard labor / Athlete)</option>
            </select>
          </div>
        </div>

        {/* Results Targets */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Maintenance Card */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                Daily Maintenance Calories (TDEE)
              </span>
              <div className="text-4xl font-black font-mono text-white">
                {results ? `${results.maintenance.toLocaleString()} kcal` : '—'}
                <span className="text-sm font-normal text-slate-400"> / day</span>
              </div>
              <span className="text-xs text-slate-500 font-mono mt-1 block">
                Basal Metabolic Rate (BMR): {results ? results.bmr.toLocaleString() : '—'} kcal
              </span>
            </div>

            {results && (
              <button
                type="button"
                onClick={() => copyVal(results.maintenance, 'maint')}
                className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition"
              >
                {copiedId === 'maint' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            )}
          </div>

          {/* Goal Scenarios */}
          {results && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-cyan-400" /> Mild Fat Loss (-0.25 kg/wk)
                  </span>
                  <span className="text-xl font-bold text-cyan-400 mt-1 block">{results.mildLoss} kcal</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyVal(results.mildLoss, 'mildLoss')}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  {copiedId === 'mildLoss' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-400" /> Standard Fat Loss (-0.5 kg/wk)
                  </span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block">{results.weightLoss} kcal</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyVal(results.weightLoss, 'loss')}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  {copiedId === 'loss' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Lean Bulk (+0.25 kg/wk)
                  </span>
                  <span className="text-xl font-bold text-amber-400 mt-1 block">{results.mildGain} kcal</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyVal(results.mildGain, 'mildGain')}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  {copiedId === 'mildGain' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-400" /> Muscle Mass (+0.5 kg/wk)
                  </span>
                  <span className="text-xl font-bold text-orange-400 mt-1 block">{results.weightGain} kcal</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyVal(results.weightGain, 'gain')}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                >
                  {copiedId === 'gain' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
