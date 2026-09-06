import React, { useState } from 'react';
import { Shapes, Copy, Check, Circle, Square, Triangle } from 'lucide-react';

interface GeometryAreaCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

type ShapeType = 'circle' | 'rectangle' | 'triangle' | 'trapezoid' | 'ellipse' | 'polygon';

export default function GeometryAreaCalculator({ onCopy }: GeometryAreaCalculatorProps) {
  const [shape, setShape] = useState<ShapeType>('circle');

  // Circle inputs
  const [radius, setRadius] = useState<string>('5');

  // Rectangle inputs
  const [rectL, setRectL] = useState<string>('12');
  const [rectW, setRectW] = useState<string>('8');

  // Triangle inputs (Base & Height or 3 sides)
  const [triMode, setTriMode] = useState<'baseHeight' | 'threeSides'>('baseHeight');
  const [triBase, setTriBase] = useState<string>('10');
  const [triHeight, setTriHeight] = useState<string>('6');
  const [triA, setTriA] = useState<string>('5');
  const [triB, setTriB] = useState<string>('6');
  const [triC, setTriC] = useState<string>('7');

  // Trapezoid
  const [trapA, setTrapA] = useState<string>('8');
  const [trapB, setTrapB] = useState<string>('12');
  const [trapH, setTrapH] = useState<string>('5');

  // Ellipse
  const [ellipseA, setEllipseA] = useState<string>('7');
  const [ellipseB, setEllipseB] = useState<string>('4');

  // Polygon
  const [polySides, setPolySides] = useState<string>('6');
  const [polyLength, setPolyLength] = useState<string>('4');

  const [copied, setCopied] = useState<boolean>(false);

  // Compute
  const results = (() => {
    if (shape === 'circle') {
      const r = parseFloat(radius);
      if (isNaN(r) || r <= 0) return null;
      const area = Math.PI * r * r;
      const perimeter = 2 * Math.PI * r;
      const diameter = 2 * r;
      return {
        area: area.toFixed(4),
        perimeter: perimeter.toFixed(4),
        extra: `Diameter: ${diameter.toFixed(4)}`,
        name: 'Circle',
      };
    }

    if (shape === 'rectangle') {
      const l = parseFloat(rectL);
      const w = parseFloat(rectW);
      if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) return null;
      const area = l * w;
      const perimeter = 2 * (l + w);
      const diag = Math.sqrt(l * l + w * w);
      return {
        area: area.toFixed(4),
        perimeter: perimeter.toFixed(4),
        extra: `Diagonal: ${diag.toFixed(4)}`,
        name: 'Rectangle',
      };
    }

    if (shape === 'triangle') {
      if (triMode === 'baseHeight') {
        const b = parseFloat(triBase);
        const h = parseFloat(triHeight);
        if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) return null;
        const area = 0.5 * b * h;
        return {
          area: area.toFixed(4),
          perimeter: 'Specify 3 sides to compute perimeter',
          extra: `Formula: 0.5 × base × height`,
          name: 'Triangle',
        };
      } else {
        const a = parseFloat(triA);
        const b = parseFloat(triB);
        const c = parseFloat(triC);
        if (isNaN(a) || isNaN(b) || isNaN(c) || a + b <= c || a + c <= b || b + c <= a) return null;
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        const perimeter = a + b + c;
        return {
          area: area.toFixed(4),
          perimeter: perimeter.toFixed(4),
          extra: `Semi-perimeter s = ${s.toFixed(2)} (Heron's Formula)`,
          name: 'Triangle',
        };
      }
    }

    if (shape === 'trapezoid') {
      const a = parseFloat(trapA);
      const b = parseFloat(trapB);
      const h = parseFloat(trapH);
      if (isNaN(a) || isNaN(b) || isNaN(h) || a <= 0 || b <= 0 || h <= 0) return null;
      const area = ((a + b) / 2) * h;
      return {
        area: area.toFixed(4),
        perimeter: 'Depends on side leg angles',
        extra: `Median = ${((a + b) / 2).toFixed(2)}`,
        name: 'Trapezoid',
      };
    }

    if (shape === 'ellipse') {
      const a = parseFloat(ellipseA);
      const b = parseFloat(ellipseB);
      if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) return null;
      const area = Math.PI * a * b;
      // Ramanujan approx for perimeter
      const h = Math.pow(a - b, 2) / Math.pow(a + b, 2);
      const perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
      return {
        area: area.toFixed(4),
        perimeter: perimeter.toFixed(4),
        extra: `Semi-axes: a=${a}, b=${b}`,
        name: 'Ellipse',
      };
    }

    if (shape === 'polygon') {
      const n = parseInt(polySides, 10);
      const s = parseFloat(polyLength);
      if (isNaN(n) || isNaN(s) || n < 3 || s <= 0) return null;
      // Area = (n * s^2) / (4 * tan(pi / n))
      const area = (n * s * s) / (4 * Math.tan(Math.PI / n));
      const perimeter = n * s;
      return {
        area: area.toFixed(4),
        perimeter: perimeter.toFixed(4),
        extra: `${n}-sided regular polygon`,
        name: 'Regular Polygon',
      };
    }

    return null;
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `${results.name} Area: ${results.area}, Perimeter: ${results.perimeter} (${results.extra})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Shape Selector Buttons */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
        {[
          { id: 'circle', label: 'Circle' },
          { id: 'rectangle', label: 'Rectangle' },
          { id: 'triangle', label: 'Triangle' },
          { id: 'trapezoid', label: 'Trapezoid' },
          { id: 'ellipse', label: 'Ellipse' },
          { id: 'polygon', label: 'Regular Polygon' },
        ].map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setShape(s.id as ShapeType)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              shape === s.id
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dynamic Inputs */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white capitalize">{shape} Dimensions</h3>

          {shape === 'circle' && (
            <div>
              <label className="text-xs text-slate-300 block mb-1">Radius (r)</label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-base"
              />
            </div>
          )}

          {shape === 'rectangle' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Length (l)</label>
                <input
                  type="number"
                  value={rectL}
                  onChange={(e) => setRectL(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-base"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Width (w)</label>
                <input
                  type="number"
                  value={rectW}
                  onChange={(e) => setRectW(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-base"
                />
              </div>
            </div>
          )}

          {shape === 'triangle' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTriMode('baseHeight')}
                  className={`px-3 py-1 text-xs rounded-lg ${
                    triMode === 'baseHeight' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Base & Height
                </button>
                <button
                  type="button"
                  onClick={() => setTriMode('threeSides')}
                  className={`px-3 py-1 text-xs rounded-lg ${
                    triMode === 'threeSides' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  3 Sides (Heron&apos;s)
                </button>
              </div>

              {triMode === 'baseHeight' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Base (b)</label>
                    <input
                      type="number"
                      value={triBase}
                      onChange={(e) => setTriBase(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Height (h)</label>
                    <input
                      type="number"
                      value={triHeight}
                      onChange={(e) => setTriHeight(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Side a</label>
                    <input
                      type="number"
                      value={triA}
                      onChange={(e) => setTriA(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Side b</label>
                    <input
                      type="number"
                      value={triB}
                      onChange={(e) => setTriB(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Side c</label>
                    <input
                      type="number"
                      value={triC}
                      onChange={(e) => setTriC(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {shape === 'trapezoid' && (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Base a</label>
                <input
                  type="number"
                  value={trapA}
                  onChange={(e) => setTrapA(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Base b</label>
                <input
                  type="number"
                  value={trapB}
                  onChange={(e) => setTrapB(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Height h</label>
                <input
                  type="number"
                  value={trapH}
                  onChange={(e) => setTrapH(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>
          )}

          {shape === 'ellipse' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Semi-Major Axis (a)</label>
                <input
                  type="number"
                  value={ellipseA}
                  onChange={(e) => setEllipseA(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Semi-Minor Axis (b)</label>
                <input
                  type="number"
                  value={ellipseB}
                  onChange={(e) => setEllipseB(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          )}

          {shape === 'polygon' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Number of Sides (n ≥ 3)</label>
                <input
                  type="number"
                  min="3"
                  value={polySides}
                  onChange={(e) => setPolySides(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Side Length (s)</label>
                <input
                  type="number"
                  value={polyLength}
                  onChange={(e) => setPolyLength(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Card */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
              Calculated Area
            </span>
            <div className="text-4xl font-extrabold font-mono text-white my-3">
              {results ? results.area : '—'}
            </div>

            {results && (
              <div className="space-y-2 text-xs font-mono text-slate-400 mt-4 pt-4 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Perimeter / Boundary:</span>
                  <span className="text-emerald-400 font-bold">{results.perimeter}</span>
                </div>
                <div className="flex justify-between">
                  <span>Details:</span>
                  <span className="text-slate-200">{results.extra}</span>
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
              {copied ? 'Copied' : 'Copy Area & Perimeter'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
