import React, { useState } from 'react';
import { Scale, Copy, Check } from 'lucide-react';

interface IdealBodyWeightCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function IdealBodyWeightCalculator({ onCopy }: IdealBodyWeightCalculatorProps) {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState<string>('175');
  const [heightFt, setHeightFt] = useState<string>('5');
  const [heightIn, setHeightIn] = useState<string>('9');
  const [copied, setCopied] = useState<boolean>(false);

  // Height in total inches
  const totalInches =
    unit === 'metric'
      ? parseFloat(heightCm) / 2.54
      : (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);

  const inchesOver5Ft = Math.max(0, totalInches - 60);

  const results = (() => {
    if (isNaN(totalInches) || totalInches < 48 || totalInches > 96) return null;

    let devine = 0;
    let robinson = 0;
    let miller = 0;
    let hamwi = 0;

    if (gender === 'male') {
      devine = 50.0 + 2.3 * inchesOver5Ft;
      robinson = 52.0 + 1.9 * inchesOver5Ft;
      miller = 56.2 + 1.41 * inchesOver5Ft;
      hamwi = 48.0 + 2.7 * inchesOver5Ft;
    } else {
      devine = 45.5 + 2.3 * inchesOver5Ft;
      robinson = 49.0 + 1.7 * inchesOver5Ft;
      miller = 53.1 + 1.36 * inchesOver5Ft;
      hamwi = 45.5 + 2.2 * inchesOver5Ft;
    }

    const avgKg = (devine + robinson + miller + hamwi) / 4;

    // BMI healthy range: 18.5 to 24.9
    const hM = (totalInches * 2.54) / 100;
    const bmiMinKg = 18.5 * hM * hM;
    const bmiMaxKg = 24.9 * hM * hM;

    const toDisplay = (kg: number) =>
      unit === 'metric' ? `${kg.toFixed(1)} kg` : `${(kg * 2.20462).toFixed(1)} lbs`;

    return {
      avg: toDisplay(avgKg),
      devine: toDisplay(devine),
      robinson: toDisplay(robinson),
      miller: toDisplay(miller),
      hamwi: toDisplay(hamwi),
      bmiRange: `${toDisplay(bmiMinKg)} – ${toDisplay(bmiMaxKg)}`,
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `Ideal Body Weight: ${results.avg} (Healthy BMI Range: ${results.bmiRange})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Unit & Gender */}
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
            Metric (cm)
          </button>
          <button
            type="button"
            onClick={() => setUnit('imperial')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              unit === 'imperial' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Imperial (ft/in)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Height Input */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Your Height</h3>

          {unit === 'metric' ? (
            <div>
              <label className="text-xs text-slate-300 block mb-1">Height in Centimeters</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-2xl font-bold font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Feet (ft)</label>
                <input
                  type="number"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-lg"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Inches (in)</label>
                <input
                  type="number"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
              Average Ideal Weight
            </span>
            <div className="text-4xl font-extrabold font-mono text-white my-2">
              {results ? results.avg : '—'}
            </div>

            {results && (
              <div className="space-y-3 mt-4 pt-4 border-t border-slate-800">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                  <span className="text-slate-500 block mb-0.5">WHO Healthy BMI Range (18.5 – 24.9):</span>
                  <span className="text-emerald-400 font-bold text-sm">{results.bmiRange}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800/80 flex justify-between">
                    <span className="text-slate-500">Devine:</span>
                    <span className="text-white font-bold">{results.devine}</span>
                  </div>
                  <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800/80 flex justify-between">
                    <span className="text-slate-500">Robinson:</span>
                    <span className="text-white font-bold">{results.robinson}</span>
                  </div>
                  <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800/80 flex justify-between">
                    <span className="text-slate-500">Miller:</span>
                    <span className="text-white font-bold">{results.miller}</span>
                  </div>
                  <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800/80 flex justify-between">
                    <span className="text-slate-500">Hamwi:</span>
                    <span className="text-white font-bold">{results.hamwi}</span>
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
              {copied ? 'Copied' : 'Copy Ideal Weight Report'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
