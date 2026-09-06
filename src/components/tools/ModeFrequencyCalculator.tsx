import React, { useState } from 'react';
import { BarChart3, Copy, Check, Sparkles, ArrowUpDown } from 'lucide-react';

interface ModeFrequencyCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

const SAMPLE_DATA = '12, 15, 18, 12, 19, 24, 18, 12, 22, 18, 15, 30, 18';

export default function ModeFrequencyCalculator({ onCopy }: ModeFrequencyCalculatorProps) {
  const [inputData, setInputData] = useState<string>(SAMPLE_DATA);
  const [sortBy, setSortBy] = useState<'frequency' | 'value'>('frequency');
  const [copied, setCopied] = useState<boolean>(false);

  // Parse numbers
  const tokens = inputData
    .split(/[\s,;\n\t]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const numbers = tokens.map((t) => Number(t)).filter((n) => !isNaN(n));
  const isNumeric = numbers.length === tokens.length && tokens.length > 0;

  // Frequency Map
  const freqMap = new Map<string, number>();
  for (const item of tokens) {
    freqMap.set(item, (freqMap.get(item) || 0) + 1);
  }

  // Find Mode
  let maxFreq = 0;
  for (const count of freqMap.values()) {
    if (count > maxFreq) maxFreq = count;
  }

  const modes: string[] = [];
  if (maxFreq > 1 || freqMap.size === 1) {
    for (const [val, count] of freqMap.entries()) {
      if (count === maxFreq) {
        modes.push(val);
      }
    }
  }

  // Check if every item has the same frequency > 1 and multiple unique items -> No mode
  const allSameCount = freqMap.size > 1 && Array.from(freqMap.values()).every((c) => c === maxFreq);
  const hasMode = modes.length > 0 && !allSameCount;

  // Numeric stats if all inputs are numbers
  let mean: number | null = null;
  let median: number | null = null;
  let min: number | null = null;
  let max: number | null = null;

  if (isNumeric && numbers.length > 0) {
    const sortedNums = [...numbers].sort((a, b) => a - b);
    const sum = sortedNums.reduce((a, b) => a + b, 0);
    mean = sum / sortedNums.length;
    min = sortedNums[0];
    max = sortedNums[sortedNums.length - 1];

    const mid = Math.floor(sortedNums.length / 2);
    if (sortedNums.length % 2 === 0) {
      median = (sortedNums[mid - 1] + sortedNums[mid]) / 2;
    } else {
      median = sortedNums[mid];
    }
  }

  // Sort frequency table
  const freqList = Array.from(freqMap.entries()).map(([val, count]) => ({
    val,
    count,
    pct: (count / tokens.length) * 100,
  }));

  freqList.sort((a, b) => {
    if (sortBy === 'frequency') {
      return b.count - a.count;
    }
    const numA = Number(a.val);
    const numB = Number(b.val);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.val.localeCompare(b.val);
  });

  const handleCopy = () => {
    if (tokens.length === 0) return;
    const modeStr = hasMode ? modes.join(', ') : 'No Mode';
    const text = `Total Items: ${tokens.length}\nMode(s): ${modeStr} (Count: ${hasMode ? maxFreq : 1})${
      mean !== null ? `\nMean: ${mean.toFixed(2)}\nMedian: ${median}` : ''
    }`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Input */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-200">
            Enter Data Set (Numbers or Words, comma or space separated)
          </label>
          <button
            type="button"
            onClick={() => setInputData(SAMPLE_DATA)}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
          >
            <Sparkles className="w-3.5 h-3.5" /> Load Sample
          </button>
        </div>

        <textarea
          rows={3}
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder="e.g. 10, 15, 20, 15, 30, 15, 25"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <span className="text-slate-500 block mb-1">Mode(s)</span>
          <span className="text-lg font-bold text-indigo-400">
            {hasMode ? modes.join(', ') : 'No Mode'}
          </span>
          {hasMode && <span className="text-[11px] text-slate-400 block mt-0.5">Freq: {maxFreq} times</span>}
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <span className="text-slate-500 block mb-1">Total Items (n)</span>
          <span className="text-lg font-bold text-white">{tokens.length}</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">{freqMap.size} unique values</span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <span className="text-slate-500 block mb-1">Mean (Average)</span>
          <span className="text-lg font-bold text-emerald-400">
            {mean !== null ? mean.toFixed(2) : '—'}
          </span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <span className="text-slate-500 block mb-1">Median</span>
          <span className="text-lg font-bold text-cyan-400">
            {median !== null ? median.toString() : '—'}
          </span>
        </div>
      </div>

      {/* Frequency Table */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" /> Frequency Distribution Table
          </h3>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSortBy(sortBy === 'frequency' ? 'value' : 'frequency')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              <ArrowUpDown className="w-3 h-3" /> Sort: {sortBy === 'frequency' ? 'Count' : 'Value'}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={tokens.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Value</th>
                <th className="px-6 py-3">Frequency</th>
                <th className="px-6 py-3">Relative %</th>
                <th className="px-6 py-3">Distribution Bar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {freqList.map((item) => {
                const isItemMode = hasMode && modes.includes(item.val);
                return (
                  <tr key={item.val} className={isItemMode ? 'bg-indigo-950/20' : ''}>
                    <td className="px-6 py-3 font-semibold text-white flex items-center gap-2">
                      {item.val}
                      {isItemMode && (
                        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700">
                          Mode
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-300 font-bold">{item.count}</td>
                    <td className="px-6 py-3 text-slate-400">{item.pct.toFixed(1)}%</td>
                    <td className="px-6 py-3 w-1/3">
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isItemMode ? 'bg-indigo-500' : 'bg-slate-600'}`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
