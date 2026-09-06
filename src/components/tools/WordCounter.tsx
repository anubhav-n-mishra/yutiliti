import React, { useState, useMemo } from 'react';
import { RefreshCw, Share2, Copy, Trash2, Info, ChevronDown, ChevronUp, Clock, MessageSquare, ListFilter } from 'lucide-react';

interface WordCounterProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function WordCounter({ onCopy, onShare }: WordCounterProps) {
  const [text, setText] = useState<string>(
    `Yuitility is an absolute masterpiece of minimalist utility design! Explore beautiful financial, media, and development utilities crafted to run instantly in the client browser with 100% privacy.`
  );
  const [excludeStopWords, setExcludeStopWords] = useState<boolean>(true);
  const [showDensity, setShowDensity] = useState<boolean>(true);

  // Stop words to filter out for keyword density
  const stopWordsList = useMemo(() => {
    return new Set([
      'the', 'a', 'an', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'by', 'from', 'with', 'under', 'above',
      'to', 'in', 'is', 'it', 'of', 'that', 'this', 'these', 'those', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'as', 'if', 'i', 'you', 'he', 'she', 'we', 'they', 'me', 'us',
      'him', 'her', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'will', 'would', 'shall', 'should', 'can',
      'could', 'may', 'might', 'must', 'about', 'into', 'than', 'then', 'up', 'down', 'out', 'into', 'over'
    ]);
  }, []);

  const stats = useMemo(() => {
    const rawLength = text.length;
    const noSpacesLength = text.replace(/\s+/g, '').length;
    
    // Split into words
    const wordsArray: string[] = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount = wordsArray.length;

    // Split into sentences (split on period, question mark, exclamation, followed by spaces)
    const sentencesArray = text.split(/[.!?]+(?=\s|$)/).filter(s => s.trim().length > 0);
    const sentenceCount = sentencesArray.length;

    // Split into paragraphs (split on double newline or newline)
    const paragraphsArray = text.split(/\n+/).filter(p => p.trim().length > 0);
    const paragraphCount = paragraphsArray.length;

    // Estimations
    const readTimeMins = wordCount / 200; // Average 200 words per minute
    const speakTimeMins = wordCount / 130; // Average 130 words per minute

    const formatTime = (minutes: number) => {
      const seconds = Math.round((minutes % 1) * 60);
      const mins = Math.floor(minutes);
      if (mins === 0) return `${seconds}s`;
      return `${mins}m ${seconds}s`;
    };

    // Keyword Density calculations
    const freq: { [key: string]: number } = {};
    wordsArray.forEach((w) => {
      if (excludeStopWords && stopWordsList.has(w)) return;
      if (w.length <= 2) return; // skip very short words
      freq[w] = (freq[w] || 0) + 1;
    });

    const densityArray = Object.entries(freq)
      .map(([word, count]) => ({
        word,
        count,
        density: wordCount > 0 ? (count / wordCount) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      charCount: rawLength,
      charNoSpaces: noSpacesLength,
      wordCount,
      sentenceCount,
      paragraphCount,
      readTime: formatTime(readTimeMins),
      speakTime: formatTime(speakTimeMins),
      density: densityArray
    };
  }, [text, excludeStopWords, stopWordsList]);

  const handleCaseConvert = (mode: 'upper' | 'lower' | 'title' | 'sentence' | 'slug') => {
    let converted = '';
    switch (mode) {
      case 'upper':
        converted = text.toUpperCase();
        break;
      case 'lower':
        converted = text.toLowerCase();
        break;
      case 'title':
        converted = text
          .toLowerCase()
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        break;
      case 'sentence':
        // Capitalize first letter after each period
        converted = text
          .toLowerCase()
          .replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, g1, g2) => g1 + g2.toUpperCase());
        break;
      case 'slug':
        converted = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        break;
      default:
        converted = text;
    }
    setText(converted);
  };

  const handleCopyText = () => {
    onCopy(text);
  };

  const handleReset = () => {
    setText('');
  };

  return (
    <div className="space-y-8">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Word & Text Analyzer</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Perform real-time counting, keyword density charting, and quick case mutations.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Copy Text
          </button>
          <button
            onClick={() => onShare("Word & Text Counter", "word-counter")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Pane */}
        <div className="lg:col-span-8 space-y-4">
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type, paste, or format your manuscript text block here..."
            className="w-full p-4 text-sm bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950 dark:text-zinc-50 focus:border-zinc-400 dark:focus:border-zinc-700 font-sans shadow-sm leading-relaxed"
          />

          {/* Mutation controls */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-lg">
            <button
              onClick={() => handleCaseConvert('upper')}
              className="px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => handleCaseConvert('lower')}
              className="px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              lowercase
            </button>
            <button
              onClick={() => handleCaseConvert('title')}
              className="px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Title Case
            </button>
            <button
              onClick={() => handleCaseConvert('sentence')}
              className="px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Sentence case
            </button>
            <button
              onClick={() => handleCaseConvert('slug')}
              className="px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              slug-ify
            </button>
          </div>
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-4 space-y-4">
          {/* Grid Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl">
              <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase">Words</p>
              <p className="text-xl font-bold text-zinc-950 dark:text-zinc-50 font-mono mt-1">{stats.wordCount.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl">
              <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase">Characters</p>
              <p className="text-xl font-bold text-zinc-950 dark:text-zinc-50 font-mono mt-1">{stats.charCount.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl">
              <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase">Sentences</p>
              <p className="text-xl font-bold text-zinc-950 dark:text-zinc-50 font-mono mt-1">{stats.sentenceCount}</p>
            </div>
            <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl">
              <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase">Paragraphs</p>
              <p className="text-xl font-bold text-zinc-950 dark:text-zinc-50 font-mono mt-1">{stats.paragraphCount}</p>
            </div>
          </div>

          {/* Time metrics */}
          <div className="bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
              <span className="flex items-center gap-1.5 text-zinc-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                Reading Time:
              </span>
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50">{stats.readTime}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-zinc-500 font-medium">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                Speaking Duration:
              </span>
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50">{stats.speakTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keyword Density List */}
      <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
        <button
          onClick={() => setShowDensity(!showDensity)}
          className="w-full flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 outline-none"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Keyword Frequency Density</h2>
            <span className="text-[10px] text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full font-medium">Top 10 keywords</span>
          </div>
          <div className="flex items-center gap-3">
            <label onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={excludeStopWords}
                onChange={(e) => setExcludeStopWords(e.target.checked)}
                className="w-3.5 h-3.5 accent-zinc-800"
              />
              Exclude Stop Words
            </label>
            {showDensity ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </div>
        </button>

        {showDensity && (
          <div className="p-4 space-y-4">
            {stats.density.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-4">Not enough structured text to compile densities.</p>
            ) : (
              <div className="space-y-3">
                {stats.density.map((d) => (
                  <div key={d.word} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{d.word}</span>
                      <span className="font-mono text-zinc-500">{d.count} ({d.density.toFixed(1)}%)</span>
                    </div>
                    {/* Progress representation */}
                    <div className="h-1 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-800 dark:bg-zinc-200"
                        style={{ width: `${d.density * 5}%` }} // Multiply to make difference visual
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
