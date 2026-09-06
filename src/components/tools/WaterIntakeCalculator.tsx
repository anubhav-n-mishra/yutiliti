import React, { useState } from 'react';
import { Droplet, Copy, Check, Sun, Dumbbell, GlassWater } from 'lucide-react';

interface WaterIntakeCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function WaterIntakeCalculator({ onCopy }: WaterIntakeCalculatorProps) {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState<string>('70');
  const [exerciseMins, setExerciseMins] = useState<string>('45');
  const [climate, setClimate] = useState<'temperate' | 'hot'>('temperate');
  const [copied, setCopied] = useState<boolean>(false);

  const wKg = unit === 'metric' ? parseFloat(weight) : parseFloat(weight) * 0.45359237;
  const ex = parseFloat(exerciseMins) || 0;

  const results = (() => {
    if (isNaN(wKg) || wKg <= 20) return null;

    // Base: ~35 ml per kg of body weight
    let ml = wKg * 35;

    // Exercise: add ~350ml per 30 mins of exercise
    ml += (ex / 30) * 350;

    // Hot climate: +500ml
    if (climate === 'hot') {
      ml += 500;
    }

    const liters = ml / 1000;
    const oz = ml * 0.033814;
    const glasses = Math.round(ml / 250); // 250ml standard glass

    return {
      liters: liters.toFixed(2),
      ml: Math.round(ml),
      oz: Math.round(oz),
      glasses,
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `Recommended Daily Water Intake: ${results.liters} L (${results.glasses} glasses of 250ml)`;
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
          <Droplet className="w-5 h-5" />
          <span className="text-sm font-semibold text-white">Daily Hydration Planner</span>
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
        {/* Inputs */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Your Routine & Factors</h3>

          <div>
            <label className="text-xs text-slate-300 block mb-1">
              Body Weight ({unit === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-base"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">
              Daily Physical Workout / Exercise (Minutes)
            </label>
            <input
              type="number"
              value={exerciseMins}
              onChange={(e) => setExerciseMins(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-base"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Environment / Weather Climate</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setClimate('temperate')}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition ${
                  climate === 'temperate'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400'
                }`}
              >
                Normal / Indoor
              </button>
              <button
                type="button"
                onClick={() => setClimate('hot')}
                className={`p-2.5 rounded-xl text-xs font-semibold border transition ${
                  climate === 'hot'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400'
                }`}
              >
                Hot / Humid (+500ml)
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
              Recommended Daily Water Intake
            </span>
            <div className="text-5xl font-black font-mono text-white my-2">
              {results ? `${results.liters} L` : '—'}
              <span className="text-sm font-normal text-slate-400"> / day</span>
            </div>

            {results && (
              <div className="space-y-4 mt-4 pt-4 border-t border-slate-800 font-mono text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2">
                    <GlassWater className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 text-[10px] block">Glasses (250ml)</span>
                      <span className="text-white font-bold text-base">{results.glasses} cups</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 text-[10px] block">Fluid Ounces</span>
                      <span className="text-white font-bold text-base">{results.oz} fl oz</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block mb-1.5">Glass Schedule Checklist:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: Math.min(16, results.glasses) }).map((_, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-cyan-300 text-[10px]"
                      >
                        Glass {i + 1}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {results && (
            <button
              type="button"
              onClick={handleCopy}
              className="mt-6 w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Water Target'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
