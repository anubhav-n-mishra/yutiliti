import React, { useState, useId } from 'react';
import { Copy, Check, ArrowLeftRight, Trash2, Sparkles, FileDiff, Columns2, AlignJustify } from 'lucide-react';

interface DiffCheckerProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

const SAMPLE_ORIGINAL = `function calculateTotal(items) {
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    sum += items[i].price;
  }
  return sum;
}

export default calculateTotal;`;

const SAMPLE_MODIFIED = `function calculateTotal(items, discountRate = 0) {
  let sum = items.reduce((acc, item) => acc + item.price, 0);
  if (discountRate > 0) {
    sum = sum * (1 - discountRate);
  }
  return Number(sum.toFixed(2));
}

export default calculateTotal;`;

type DiffType = 'unchanged' | 'added' | 'removed';

interface DiffLine {
  type: DiffType;
  originalLineNum?: number;
  modifiedLineNum?: number;
  text: string;
}

// Computes LCS for line-by-line diffing
function computeDiff(
  originalText: string,
  modifiedText: string,
  options: { ignoreCase: boolean; ignoreWhitespace: boolean }
): DiffLine[] {
  let origLines = originalText.split(/\r?\n/);
  let modLines = modifiedText.split(/\r?\n/);

  if (originalText === '' && modifiedText === '') return [];
  if (originalText === '') {
    return modLines.map((l, i) => ({ type: 'added', modifiedLineNum: i + 1, text: l }));
  }
  if (modifiedText === '') {
    return origLines.map((l, i) => ({ type: 'removed', originalLineNum: i + 1, text: l }));
  }

  const normalize = (s: string) => {
    let res = s;
    if (options.ignoreWhitespace) res = res.trim();
    if (options.ignoreCase) res = res.toLowerCase();
    return res;
  };

  const n = origLines.length;
  const m = modLines.length;

  // DP table for LCS
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (normalize(origLines[i]) === normalize(modLines[j])) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Backtrack to build diff
  const result: DiffLine[] = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && normalize(origLines[i - 1]) === normalize(modLines[j - 1])) {
      result.unshift({
        type: 'unchanged',
        originalLineNum: i,
        modifiedLineNum: j,
        text: origLines[i - 1],
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({
        type: 'added',
        modifiedLineNum: j,
        text: modLines[j - 1],
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      result.unshift({
        type: 'removed',
        originalLineNum: i,
        text: origLines[i - 1],
      });
      i--;
    }
  }

  return result;
}

export default function DiffChecker({ onCopy }: DiffCheckerProps) {
  const [original, setOriginal] = useState<string>(SAMPLE_ORIGINAL);
  const [modified, setModified] = useState<string>(SAMPLE_MODIFIED);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(false);
  const [ignoreCase, setIgnoreCase] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const origId = useId();
  const modId = useId();

  const diff = computeDiff(original, modified, { ignoreWhitespace, ignoreCase });

  const additions = diff.filter((d) => d.type === 'added').length;
  const deletions = diff.filter((d) => d.type === 'removed').length;
  const unchanged = diff.filter((d) => d.type === 'unchanged').length;

  const handleSwap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
  };

  const handleCopyDiffSummary = () => {
    const summary = `Diff Summary:\n+ ${additions} additions\n- ${deletions} deletions\n= ${unchanged} unchanged lines`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    if (onCopy) onCopy(summary);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" /> Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setViewMode('unified')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'unified' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlignJustify className="w-3.5 h-3.5" /> Unified
            </button>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="rounded border-slate-700 text-indigo-500 bg-slate-950"
            />
            Trim Whitespace
          </label>

          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => setIgnoreCase(e.target.checked)}
              className="rounded border-slate-700 text-indigo-500 bg-slate-950"
            />
            Ignore Case
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSwap}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
            title="Swap Inputs"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" /> Swap
          </button>
          <button
            type="button"
            onClick={() => {
              setOriginal(SAMPLE_ORIGINAL);
              setModified(SAMPLE_MODIFIED);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 rounded-lg transition border border-indigo-800/40"
          >
            <Sparkles className="w-3.5 h-3.5" /> Sample
          </button>
          <button
            type="button"
            onClick={() => {
              setOriginal('');
              setModified('');
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg transition border border-rose-800/40"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Input Textareas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <label htmlFor={origId} className="text-xs font-semibold text-rose-300 flex items-center gap-2">
              <FileDiff className="w-4 h-4 text-rose-400" /> Original Text (Before)
            </label>
          </div>
          <textarea
            id={origId}
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original text here..."
            rows={8}
            className="w-full p-3 bg-transparent text-slate-100 placeholder-slate-500 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <label htmlFor={modId} className="text-xs font-semibold text-emerald-300 flex items-center gap-2">
              <FileDiff className="w-4 h-4 text-emerald-400" /> Modified Text (After)
            </label>
          </div>
          <textarea
            id={modId}
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified text here..."
            rows={8}
            className="w-full p-3 bg-transparent text-slate-100 placeholder-slate-500 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Diff Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/40 px-4 py-3 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-4 text-xs">
          <span className="text-emerald-400 font-medium">+{additions} additions</span>
          <span className="text-rose-400 font-medium">-{deletions} deletions</span>
          <span className="text-slate-400">{unchanged} matching lines</span>
        </div>

        <button
          type="button"
          onClick={handleCopyDiffSummary}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied Summary' : 'Copy Summary'}
        </button>
      </div>

      {/* Diff Result View */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Comparison Output</h3>
          <span className="text-xs text-slate-500 font-mono">{diff.length} total elements</span>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          {diff.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">Enter text in both boxes above to see the difference.</div>
          ) : viewMode === 'unified' ? (
            <table className="w-full font-mono text-xs text-left border-collapse">
              <tbody>
                {diff.map((line, idx) => {
                  let bg = 'hover:bg-slate-900/40';
                  let symbol = ' ';
                  let textCol = 'text-slate-300';
                  if (line.type === 'added') {
                    bg = 'bg-emerald-950/30 text-emerald-300 hover:bg-emerald-950/50';
                    symbol = '+';
                    textCol = 'text-emerald-300';
                  } else if (line.type === 'removed') {
                    bg = 'bg-rose-950/30 text-rose-300 hover:bg-rose-950/50';
                    symbol = '-';
                    textCol = 'text-rose-300';
                  }

                  return (
                    <tr key={idx} className={`${bg} border-b border-slate-900/40 transition-colors`}>
                      <td className="w-12 py-1 px-3 text-slate-600 text-right select-none">{line.originalLineNum ?? ''}</td>
                      <td className="w-12 py-1 px-3 text-slate-600 text-right select-none">{line.modifiedLineNum ?? ''}</td>
                      <td className="w-6 py-1 px-2 text-center font-bold select-none">{symbol}</td>
                      <td className={`py-1 px-3 whitespace-pre-wrap break-all ${textCol}`}>{line.text || ' '}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* Split / Side-by-Side View */
            <table className="w-full font-mono text-xs border-collapse">
              <tbody>
                {diff.map((line, idx) => {
                  return (
                    <tr key={idx} className="border-b border-slate-900/40">
                      {/* Left side (Original) */}
                      <td
                        className={`w-1/2 p-2 align-top ${
                          line.type === 'removed'
                            ? 'bg-rose-950/30 text-rose-300'
                            : line.type === 'added'
                            ? 'bg-slate-950/30 text-slate-700'
                            : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="w-8 shrink-0 text-right text-slate-600 select-none">
                            {line.type !== 'added' ? line.originalLineNum : ''}
                          </span>
                          <span className="whitespace-pre-wrap break-all">
                            {line.type !== 'added' ? line.text || ' ' : ''}
                          </span>
                        </div>
                      </td>

                      {/* Right side (Modified) */}
                      <td
                        className={`w-1/2 p-2 align-top border-l border-slate-800 ${
                          line.type === 'added'
                            ? 'bg-emerald-950/30 text-emerald-300'
                            : line.type === 'removed'
                            ? 'bg-slate-950/30 text-slate-700'
                            : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="w-8 shrink-0 text-right text-slate-600 select-none">
                            {line.type !== 'removed' ? line.modifiedLineNum : ''}
                          </span>
                          <span className="whitespace-pre-wrap break-all">
                            {line.type !== 'removed' ? line.text || ' ' : ''}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
