import React, { useState } from 'react';
import { Layers, Copy, Check, Box, DollarSign } from 'lucide-react';

interface FlooringCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function FlooringCalculator({ onCopy }: FlooringCalculatorProps) {
  const [length, setLength] = useState<string>('20');
  const [width, setWidth] = useState<string>('15');
  const [wastePct, setWastePct] = useState<number>(10);
  const [boxCoverage, setBoxCoverage] = useState<string>('22.5'); // sq ft per box
  const [pricePerSqFt, setPricePerSqFt] = useState<string>('4.20');
  const [copied, setCopied] = useState<boolean>(false);

  const l = parseFloat(length);
  const w = parseFloat(width);
  const boxSqFt = parseFloat(boxCoverage);
  const price = parseFloat(pricePerSqFt);

  const isValid = !isNaN(l) && !isNaN(w) && l > 0 && w > 0;

  const results = (() => {
    if (!isValid) return null;

    const baseArea = l * w;
    const wasteArea = baseArea * (wastePct / 100);
    const totalAreaWithWaste = baseArea + wasteArea;

    let boxesNeeded = 0;
    let actualCoverage = totalAreaWithWaste;
    if (!isNaN(boxSqFt) && boxSqFt > 0) {
      boxesNeeded = Math.ceil(totalAreaWithWaste / boxSqFt);
      actualCoverage = boxesNeeded * boxSqFt;
    }

    const totalCost = (!isNaN(price) && price > 0) ? actualCoverage * price : 0;

    return {
      baseArea: baseArea.toFixed(1),
      totalAreaWithWaste: totalAreaWithWaste.toFixed(1),
      boxesNeeded,
      actualCoverage: actualCoverage.toFixed(1),
      totalCost: totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `Flooring Needed: ${results.boxesNeeded} boxes (${results.actualCoverage} sq ft with ${wastePct}% waste). Total Cost: $${results.totalCost}`;
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
          <h3 className="text-sm font-semibold text-white">Room & Material Specifications</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Room Length (Feet)</label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-base"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Room Width (Feet)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-base"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">
              Cutting Waste Factor ({wastePct}%)
            </label>
            <div className="flex gap-2">
              {[
                { pct: 5, label: '5% (Simple)' },
                { pct: 10, label: '10% (Standard)' },
                { pct: 15, label: '15% (Diagonal / Herringbone)' },
              ].map((wItem) => (
                <button
                  key={wItem.pct}
                  type="button"
                  onClick={() => setWastePct(wItem.pct)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                    wastePct === wItem.pct
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {wItem.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Coverage per Box (sq ft)</label>
              <input
                type="number"
                step="0.1"
                value={boxCoverage}
                onChange={(e) => setBoxCoverage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Price per sq ft ($)</label>
              <input
                type="number"
                step="0.1"
                value={pricePerSqFt}
                onChange={(e) => setPricePerSqFt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
              Total Boxes to Purchase
            </span>
            <div className="text-5xl font-black font-mono text-white my-2">
              {results ? results.boxesNeeded : '—'}
              <span className="text-lg font-normal text-slate-400"> boxes</span>
            </div>

            {results && (
              <div className="space-y-2.5 mt-4 pt-4 border-t border-slate-800 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Net Floor Area:</span>
                  <span className="font-bold text-white">{results.baseArea} sq ft</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Area (+{wastePct}% waste):</span>
                  <span className="font-bold text-indigo-400">{results.totalAreaWithWaste} sq ft</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Actual Purchased Coverage:</span>
                  <span className="font-bold text-white">{results.actualCoverage} sq ft</span>
                </div>
                {results.totalCost !== '0.00' && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-sm mt-3">
                    <span className="text-slate-400">Total Material Cost:</span>
                    <span className="font-bold text-emerald-400">${results.totalCost}</span>
                  </div>
                )}
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
              {copied ? 'Copied' : 'Copy Flooring Plan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
