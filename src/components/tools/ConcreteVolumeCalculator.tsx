import React, { useState } from 'react';
import { HardHat, Copy, Check, Box } from 'lucide-react';

interface ConcreteVolumeCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

type SlabShape = 'slab' | 'column';

export default function ConcreteVolumeCalculator({ onCopy }: ConcreteVolumeCalculatorProps) {
  const [shape, setShape] = useState<SlabShape>('slab');

  // Slab inputs
  const [lengthFt, setLengthFt] = useState<string>('24'); // ft
  const [widthFt, setWidthFt] = useState<string>('12'); // ft
  const [thicknessIn, setThicknessIn] = useState<string>('4'); // inches

  // Column inputs
  const [diameterIn, setDiameterIn] = useState<string>('12'); // inches
  const [depthFt, setDepthFt] = useState<string>('4'); // ft
  const [columnCount, setColumnCount] = useState<string>('4');

  const [wastePct, setWastePct] = useState<number>(10);
  const [copied, setCopied] = useState<boolean>(false);

  const results = (() => {
    let cuFt = 0;

    if (shape === 'slab') {
      const l = parseFloat(lengthFt);
      const w = parseFloat(widthFt);
      const tIn = parseFloat(thicknessIn);
      if (isNaN(l) || isNaN(w) || isNaN(tIn) || l <= 0 || w <= 0 || tIn <= 0) return null;
      cuFt = l * w * (tIn / 12);
    } else {
      const dIn = parseFloat(diameterIn);
      const depth = parseFloat(depthFt);
      const count = parseInt(columnCount, 10) || 1;
      if (isNaN(dIn) || isNaN(depth) || dIn <= 0 || depth <= 0) return null;
      const radiusFt = (dIn / 2) / 12;
      cuFt = Math.PI * radiusFt * radiusFt * depth * count;
    }

    const totalCuFt = cuFt * (1 + wastePct / 100);
    const cuYards = totalCuFt / 27;
    const cuMeters = totalCuFt * 0.0283168;

    // 80lb bags yield ~0.60 cu ft
    const bags80lb = Math.ceil(totalCuFt / 0.60);
    // 60lb bags yield ~0.45 cu ft
    const bags60lb = Math.ceil(totalCuFt / 0.45);

    return {
      cuYards: cuYards.toFixed(2),
      cuFt: totalCuFt.toFixed(1),
      cuMeters: cuMeters.toFixed(2),
      bags80lb,
      bags60lb,
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `Concrete Volume Needed: ${results.cuYards} Cubic Yards (${results.cuFt} cu ft / ${results.cuMeters} m³) with ${wastePct}% waste. Equivalent: ${results.bags80lb} bags of 80 lb or ${results.bags60lb} bags of 60 lb.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Shape Switcher */}
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400">
          <HardHat className="w-5 h-5" />
          <span className="text-sm font-semibold text-white">Concrete Volume & Slab Estimator</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShape('slab')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              shape === 'slab' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Slab / Patio / Driveway
          </button>
          <button
            type="button"
            onClick={() => setShape('column')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              shape === 'column' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Cylinder / Footing Column
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white capitalize">{shape} Dimensions</h3>

          {shape === 'slab' ? (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Length (Feet)</label>
                <input
                  type="number"
                  value={lengthFt}
                  onChange={(e) => setLengthFt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Width (Feet)</label>
                <input
                  type="number"
                  value={widthFt}
                  onChange={(e) => setWidthFt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Thickness (Inches)</label>
                <input
                  type="number"
                  value={thicknessIn}
                  onChange={(e) => setThicknessIn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Diameter (Inches)</label>
                <input
                  type="number"
                  value={diameterIn}
                  onChange={(e) => setDiameterIn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Depth (Feet)</label>
                <input
                  type="number"
                  value={depthFt}
                  onChange={(e) => setDepthFt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={columnCount}
                  onChange={(e) => setColumnCount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-300 block mb-1">Waste Factor (%)</label>
            <div className="flex gap-2">
              {[5, 10, 15].map((wPct) => (
                <button
                  key={wPct}
                  type="button"
                  onClick={() => setWastePct(wPct)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                    wastePct === wPct
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  +{wPct}% Waste
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
              Ready-Mix Truck Order Volume
            </span>
            <div className="text-5xl font-black font-mono text-white my-2">
              {results ? results.cuYards : '—'}
              <span className="text-lg font-normal text-slate-400"> cu. yds (yd³)</span>
            </div>

            {results && (
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-800 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Cubic Feet (ft³):</span>
                  <span className="font-bold text-white">{results.cuFt} cu ft</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Cubic Meters (m³):</span>
                  <span className="font-bold text-white">{results.cuMeters} m³</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs mt-3">
                  <span className="text-slate-400">Or Pre-Mix Bags:</span>
                  <span className="font-bold text-indigo-400 font-mono">
                    {results.bags80lb} bags (80 lb) or {results.bags60lb} bags (60 lb)
                  </span>
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
              {copied ? 'Copied' : 'Copy Concrete Estimate'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
