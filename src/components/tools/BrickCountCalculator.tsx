import React, { useState } from 'react';
import { Blocks, Copy, Check } from 'lucide-react';

interface BrickCountCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function BrickCountCalculator({ onCopy }: BrickCountCalculatorProps) {
  const [wallLength, setWallLength] = useState<string>('30'); // ft
  const [wallHeight, setWallHeight] = useState<string>('8'); // ft
  const [wallType, setWallType] = useState<'single' | 'double'>('single');
  const [openingsArea, setOpeningsArea] = useState<string>('40'); // sq ft (doors/windows)
  const [wastePct, setWastePct] = useState<number>(5);
  const [copied, setCopied] = useState<boolean>(false);

  const l = parseFloat(wallLength);
  const h = parseFloat(wallHeight);
  const openings = parseFloat(openingsArea) || 0;

  const isValid = !isNaN(l) && !isNaN(h) && l > 0 && h > 0;

  const results = (() => {
    if (!isValid) return null;

    const grossArea = l * h;
    const netArea = Math.max(0, grossArea - openings);

    // Standard Modular Brick with 3/8" (10mm) mortar joint:
    // ~7 bricks per square foot for single wythe (4.5" thick)
    // ~14 bricks per square foot for double wythe (9" thick)
    const factor = wallType === 'single' ? 7 : 14;

    const rawBricks = netArea * factor;
    const totalBricks = Math.ceil(rawBricks * (1 + wastePct / 100));

    // Mortar estimation: ~0.045 to 0.055 bags of mortar cement per 100 bricks
    const mortarBags = Math.ceil((totalBricks / 100) * 0.55);

    return {
      netArea: Math.round(netArea),
      rawBricks: Math.round(rawBricks),
      totalBricks,
      mortarBags,
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `Brick Estimate: ${results.totalBricks.toLocaleString()} bricks (${wallType} wythe wall, ${results.netArea} sq ft with ${wastePct}% waste) + ~${results.mortarBags} bags of mortar cement.`;
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
          <h3 className="text-sm font-semibold text-white">Wall Specifications (Feet)</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Wall Length (ft)</label>
              <input
                type="number"
                value={wallLength}
                onChange={(e) => setWallLength(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Wall Height (ft)</label>
              <input
                type="number"
                value={wallHeight}
                onChange={(e) => setWallHeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Wall Thickness</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWallType('single')}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                  wallType === 'single'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                <div>Single Wythe (4.5&quot; / Half)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">~7 bricks / sq ft</div>
              </button>
              <button
                type="button"
                onClick={() => setWallType('double')}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                  wallType === 'double'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                }`}
              >
                <div>Double Wythe (9&quot; / Full)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">~14 bricks / sq ft</div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Openings (Doors/Windows sq ft)</label>
              <input
                type="number"
                min="0"
                value={openingsArea}
                onChange={(e) => setOpeningsArea(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Waste Factor (%)</label>
              <select
                value={wastePct}
                onChange={(e) => setWastePct(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
              >
                <option value="5">5% (Normal)</option>
                <option value="10">10% (Cuts & breakage)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
              Total Bricks Required
            </span>
            <div className="text-5xl font-black font-mono text-white my-2">
              {results ? results.totalBricks.toLocaleString() : '—'}
              <span className="text-lg font-normal text-slate-400"> bricks</span>
            </div>

            {results && (
              <div className="space-y-2.5 mt-4 pt-4 border-t border-slate-800 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Net Wall Area:</span>
                  <span className="font-bold text-white">{results.netArea} sq ft</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Base Bricks Count:</span>
                  <span className="font-bold text-slate-400">{results.rawBricks.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-sm mt-3">
                  <span className="text-slate-400">Est. Mortar Cement:</span>
                  <span className="font-bold text-indigo-400 font-mono">~{results.mortarBags} Bags (80 lb)</span>
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
              {copied ? 'Copied' : 'Copy Masonry Estimate'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
