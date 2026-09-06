import React, { useState } from 'react';
import { Activity, Copy, Check, User } from 'lucide-react';

interface LeanBodyMassCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function LeanBodyMassCalculator({ onCopy }: LeanBodyMassCalculatorProps) {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<string>('75'); // kg or lbs
  const [height, setHeight] = useState<string>('178'); // cm or inches
  const [copied, setCopied] = useState<boolean>(false);

  // Normalization to kg and cm
  const wKg = unit === 'metric' ? parseFloat(weight) : parseFloat(weight) * 0.45359237;
  const hCm = unit === 'metric' ? parseFloat(height) : parseFloat(height) * 2.54;

  const isValid = !isNaN(wKg) && !isNaN(hCm) && wKg > 20 && hCm > 80;

  const results = (() => {
    if (!isValid) return null;

    // Boer Formula
    let boer = 0;
    if (gender === 'male') {
      boer = 0.407 * wKg + 0.267 * hCm - 19.2;
    } else {
      boer = 0.252 * wKg + 0.473 * hCm - 48.3;
    }

    // James Formula
    let james = 0;
    if (gender === 'male') {
      james = 1.1 * wKg - 128 * Math.pow(wKg / hCm, 2);
    } else {
      james = 1.07 * wKg - 148 * Math.pow(wKg / hCm, 2);
    }

    // Hume Formula
    let hume = 0;
    if (gender === 'male') {
      hume = 0.3281 * wKg + 0.33929 * hCm - 29.5336;
    } else {
      hume = 0.29569 * wKg + 0.41813 * hCm - 43.2933;
    }

    // Average
    const avgLbmKg = (boer + james + hume) / 3;
    const fatMassKg = Math.max(0, wKg - avgLbmKg);
    const fatPercentage = (fatMassKg / wKg) * 100;

    const displayLbm = unit === 'metric' ? `${avgLbmKg.toFixed(1)} kg` : `${(avgLbmKg * 2.20462).toFixed(1)} lbs`;
    const displayFat = unit === 'metric' ? `${fatMassKg.toFixed(1)} kg` : `${(fatMassKg * 2.20462).toFixed(1)} lbs`;

    return {
      avgLbmKg,
      displayLbm,
      displayFat,
      fatPercentage: fatPercentage.toFixed(1),
      boer: unit === 'metric' ? `${boer.toFixed(1)} kg` : `${(boer * 2.20462).toFixed(1)} lbs`,
      james: unit === 'metric' ? `${james.toFixed(1)} kg` : `${(james * 2.20462).toFixed(1)} lbs`,
      hume: unit === 'metric' ? `${hume.toFixed(1)} kg` : `${(hume * 2.20462).toFixed(1)} lbs`,
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `Lean Body Mass: ${results.displayLbm} | Body Fat: ${results.fatPercentage}% (${results.displayFat})`;
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Body Measurements</h3>

          <div className="grid grid-cols-2 gap-4">
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
                Height ({unit === 'metric' ? 'cm' : 'inches'})
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-base"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
              Estimated Lean Body Mass (LBM)
            </span>
            <div className="text-4xl font-extrabold font-mono text-white my-2">
              {results ? results.displayLbm : '—'}
            </div>

            {results && (
              <div className="space-y-3 mt-4 pt-4 border-t border-slate-800">
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>Lean Mass vs Fat Mass</span>
                    <span>{100 - parseFloat(results.fatPercentage)}% / {results.fatPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${100 - parseFloat(results.fatPercentage)}%` }}
                    />
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${results.fatPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-1">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-center">
                    <span className="text-slate-500 text-[10px] block">Boer</span>
                    <span className="text-white font-bold">{results.boer}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-center">
                    <span className="text-slate-500 text-[10px] block">James</span>
                    <span className="text-white font-bold">{results.james}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-center">
                    <span className="text-slate-500 text-[10px] block">Hume</span>
                    <span className="text-white font-bold">{results.hume}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {results && (
            <button
              type="button"
              onClick={handleCopy}
              className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Lean Mass Report'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
