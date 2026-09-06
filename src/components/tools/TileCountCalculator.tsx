import React, { useState } from 'react';
import { Grid, Copy, Check, Box } from 'lucide-react';

interface TileCountCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function TileCountCalculator({ onCopy }: TileCountCalculatorProps) {
  const [areaLength, setAreaLength] = useState<string>('12'); // ft
  const [areaWidth, setAreaWidth] = useState<string>('10'); // ft
  const [tileLengthIn, setTileLengthIn] = useState<string>('12'); // inches
  const [tileWidthIn, setTileWidthIn] = useState<string>('24'); // inches
  const [wastePct, setWastePct] = useState<number>(10);
  const [tilesPerBox, setTilesPerBox] = useState<string>('8');
  const [copied, setCopied] = useState<boolean>(false);

  const roomL = parseFloat(areaLength);
  const roomW = parseFloat(areaWidth);
  const tL = parseFloat(tileLengthIn);
  const tW = parseFloat(tileWidthIn);
  const perBox = parseInt(tilesPerBox, 10) || 1;

  const isValid = !isNaN(roomL) && !isNaN(roomW) && !isNaN(tL) && !isNaN(tW) && roomL > 0 && roomW > 0 && tL > 0 && tW > 0;

  const results = (() => {
    if (!isValid) return null;

    const surfaceSqFt = roomL * roomW;
    const surfaceSqIn = surfaceSqFt * 144;

    const singleTileSqIn = tL * tW;
    const singleTileSqFt = singleTileSqIn / 144;

    const rawTileCount = surfaceSqIn / singleTileSqIn;
    const totalTilesWithWaste = Math.ceil(rawTileCount * (1 + wastePct / 100));

    const boxesNeeded = Math.ceil(totalTilesWithWaste / perBox);
    const totalPurchasedTiles = boxesNeeded * perBox;

    return {
      surfaceSqFt: surfaceSqFt.toFixed(1),
      singleTileSqFt: singleTileSqFt.toFixed(2),
      rawTileCount: Math.ceil(rawTileCount),
      totalTilesWithWaste,
      boxesNeeded,
      totalPurchasedTiles,
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `Tiles Needed: ${results.totalTilesWithWaste} tiles (${results.boxesNeeded} boxes of ${tilesPerBox}) for ${results.surfaceSqFt} sq ft with ${wastePct}% waste.`;
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
          <h3 className="text-sm font-semibold text-white">Tile & Surface Specs</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Surface Length (ft)</label>
              <input
                type="number"
                value={areaLength}
                onChange={(e) => setAreaLength(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Surface Width (ft)</label>
              <input
                type="number"
                value={areaWidth}
                onChange={(e) => setAreaWidth(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Tile Length (inches)</label>
              <input
                type="number"
                value={tileLengthIn}
                onChange={(e) => setTileLengthIn(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Tile Width (inches)</label>
              <input
                type="number"
                value={tileWidthIn}
                onChange={(e) => setTileWidthIn(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] text-slate-500 block mb-1">Popular Tile Sizes:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { l: '12', w: '12', label: '12" × 12"' },
                { l: '12', w: '24', label: '12" × 24"' },
                { l: '24', w: '24', label: '24" × 24"' },
                { l: '3', w: '6', label: '3" × 6" (Subway)' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setTileLengthIn(preset.l);
                    setTileWidthIn(preset.w);
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Waste Factor (%)</label>
              <select
                value={wastePct}
                onChange={(e) => setWastePct(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
              >
                <option value="5">5% (Simple rectangular)</option>
                <option value="10">10% (Standard cuts)</option>
                <option value="15">15% (Diagonal / curves)</option>
                <option value="20">20% (Herringbone pattern)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Tiles per Box</label>
              <input
                type="number"
                min="1"
                value={tilesPerBox}
                onChange={(e) => setTilesPerBox(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
              Total Tiles Needed (Incl. Waste)
            </span>
            <div className="text-5xl font-black font-mono text-white my-2">
              {results ? results.totalTilesWithWaste : '—'}
              <span className="text-lg font-normal text-slate-400"> tiles</span>
            </div>

            {results && (
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-800 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Surface Area:</span>
                  <span className="font-bold text-white">{results.surfaceSqFt} sq ft</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Single Tile Area:</span>
                  <span className="font-bold text-white">{results.singleTileSqFt} sq ft</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Boxes to Purchase:</span>
                  <span className="font-bold text-indigo-400">{results.boxesNeeded} boxes ({results.totalPurchasedTiles} tiles)</span>
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
              {copied ? 'Copied' : 'Copy Tile Order Summary'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
