import React, { useState } from 'react';
import { Copy, Check, Sparkles, HelpCircle } from 'lucide-react';

interface QuadraticSolverProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function QuadraticSolver({ onCopy }: QuadraticSolverProps) {
  const [aStr, setAStr] = useState<string>('1');
  const [bStr, setBStr] = useState<string>('-5');
  const [cStr, setCStr] = useState<string>('6');
  const [copied, setCopied] = useState<boolean>(false);

  const a = parseFloat(aStr);
  const b = parseFloat(bStr);
  const c = parseFloat(cStr);

  const isValid = !isNaN(a) && !isNaN(b) && !isNaN(c) && a !== 0;

  const result = (() => {
    if (!isValid) return null;

    const disc = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;

    let rootType: 'two-real' | 'one-real' | 'complex' = 'two-real';
    let root1 = '';
    let root2 = '';

    if (Math.abs(disc) < 1e-12) {
      rootType = 'one-real';
      const r = -b / (2 * a);
      root1 = r.toFixed(4);
      root2 = r.toFixed(4);
    } else if (disc > 0) {
      rootType = 'two-real';
      const sqrtD = Math.sqrt(disc);
      root1 = ((-b + sqrtD) / (2 * a)).toFixed(4);
      root2 = ((-b - sqrtD) / (2 * a)).toFixed(4);
    } else {
      rootType = 'complex';
      const realPart = (-b / (2 * a)).toFixed(4);
      const imagPart = (Math.sqrt(-disc) / (2 * a)).toFixed(4);
      root1 = `${realPart} + ${imagPart}i`;
      root2 = `${realPart} - ${imagPart}i`;
    }

    return {
      disc,
      rootType,
      root1,
      root2,
      vertexX: vertexX.toFixed(4),
      vertexY: vertexY.toFixed(4),
      opens: a > 0 ? 'Upward (Minimum vertex)' : 'Downward (Maximum vertex)',
    };
  })();

  const handleCopy = () => {
    if (!result) return;
    const text = `Quadratic Equation: ${a}x² + ${b}x + ${c} = 0\nRoots: x₁ = ${result.root1}, x₂ = ${result.root2}\nDiscriminant (Δ): ${result.disc.toFixed(4)}\nVertex: (${result.vertexX}, ${result.vertexY})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Coefficients Input */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-white">Enter Coefficients for ax² + bx + c = 0</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1">Coefficient a</label>
            <input
              type="number"
              value={aStr}
              onChange={(e) => setAStr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-base focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1">Coefficient b</label>
            <input
              type="number"
              value={bStr}
              onChange={(e) => setBStr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-base focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1">Constant c</label>
            <input
              type="number"
              value={cStr}
              onChange={(e) => setCStr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-base focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {a === 0 && (
          <p className="text-xs text-rose-400">Coefficient &apos;a&apos; cannot be 0 for a quadratic equation.</p>
        )}
      </div>

      {result && (
        <div className="space-y-6">
          {/* Roots Result Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                  Root 1 (x₁)
                </span>
                <div className="text-3xl font-extrabold font-mono text-white my-2">{result.root1}</div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                  Root 2 (x₂)
                </span>
                <div className="text-3xl font-extrabold font-mono text-white my-2">{result.root2}</div>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-500 block mb-1">Discriminant (Δ)</span>
              <span className="text-lg font-bold text-white">{result.disc.toFixed(2)}</span>
              <span className="text-[11px] text-indigo-300 block mt-0.5">
                {result.disc > 0 ? '2 Real Roots' : result.disc === 0 ? '1 Real Root' : '2 Complex Roots'}
              </span>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-500 block mb-1">Parabola Vertex (h, k)</span>
              <span className="text-base font-bold text-emerald-400">
                ({result.vertexX}, {result.vertexY})
              </span>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-500 block mb-1">Axis of Symmetry</span>
              <span className="text-base font-bold text-white">x = {result.vertexX}</span>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-500 block mb-1">Orientation</span>
              <span className="text-xs font-bold text-slate-300">{result.opens}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Solution' : 'Copy Full Quadratic Solution'}
          </button>
        </div>
      )}
    </div>
  );
}
