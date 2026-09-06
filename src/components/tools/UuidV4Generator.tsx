import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Share2, Download, Fingerprint, Sliders } from 'lucide-react';

interface UuidV4GeneratorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function UuidV4Generator({ onCopy, onShare }: UuidV4GeneratorProps) {
  const [quantity, setQuantity] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [braces, setBraces] = useState<boolean>(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const generateUuid = () => {
    let id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });

    if (!hyphens) {
      id = id.replace(/-/g, '');
    }
    if (uppercase) {
      id = id.toUpperCase();
    }
    if (braces) {
      id = `{${id}}`;
    }
    return id;
  };

  const generateList = () => {
    const list: string[] = [];
    const count = Math.max(1, Math.min(100, quantity));
    for (let i = 0; i < count; i++) {
      list.push(generateUuid());
    }
    setUuids(list);
  };

  useEffect(() => {
    generateList();
  }, [quantity, uppercase, hyphens, braces]);

  const handleCopySingle = (id: string, idx: number) => {
    navigator.clipboard.writeText(id);
    setCopiedIndex(idx);
    if (onCopy) onCopy(id);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const handleCopyAll = () => {
    const allText = uuids.join('\n');
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    if (onCopy) onCopy(allText);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            UUID v4 & GUID Generator
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Generate cryptographically secure Version 4 UUIDs instantly in bulk — 100% client-side via Web Crypto API.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generateList}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </button>
          {onShare && (
            <button
              onClick={() => onShare("UUID v4 Generator", "uuid-v4-generator")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Controls Pane */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <Sliders className="w-4 h-4 text-rose-500" />
              Generator Options
            </div>

            {/* Quantity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                <span>Quantity</span>
                <span className="font-semibold text-rose-600">{quantity} UUIDs</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hyphens}
                  onChange={(e) => setHyphens(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500"
                />
                Include Hyphens (Standard 8-4-4-4-12)
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500"
                />
                Uppercase Characters (A-F)
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={braces}
                  onChange={(e) => setBraces(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500"
                />
                Wrap in Braces &#123;...&#125;
              </label>
            </div>

            {/* Action buttons */}
            <div className="pt-3 space-y-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={handleCopyAll}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                {copiedAll ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedAll ? 'Copied All to Clipboard!' : 'Copy All UUIDs'}
              </button>

              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download as .txt
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Pane */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500 pb-1">
            <span>Generated UUIDs ({uuids.length})</span>
            <span>Click any item to copy</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {uuids.map((id, index) => (
              <div
                key={id + index}
                onClick={() => handleCopySingle(id, index)}
                className="group flex items-center justify-between p-3.5 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-rose-400 dark:hover:border-rose-500/60 cursor-pointer transition-all shadow-sm"
              >
                <div className="flex items-center gap-3 font-mono text-xs text-zinc-900 dark:text-zinc-100 truncate">
                  <Fingerprint className="w-4 h-4 text-zinc-400 group-hover:text-rose-500 shrink-0" />
                  <span className="truncate">{id}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 shrink-0">
                  {copiedIndex === index ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Copied
                    </span>
                  ) : (
                    <span className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
