import React, { useState } from 'react';
import { Shovel, Copy, Check, Droplets } from 'lucide-react';

interface CementMortarCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function CementMortarCalculator({ onCopy }: CementMortarCalculatorProps) {
  const [areaSqFt, setAreaSqFt] = useState<string>('500'); // sq ft
  const [thicknessIn, setThicknessIn] = useState<string>('0.5'); // half inch plaster
  const [ratio, setRatio] = useState<string>('1:4'); // 1 part cement to 4 parts sand
  const [bagSizeKg, setBagSizeKg] = useState<number>(50); // 50kg bag
  const [copied, setCopied] = useState<boolean>(false);

  const area = parseFloat(areaSqFt);
  const thick = parseFloat(thicknessIn);

  const isValid = !isNaN(area) && !isNaN(thick) && area > 0 && thick > 0;

  const results = (() => {
    if (!isValid) return null;

    // Wet volume in cubic feet: Area * (thickness / 12)
    const wetCuFt = area * (thick / 12);
    // Dry volume factor for mortar is typically 1.33 (voids between sand particles)
    const dryCuFt = wetCuFt * 1.33;

    // Ratio parts
    const [cPart, sPart] = ratio.split(':').map(Number);
    const totalParts = cPart + sPart;

    // Cement volume
    const cementCuFt = (cPart / totalParts) * dryCuFt;
    // 1 bag of 50kg cement = approx 1.25 cu ft (density ~1440 kg/m³)
    const cuFtPerBag = (bagSizeKg / 50) * 1.226;
    const cementBags = Math.ceil(cementCuFt / cuFtPerBag);

    // Sand volume
    const sandCuFt = (sPart / totalParts) * dryCuFt;
    // 1 cu ft of sand is approx 45 kg (0.045 tonnes) or ~100 lbs
    const sandTonnes = (sandCuFt * 45) / 1000;

    // Water requirement (w/c ratio approx 0.50 -> 25L per 50kg bag)
    const waterLiters = Math.round(cementBags * (bagSizeKg * 0.5));

    return {
      wetCuFt: wetCuFt.toFixed(1),
      dryCuFt: dryCuFt.toFixed(1),
      cementBags,
      sandCuFt: Math.round(sandCuFt),
      sandTonnes: sandTonnes.toFixed(2),
      waterLiters,
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `Mortar Estimate (${ratio} mix for ${areaSqFt} sq ft at ${thicknessIn}" thick): ${results.cementBags} Bags of Cement (${bagSizeKg}kg), ${results.sandCuFt} cu ft of Sand (~${results.sandTonnes} tonnes), ~${results.waterLiters} L Water.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Inputs */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Plaster / Mortar Specifications</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Surface Area (sq ft)</label>
              <input
                type="number"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Thickness (Inches)</label>
              <input
                type="number"
                step="0.125"
                value={thicknessIn}
                onChange={(e) => setThicknessIn(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Mortar Mix Proportion (Cement : Sand)</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { r: '1:3', label: '1 : 3 (Rich Waterproof)' },
                { r: '1:4', label: '1 : 4 (Standard External)' },
                { r: '1:5', label: '1 : 5 (Internal Plaster)' },
                { r: '1:6', label: '1 : 6 (Brick Masonry)' },
              ].map((item) => (
                <button
                  key={item.r}
                  type="button"
                  onClick={() => setRatio(item.r)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                    ratio === item.r
                      ? 'border-indigo-500 bg-indigo-950/40 text-white'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs text-slate-300 block mb-1">Cement Bag Size</label>
            <div className="flex gap-2">
              {[
                { kg: 50, label: '50 kg (Standard International)' },
                { kg: 42.6, label: '94 lb (US Standard)' },
              ].map((b) => (
                <button
                  key={b.kg}
                  type="button"
                  onClick={() => setBagSizeKg(b.kg)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                    bagSizeKg === b.kg ? 'bg-slate-700 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
              Cement Bags Required
            </span>
            <div className="text-5xl font-black font-mono text-white my-2">
              {results ? results.cementBags : '—'}
              <span className="text-lg font-normal text-slate-400"> Bags ({bagSizeKg} kg)</span>
            </div>

            {results && (
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-800 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Sand Required:</span>
                  <span className="font-bold text-white">
                    {results.sandCuFt} cu ft (~{results.sandTonnes} tonnes)
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Mixing Water (est.):</span>
                  <span className="font-bold text-cyan-400">~{results.waterLiters} Liters</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Dry Mortar Volume:</span>
                  <span className="font-bold text-slate-400">{results.dryCuFt} cu ft (+33% void factor)</span>
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
              {copied ? 'Copied' : 'Copy Mix Formulation'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
