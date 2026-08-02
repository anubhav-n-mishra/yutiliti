import React, { useState, useMemo } from 'react';
import { Percent, Hash, Layers } from 'lucide-react';

interface ModCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function ModCalculator({ onCopy }: ModCalculatorProps) {
  const [activeTab, setActiveTab] = useState<'modulo' | 'mode'>('modulo');

  // Modulo State
  const [dividend, setDividend] = useState<number>(27);
  const [divisor, setDivisor] = useState<number>(5);

  // Statistical Mode State
  const [modeInput, setModeInput] = useState<string>('4, 2, 4, 8, 9, 2, 4, 10, 8');

  // Modulo calculation
  const moduloResult = useMemo(() => {
    if (divisor === 0) return null;
    // Mathematical modulo formula: ((a % n) + n) % n
    const rem = ((dividend % divisor) + Math.abs(divisor)) % Math.abs(divisor);
    const quotient = Math.floor(dividend / divisor);

    return {
      remainder: rem,
      quotient,
      formula: `${dividend} = (${divisor} × ${quotient}) + ${rem}`,
    };
  }, [dividend, divisor]);

  // Statistical Mode calculation
  const modeResult = useMemo(() => {
    const numbers = modeInput
      .split(/[\s,;\n]+/)
      .map((v) => parseFloat(v.trim()))
      .filter((v) => !isNaN(v));

    if (numbers.length === 0) return null;

    const freqMap: Record<number, number> = {};
    let maxFreq = 0;

    numbers.forEach((n) => {
      freqMap[n] = (freqMap[n] || 0) + 1;
      if (freqMap[n] > maxFreq) maxFreq = freqMap[n];
    });

    if (maxFreq === 1 && numbers.length > 1) {
      return { modes: [], frequency: 1, type: 'No Mode (All values appear once)' };
    }

    const modes = Object.keys(freqMap)
      .filter((key) => freqMap[Number(key)] === maxFreq)
      .map(Number);

    let type = 'Unimodal (1 mode)';
    if (modes.length === 2) type = 'Bimodal (2 modes)';
    else if (modes.length > 2) type = `Multimodal (${modes.length} modes)`;

    return {
      modes,
      frequency: maxFreq,
      type,
    };
  }, [modeInput]);

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/80">
        <button
          type="button"
          onClick={() => setActiveTab('modulo')}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
            activeTab === 'modulo'
              ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-white'
              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          Modulo Operator (A mod B)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('mode')}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
            activeTab === 'mode'
              ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-white'
              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          Statistical Mode (Most Frequent Value)
        </button>
      </div>

      {activeTab === 'modulo' ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
              <Percent className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
              Modulo Math
            </h3>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Dividend (A)</label>
              <input
                type="number"
                value={dividend}
                onChange={(e) => setDividend(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Divisor (B)</label>
              <input
                type="number"
                value={divisor}
                onChange={(e) => setDivisor(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
            {moduloResult ? (
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Remainder (A mod B)</span>
                  <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                    {moduloResult.remainder}
                  </div>
                  <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">{moduloResult.formula}</p>
                </div>

                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-xs text-zinc-500">Integer Quotient</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{moduloResult.quotient}</div>
                </div>

                <button
                  type="button"
                  onClick={() => onCopy(`${dividend} mod ${divisor} = ${moduloResult.remainder}`)}
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
                >
                  Copy Modulo Result
                </button>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-red-500">Divisor cannot be zero.</div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
              <Layers className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
              Dataset Values
            </h3>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Numbers</label>
              <textarea
                rows={5}
                value={modeInput}
                onChange={(e) => setModeInput(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white p-3 font-mono text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
            {modeResult ? (
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">{modeResult.type}</span>
                  <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                    {modeResult.modes.length > 0 ? modeResult.modes.join(', ') : 'None'}
                  </div>
                  {modeResult.modes.length > 0 && (
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Appears {modeResult.frequency} times in the set.</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onCopy(`Mode: ${modeResult.modes.join(', ')} (Frequency: ${modeResult.frequency})`)}
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
                >
                  Copy Mode Result
                </button>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-500">Enter numbers to compute mode.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
