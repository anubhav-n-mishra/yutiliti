import React, { useState, useMemo } from 'react';
import { Copy, Check, RefreshCw, Share2, Search, CheckCircle2, AlertCircle } from 'lucide-react';

interface RegexProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function RegexTester({ onCopy, onShare }: RegexProps) {
  const [pattern, setPattern] = useState<string>('\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean }>({
    g: true,
    i: true,
    m: false,
    s: false,
  });
  const [testString, setTestString] = useState<string>(
    'Contact support at help@yuitility.app or develop@yuitility.com for questions. Non-emails: test@, @domain.com.'
  );

  const activeFlags = useMemo(() => {
    let f = '';
    if (flags.g) f += 'g';
    if (flags.i) f += 'i';
    if (flags.m) f += 'm';
    if (flags.s) f += 's';
    return f;
  }, [flags]);

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [], error: null };
    try {
      const re = new RegExp(pattern, activeFlags);
      const list: { match: string; index: number; groups: string[] }[] = [];
      if (flags.g) {
        let m: RegExpExecArray | null;
        let count = 0;
        while ((m = re.exec(testString)) !== null && count < 500) {
          list.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          });
          count++;
          if (m.index === re.lastIndex) re.lastIndex++;
        }
      } else {
        const m = re.exec(testString);
        if (m) {
          list.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
          });
        }
      }
      return { matches: list, error: null };
    } catch (e: any) {
      return { matches: [], error: e.message };
    }
  }, [pattern, activeFlags, testString]);

  const highlightedHtml = useMemo(() => {
    if (!pattern || error || matches.length === 0) {
      return testString;
    }
    try {
      const re = new RegExp(pattern, activeFlags);
      return testString.replace(re, (m) => `<mark class="bg-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold px-0.5 rounded border border-rose-500/30">${m}</mark>`);
    } catch {
      return testString;
    }
  }, [pattern, activeFlags, testString, error, matches]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            RegEx Pattern Tester & Matcher
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Test and debug regular expressions in real-time with capture groups and live syntax highlighting.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onShare && (
            <button
              onClick={() => onShare("RegEx Tester", "regex-tester")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          )}
        </div>
      </div>

      {/* Pattern & Flags Bar */}
      <div className="p-4 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-zinc-400 text-sm">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regular expression pattern..."
              className={`w-full pl-7 pr-7 py-2.5 font-mono text-xs rounded-lg border bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none transition-all ${
                error
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-zinc-400 text-sm">/</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-zinc-500">Flags:</span>
            {[
              { id: 'g', label: 'g (global)' },
              { id: 'i', label: 'i (case-insensitive)' },
              { id: 'm', label: 'm (multiline)' },
              { id: 's', label: 's (dotAll)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFlags((prev) => ({ ...prev, [f.id]: !prev[f.id as keyof typeof flags] }))}
                className={`px-2.5 py-1.5 rounded-lg font-mono text-xs font-semibold border transition-all ${
                  flags[f.id as keyof typeof flags]
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400'
                    : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500'
                }`}
              >
                {f.id}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Regex Syntax Error: {error}</span>
          </div>
        )}
      </div>

      {/* Test String & Live Match Highlighting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span className="font-semibold uppercase tracking-wider">Test String</span>
            <span>{testString.length} chars</span>
          </div>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Type or paste test text here..."
            className="w-full h-72 p-4 font-mono text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span className="font-semibold uppercase tracking-wider">Live Match Preview</span>
            <span className="font-semibold text-rose-600">{matches.length} matches found</span>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: highlightedHtml.replace(/\n/g, '<br/>') }}
            className="w-full h-72 p-4 font-mono text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 overflow-y-auto whitespace-pre-wrap select-text shadow-sm"
          />
        </div>
      </div>

      {/* Matches Breakdown Table */}
      {matches.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
            Match Details & Capture Groups
          </h3>
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/80 shadow-sm">
            <div className="max-h-60 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
              {matches.map((m, i) => (
                <div key={i} className="p-3 text-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 font-mono">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold">
                      #{i + 1}
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{m.match}</span>
                    <span className="text-zinc-400 text-[11px]">at index {m.index}</span>
                  </div>
                  {m.groups.length > 0 && (
                    <div className="text-zinc-500 text-[11px] font-mono">
                      Groups: [{m.groups.map((g, gi) => `"${g}"`).join(', ')}]
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
