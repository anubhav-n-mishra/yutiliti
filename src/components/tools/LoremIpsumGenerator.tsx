import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Share2, Download, AlignLeft, Code } from 'lucide-react';

interface LoremProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
  "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip",
  "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat",
  "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum",
  "praesent", "sapien", "massa", "convallis", "pellentesque", "neque", "iaculis", "blandit", "facilisis", "volutpat"
];

export default function LoremIpsumGenerator({ onCopy, onShare }: LoremProps) {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [asHtml, setAsHtml] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const generateSentence = (wordsCount = 12): string => {
    const len = Math.max(5, wordsCount);
    const words: string[] = [];
    for (let i = 0; i < len; i++) {
      const idx = Math.floor(Math.random() * LOREM_WORDS.length);
      words.push(LOREM_WORDS[idx]);
    }
    const joined = words.join(' ');
    return joined.charAt(0).toUpperCase() + joined.slice(1) + '.';
  };

  const generateParagraph = (): string => {
    const sentences: string[] = [];
    const numSentences = Math.floor(Math.random() * 4) + 4; // 4 to 7 sentences
    for (let i = 0; i < numSentences; i++) {
      sentences.push(generateSentence(Math.floor(Math.random() * 8) + 8));
    }
    return sentences.join(' ');
  };

  const generate = () => {
    let result = '';
    const safeCount = Math.max(1, count);

    if (type === 'words') {
      const words: string[] = [];
      if (startWithLorem) {
        words.push("Lorem", "ipsum", "dolor", "sit", "amet");
      }
      while (words.length < safeCount) {
        const idx = Math.floor(Math.random() * LOREM_WORDS.length);
        words.push(LOREM_WORDS[idx]);
      }
      result = words.slice(0, safeCount).join(' ');
      if (asHtml) result = `<p>${result}</p>`;
    } else if (type === 'sentences') {
      const sentences: string[] = [];
      for (let i = 0; i < safeCount; i++) {
        if (i === 0 && startWithLorem) {
          sentences.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
        } else {
          sentences.push(generateSentence());
        }
      }
      result = asHtml
        ? sentences.map((s) => `<p>${s}</p>`).join('\n')
        : sentences.join(' ');
    } else {
      // paragraphs
      const paragraphs: string[] = [];
      for (let i = 0; i < safeCount; i++) {
        if (i === 0 && startWithLorem) {
          const lead = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
          paragraphs.push(lead);
        } else {
          paragraphs.push(generateParagraph());
        }
      }
      result = asHtml
        ? paragraphs.map((p) => `<p>${p}</p>`).join('\n\n')
        : paragraphs.join('\n\n');
    }

    setText(result);
  };

  useEffect(() => {
    generate();
  }, [type, count, startWithLorem, asHtml]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = asHtml ? 'html' : 'txt';
    const mime = asHtml ? 'text/html' : 'text/plain';
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lorem_ipsum.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Lorem Ipsum Dummy Text Generator
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Generate custom placeholder paragraphs, sentences, or word lists formatted as plain text or HTML.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </button>
          {onShare && (
            <button
              onClick={() => onShare("Lorem Ipsum Generator", "lorem-ipsum-generator")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Generate By</label>
              <div className="grid grid-cols-3 gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg">
                {[
                  { label: 'Paragraphs', val: 'paragraphs' },
                  { label: 'Sentences', val: 'sentences' },
                  { label: 'Words', val: 'words' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => {
                      setType(item.val as any);
                      setCount(item.val === 'paragraphs' ? 3 : item.val === 'sentences' ? 5 : 50);
                    }}
                    className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                      type === item.val
                        ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 font-semibold shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                <span>Count</span>
                <span className="font-semibold text-rose-600">
                  {count} {type}
                </span>
              </div>
              <input
                type="range"
                min={type === 'words' ? 10 : 1}
                max={type === 'words' ? 250 : type === 'sentences' ? 30 : 15}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500"
                />
                Start with &ldquo;Lorem ipsum dolor...&rdquo;
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={asHtml}
                  onChange={(e) => setAsHtml(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500"
                />
                Wrap with &lt;p&gt; HTML Tags
              </label>
            </div>

            <div className="pt-3 space-y-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Text'}
              </button>

              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download as .{asHtml ? 'html' : 'txt'}
              </button>
            </div>
          </div>
        </div>

        {/* Text Display */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex justify-between items-center text-xs text-zinc-500 pb-1">
            <span>Generated Text</span>
            <div className="flex items-center gap-3">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{text.length} characters</span>
            </div>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={text}
              className="w-full h-96 p-5 font-serif text-sm leading-relaxed rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 outline-none resize-none shadow-sm focus:ring-2 focus:ring-rose-500/20"
            />
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 transition-all text-xs flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
