import React, { useState } from 'react';
import { Divide, Copy, Check, ArrowLeftRight, Sparkles } from 'lucide-react';

interface FractionToDecimalProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export default function FractionToDecimal({ onCopy }: FractionToDecimalProps) {
  const [mode, setMode] = useState<'fracToDec' | 'decToFrac'>('fracToDec');

  // Frac to Dec
  const [whole, setWhole] = useState<string>('');
  const [numerator, setNumerator] = useState<string>('3');
  const [denominator, setDenominator] = useState<string>('8');

  // Dec to Frac
  const [decimalInput, setDecimalInput] = useState<string>('0.625');

  const [copied, setCopied] = useState<boolean>(false);

  // Fraction to Decimal computation
  const fracResult = (() => {
    const num = parseFloat(numerator);
    const den = parseFloat(denominator);
    const wh = parseFloat(whole) || 0;
    if (isNaN(num) || isNaN(den) || den === 0) return null;

    const sign = wh < 0 ? -1 : 1;
    const absWhole = Math.abs(wh);
    const totalVal = sign * (absWhole + num / den);

    // Simplified fraction
    const divisor = gcd(num, den);
    const simpNum = num / divisor;
    const simpDen = den / divisor;

    const percentage = totalVal * 100;

    return {
      decimal: totalVal.toFixed(6).replace(/\.?0+$/, ''),
      fullDec: totalVal.toString(),
      percentage: `${percentage.toFixed(4).replace(/\.?0+$/, '')}%`,
      simplified: `${simpNum} / ${simpDen}`,
    };
  })();

  // Decimal to Fraction computation
  const decResult = (() => {
    const d = parseFloat(decimalInput);
    if (isNaN(d)) return null;

    const sign = d < 0 ? -1 : 1;
    const absD = Math.abs(d);
    const wholePart = Math.floor(absD);
    const fracPart = absD - wholePart;

    // Convert decimal places
    const decStr = fracPart.toFixed(8).replace(/^0\./, '').replace(/0+$/, '');
    const numDigits = decStr.length;
    const den = Math.pow(10, numDigits);
    const num = Math.round(fracPart * den);

    const g = gcd(num, den);
    const simpNum = num / g;
    const simpDen = den / g;

    // Improper fraction
    const improperNum = sign * (wholePart * simpDen + simpNum);

    return {
      simplifiedFrac: `${sign * simpNum} / ${simpDen}`,
      mixedFrac: wholePart > 0 ? `${sign * wholePart} ${simpNum}/${simpDen}` : null,
      improperFrac: `${improperNum} / ${simpDen}`,
      percentage: `${(d * 100).toFixed(4).replace(/\.?0+$/, '')}%`,
    };
  })();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setMode('fracToDec')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
            mode === 'fracToDec' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Fraction to Decimal
        </button>
        <button
          type="button"
          onClick={() => setMode('decToFrac')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
            mode === 'decToFrac' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Decimal to Fraction
        </button>
      </div>

      {mode === 'fracToDec' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fraction Input */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white">Enter Fraction</h3>

            <div className="flex items-center gap-3">
              <div className="w-24">
                <label className="text-xs text-slate-400 block mb-1">Whole (optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 1"
                  value={whole}
                  onChange={(e) => setWhole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-center font-mono text-white text-base"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Numerator</label>
                  <input
                    type="number"
                    value={numerator}
                    onChange={(e) => setNumerator(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-center font-mono text-white text-base"
                  />
                </div>
                <div className="h-0.5 bg-slate-700 rounded-full" />
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Denominator</label>
                  <input
                    type="number"
                    value={denominator}
                    onChange={(e) => setDenominator(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-center font-mono text-white text-base"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Decimal Output */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                Decimal Equivalent
              </span>
              <div className="text-4xl font-extrabold font-mono text-white my-3">
                {fracResult ? fracResult.decimal : '—'}
              </div>

              {fracResult && (
                <div className="space-y-1.5 text-xs text-slate-400 font-mono mt-4 pt-4 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span>Percentage:</span>
                    <span className="text-emerald-400 font-bold">{fracResult.percentage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Simplified Fraction:</span>
                    <span className="text-slate-200">{fracResult.simplified}</span>
                  </div>
                </div>
              )}
            </div>

            {fracResult && (
              <button
                type="button"
                onClick={() => handleCopy(fracResult.decimal)}
                className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Decimal'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Decimal to Fraction */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white">Enter Decimal Number</h3>
            <input
              type="number"
              step="any"
              value={decimalInput}
              onChange={(e) => setDecimalInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-2xl font-bold font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                Fraction Equivalent
              </span>
              <div className="text-4xl font-extrabold font-mono text-white my-3">
                {decResult ? decResult.improperFrac : '—'}
              </div>

              {decResult && (
                <div className="space-y-1.5 text-xs text-slate-400 font-mono mt-4 pt-4 border-t border-slate-800">
                  {decResult.mixedFrac && (
                    <div className="flex justify-between">
                      <span>Mixed Number:</span>
                      <span className="text-slate-200">{decResult.mixedFrac}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Percentage:</span>
                    <span className="text-emerald-400 font-bold">{decResult.percentage}</span>
                  </div>
                </div>
              )}
            </div>

            {decResult && (
              <button
                type="button"
                onClick={() => handleCopy(decResult.improperFrac)}
                className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Fraction'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
