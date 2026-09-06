import React, { useState } from 'react';
import { Copy, Check, ArrowRightLeft, RefreshCw, Share2, Globe } from 'lucide-react';

interface UrlEncoderProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function UrlEncoderDecoder({ onCopy, onShare }: UrlEncoderProps) {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [method, setMethod] = useState<'component' | 'full'>('component');
  const [input, setInput] = useState<string>('https://example.com/search?q=free online tools & calculators #privacy!');
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setError(null);
    if (!input) {
      setOutput('');
      return;
    }
    try {
      if (mode === 'encode') {
        setOutput(method === 'component' ? encodeURIComponent(input) : encodeURI(input));
      } else {
        setOutput(method === 'component' ? decodeURIComponent(input) : decodeURI(input));
      }
    } catch {
      setError('Invalid encoded URI sequence. Please check for malformed % hex tokens.');
      setOutput('');
    }
  }, [input, mode, method]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    if (onCopy) onCopy(output);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    if (output && !error) {
      setInput(output);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            URL Encoder & Decoder
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Encode special characters into percent-encoded URL safe format or decode encoded query strings and URIs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setInput(''); setOutput(''); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear
          </button>
          {onShare && (
            <button
              onClick={() => onShare("URL Encoder & Decoder", "url-encoder-decoder")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          )}
        </div>
      </div>

      {/* Mode & Method Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl">
          <button
            onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'encode'
                ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Encode URL
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'decode'
                ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Decode URL
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-500">Method:</label>
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg">
            <button
              onClick={() => setMethod('component')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                method === 'component'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
              title="encodeURIComponent / decodeURIComponent (safest for parameters)"
            >
              Query Param (encodeURIComponent)
            </button>
            <button
              onClick={() => setMethod('full')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                method === 'full'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
              title="encodeURI / decodeURI (preserves full URL structure)"
            >
              Full URL (encodeURI)
            </button>
          </div>
        </div>
      </div>

      {/* Inputs & Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span className="font-semibold uppercase tracking-wider">{mode === 'encode' ? 'Raw URL / String Input' : 'Encoded URL Input'}</span>
            <span>{input.length} characters</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Type or paste raw URL/text...' : 'Paste percent-encoded URL (e.g. %20, %2F)...'}
            className="w-full h-72 p-4 font-mono text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span className="font-semibold uppercase tracking-wider">{mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSwap}
                disabled={!output || !!error}
                className="hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 disabled:opacity-40"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" /> Swap
              </button>
              <span>•</span>
              <span>{output.length} characters</span>
            </div>
          </div>

          <div className="relative h-72">
            <textarea
              readOnly
              value={error || output}
              placeholder="Output will appear here instantly..."
              className={`w-full h-full p-4 font-mono text-xs rounded-xl border bg-zinc-50/70 dark:bg-zinc-900/40 outline-none resize-none shadow-sm ${
                error
                  ? 'border-red-300 dark:border-red-900 text-red-600 dark:text-red-400'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100'
              }`}
            />
            {output && !error && (
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 transition-all text-xs flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
