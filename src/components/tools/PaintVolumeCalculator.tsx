import React, { useState } from 'react';
import { Paintbrush, Copy, Check } from 'lucide-react';

interface PaintVolumeCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function PaintVolumeCalculator({ onCopy }: PaintVolumeCalculatorProps) {
  const [length, setLength] = useState<string>('14'); // ft
  const [width, setWidth] = useState<string>('12'); // ft
  const [height, setHeight] = useState<string>('9'); // ft
  const [doors, setDoors] = useState<string>('2');
  const [windows, setWindows] = useState<string>('2');
  const [coats, setCoats] = useState<number>(2);
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const l = parseFloat(length);
  const w = parseFloat(width);
  const h = parseFloat(height);
  const numDoors = parseFloat(doors) || 0;
  const numWindows = parseFloat(windows) || 0;

  const isValid = !isNaN(l) && !isNaN(w) && !isNaN(h) && l > 0 && w > 0 && h > 0;

  const results = (() => {
    if (!isValid) return null;

    // Perimeter * Height = 2 * (L + W) * H
    const rawWallArea = 2 * (l + w) * h;

    // Deductions: Doors ~21 sq ft each, Windows ~15 sq ft each
    const deductions = numDoors * 21 + numWindows * 15;
    const netWallArea = Math.max(0, rawWallArea - deductions);

    // Ceiling area = L * W
    const ceilingArea = includeCeiling ? l * w : 0;
    const totalAreaToPaint = (netWallArea + ceilingArea) * coats;

    // Standard coverage: ~350 sq ft per gallon
    const coveragePerGallon = 350;
    const gallonsExact = totalAreaToPaint / coveragePerGallon;
    const gallonsToBuy = Math.ceil(gallonsExact);
    const liters = gallonsExact * 3.78541;

    return {
      netWallArea: Math.round(netWallArea),
      ceilingArea: Math.round(ceilingArea),
      totalPaintArea: Math.round(totalAreaToPaint),
      gallonsExact: gallonsExact.toFixed(1),
      gallonsToBuy,
      liters: liters.toFixed(1),
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `Paint Needed: ${results.gallonsToBuy} Gallons (~${results.liters} L) for ${results.totalPaintArea} sq ft (${coats} coats).`;
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
          <h3 className="text-sm font-semibold text-white">Room Measurements (Feet)</h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Length</label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Width</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Ceiling Height</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Doors (Deduct 21 sq ft)</label>
              <input
                type="number"
                min="0"
                value={doors}
                onChange={(e) => setDoors(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Windows (Deduct 15 sq ft)</label>
              <input
                type="number"
                min="0"
                value={windows}
                onChange={(e) => setWindows(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Coats of Paint</label>
              <div className="flex gap-2">
                {[1, 2, 3].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCoats(c)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                      coats === c ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {c} {c === 1 ? 'Coat' : 'Coats'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCeiling}
                  onChange={(e) => setIncludeCeiling(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-500 bg-slate-950"
                />
                Include Ceiling (+{l * w || 0} sq ft)
              </label>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
              Estimated Paint Required
            </span>
            <div className="text-5xl font-black font-mono text-white my-2">
              {results ? results.gallonsToBuy : '—'}
              <span className="text-lg font-normal text-slate-400"> Gallons</span>
            </div>
            <span className="text-xs text-slate-500 font-mono block">
              Exact: ~{results ? results.gallonsExact : 0} Gallons (~{results ? results.liters : 0} Liters)
            </span>

            {results && (
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-800 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Net Wall Surface:</span>
                  <span className="font-bold text-white">{results.netWallArea} sq ft</span>
                </div>
                {includeCeiling && (
                  <div className="flex justify-between text-slate-300">
                    <span>Ceiling Surface:</span>
                    <span className="font-bold text-white">{results.ceilingArea} sq ft</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>Total Coverage Area ({coats} coats):</span>
                  <span className="font-bold text-emerald-400">{results.totalPaintArea} sq ft</span>
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
              {copied ? 'Copied' : 'Copy Paint Estimate'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
