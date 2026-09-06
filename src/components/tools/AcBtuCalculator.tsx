import React, { useState } from 'react';
import { Wind, Copy, Check, Sun, Users, Flame } from 'lucide-react';

interface AcBtuCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function AcBtuCalculator({ onCopy }: AcBtuCalculatorProps) {
  const [areaSqFt, setAreaSqFt] = useState<string>('250');
  const [sunlight, setSunlight] = useState<'shaded' | 'average' | 'sunny'>('average');
  const [occupants, setOccupants] = useState<string>('2');
  const [isKitchen, setIsKitchen] = useState<boolean>(false);
  const [ceilingHeight, setCeilingHeight] = useState<string>('9');
  const [copied, setCopied] = useState<boolean>(false);

  const area = parseFloat(areaSqFt);
  const occ = parseInt(occupants, 10) || 2;
  const h = parseFloat(ceilingHeight) || 8;

  const isValid = !isNaN(area) && area > 0;

  const results = (() => {
    if (!isValid) return null;

    // Base Energy Star BTU table approximation:
    // 100-150 sq ft: 5000 BTU
    // 150-250 sq ft: 6000 BTU
    // 250-300 sq ft: 7000 BTU
    // 300-350 sq ft: 8000 BTU
    // 350-400 sq ft: 9000 BTU
    // 400-450 sq ft: 10000 BTU
    // 450-550 sq ft: 12000 BTU
    // Linear rule of thumb: ~20 to 25 BTU per sq ft for 8ft ceilings
    let baseBtu = area * 22;

    // Sunlight modifier
    if (sunlight === 'shaded') {
      baseBtu *= 0.9;
    } else if (sunlight === 'sunny') {
      baseBtu *= 1.1;
    }

    // Additional occupants: +600 BTU per person over 2
    if (occ > 2) {
      baseBtu += (occ - 2) * 600;
    }

    // Kitchen: +4000 BTU
    if (isKitchen) {
      baseBtu += 4000;
    }

    // Ceiling height: +1000 BTU per ft above 8ft
    if (h > 8) {
      baseBtu += (h - 8) * (area * 1.5);
    }

    const finalBtu = Math.round(baseBtu);
    // 1 ton of AC = 12,000 BTU
    const tons = (finalBtu / 12000).toFixed(2);

    // Recommended size category
    let recommendedAc = '';
    if (finalBtu <= 6000) recommendedAc = '0.5 Ton (6,000 BTU Window / Mini)';
    else if (finalBtu <= 9000) recommendedAc = '0.75 Ton (9,000 BTU Split)';
    else if (finalBtu <= 12000) recommendedAc = '1.0 Ton (12,000 BTU Split)';
    else if (finalBtu <= 18000) recommendedAc = '1.5 Ton (18,000 BTU Split)';
    else if (finalBtu <= 24000) recommendedAc = '2.0 Ton (24,000 BTU Split)';
    else recommendedAc = '2.5+ Ton / Multi-Zone System';

    return {
      finalBtu: finalBtu.toLocaleString(),
      tons,
      recommendedAc,
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `Recommended AC Cooling Capacity: ${results.finalBtu} BTU/hr (~${results.tons} Tons — ${results.recommendedAc}) for ${areaSqFt} sq ft room.`;
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
          <h3 className="text-sm font-semibold text-white">Room Specifications</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Room Area (sq ft)</label>
              <input
                type="number"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-base focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Ceiling Height (ft)</label>
              <input
                type="number"
                value={ceilingHeight}
                onChange={(e) => setCeilingHeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-base focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Sunlight Exposure</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSunlight('shaded')}
                className={`p-2 rounded-xl text-xs font-semibold border transition ${
                  sunlight === 'shaded'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400'
                }`}
              >
                Heavily Shaded (-10%)
              </button>
              <button
                type="button"
                onClick={() => setSunlight('average')}
                className={`p-2 rounded-xl text-xs font-semibold border transition ${
                  sunlight === 'average'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400'
                }`}
              >
                Average Sun
              </button>
              <button
                type="button"
                onClick={() => setSunlight('sunny')}
                className={`p-2 rounded-xl text-xs font-semibold border transition ${
                  sunlight === 'sunny'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400'
                }`}
              >
                Very Sunny (+10%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Room Occupants</label>
              <input
                type="number"
                min="1"
                value={occupants}
                onChange={(e) => setOccupants(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isKitchen}
                  onChange={(e) => setIsKitchen(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-500 bg-slate-950"
                />
                Kitchen Location (+4,000 BTU)
              </label>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
              Recommended Cooling Capacity
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono text-white my-2">
              {results ? results.finalBtu : '—'}
              <span className="text-lg font-normal text-slate-400"> BTU/hr</span>
            </div>

            {results && (
              <div className="space-y-3 mt-4 pt-4 border-t border-slate-800 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Tonnage Equivalent:</span>
                  <span className="font-bold text-white">~{results.tons} Tons</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                  <span className="text-slate-500 block text-[10px] mb-0.5">Recommended AC Class:</span>
                  <span className="font-bold text-emerald-400 text-sm">{results.recommendedAc}</span>
                </div>
              </div>
            )}
          </div>

          {results && (
            <button
              type="button"
              onClick={handleCopy}
              className="mt-6 w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy BTU Sizing'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
