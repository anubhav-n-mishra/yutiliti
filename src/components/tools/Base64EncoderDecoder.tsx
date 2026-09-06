import React, { useState } from 'react';
import { Copy, Check, ArrowRightLeft, UploadCloud, RefreshCw, Share2, Download, FileText } from 'lucide-react';

interface Base64Props {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function Base64EncoderDecoder({ onCopy, onShare }: Base64Props) {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>('Hello World! 🚀 Yuitility 100% private in-browser tools.');
  const [output, setOutput] = useState<string>('');
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // UTF-8 safe base64 encode
  const utf8ToBase64 = (str: string, safe: boolean): string => {
    const bytes = new TextEncoder().encode(str);
    let binString = '';
    for (let i = 0; i < bytes.length; i++) {
      binString += String.fromCharCode(bytes[i]);
    }
    let b64 = btoa(binString);
    if (safe) {
      b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    return b64;
  };

  // UTF-8 safe base64 decode
  const base64ToUtf8 = (str: string): string => {
    let clean = str.trim();
    clean = clean.replace(/-/g, '+').replace(/_/g, '/');
    while (clean.length % 4 !== 0) {
      clean += '=';
    }
    const binString = atob(clean);
    const bytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
      bytes[i] = binString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  };

  const processText = () => {
    setError(null);
    if (!input) {
      setOutput('');
      return;
    }
    try {
      if (mode === 'encode') {
        setOutput(utf8ToBase64(input, urlSafe));
      } else {
        setOutput(base64ToUtf8(input));
      }
    } catch (e: any) {
      setError(mode === 'decode' ? 'Invalid Base64 payload. Check for illegal characters or missing padding.' : 'Encoding failed.');
      setOutput('');
    }
  };

  React.useEffect(() => {
    processText();
  }, [input, mode, urlSafe]);

  const handleSwap = () => {
    if (output && !error) {
      setInput(output);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (mode === 'encode') {
        const base64Content = result.includes(',') ? result.split(',')[1] : result;
        setInput(`// File: ${file.name} (${file.type})\n${file.type.startsWith('image/') ? result : base64Content}`);
      } else {
        setInput(result);
      }
    };
    if (file.type.startsWith('text/')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    if (onCopy) onCopy(output);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Base64 Encoder & Decoder
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Encode and decode UTF-8 text and binary files to Base64 with optional URL-safe format — 100% in your browser.
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
              onClick={() => onShare("Base64 Encoder & Decoder", "base64-encoder-decoder")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          )}
        </div>
      </div>

      {/* Mode Toolbar */}
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
            Encode to Base64
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'decode'
                ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Decode from Base64
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500"
            />
            <span>URL-Safe Base64 (- and _)</span>
          </label>

          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 cursor-pointer">
            <UploadCloud className="w-3.5 h-3.5 text-rose-500" />
            Upload File
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span className="font-semibold uppercase tracking-wider">{mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}</span>
            <span>{input.length} characters</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Type or paste text to encode...' : 'Paste Base64 string to decode...'}
            className="w-full h-72 p-4 font-mono text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none shadow-sm"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span className="font-semibold uppercase tracking-wider">{mode === 'encode' ? 'Base64 Result' : 'Plain Text Result'}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSwap}
                disabled={!output || !!error}
                className="hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 disabled:opacity-40"
                title="Use output as input and swap mode"
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
