import React, { useState } from 'react';
import { Copy, Check, ArrowRightLeft, Volume2, RefreshCw, Share2, Play, Square } from 'lucide-react';

interface MorseProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/', '.': '.-.-.-', ',': '--..--',
  '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.',
  ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-',
  '@': '.--.-.'
};

const REVERSE_MORSE: Record<string, string> = Object.entries(MORSE_MAP).reduce((acc, [char, code]) => {
  acc[code] = char;
  return acc;
}, {} as Record<string, string>);

export default function MorseCodeTranslator({ onCopy, onShare }: MorseProps) {
  const [mode, setMode] = useState<'text-to-morse' | 'morse-to-text'>('text-to-morse');
  const [input, setInput] = useState<string>('SOS WE ARE LAUNCHING YUITILITY');
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const translate = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (mode === 'text-to-morse') {
      const upper = input.toUpperCase();
      const morse = upper
        .split('')
        .map((char) => MORSE_MAP[char] || char)
        .join(' ');
      setOutput(morse);
    } else {
      // morse to text
      const words = input.trim().split('   '); // 3 spaces = word separator
      const decodedWords = words.map((w) => {
        const letters = w.split(' ');
        return letters.map((l) => REVERSE_MORSE[l] || (l === '/' ? ' ' : l)).join('');
      });
      setOutput(decodedWords.join(' '));
    }
  };

  React.useEffect(() => {
    translate();
  }, [input, mode]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    if (onCopy) onCopy(output);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    if (output) {
      setInput(output);
      setMode(mode === 'text-to-morse' ? 'morse-to-text' : 'text-to-morse');
    }
  };

  // Play audio beeps via Web Audio API
  const playAudio = async () => {
    if (isPlaying) return;
    const morseCode = mode === 'text-to-morse' ? output : input;
    if (!morseCode) return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      setIsPlaying(true);

      const dotTime = 0.08; // 80ms
      let currentTime = ctx.currentTime + 0.05;

      for (const symbol of morseCode) {
        if (symbol === '.') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = 600;
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(currentTime);
          osc.stop(currentTime + dotTime);
          currentTime += dotTime + dotTime; // sound + intra-char gap
        } else if (symbol === '-') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.value = 600;
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(currentTime);
          osc.stop(currentTime + dotTime * 3);
          currentTime += dotTime * 3 + dotTime;
        } else if (symbol === ' ') {
          currentTime += dotTime * 2; // inter-char gap
        } else if (symbol === '/') {
          currentTime += dotTime * 6; // word gap
        }
      }

      setTimeout(() => {
        setIsPlaying(false);
      }, (currentTime - ctx.currentTime) * 1000);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Morse Code Translator & Sound Player
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Translate English text to Morse code and decode Morse code back to text with real-time Web Audio beeps.
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
              onClick={() => onShare("Morse Code Translator", "morse-code-translator")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          )}
        </div>
      </div>

      {/* Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl">
          <button
            onClick={() => setMode('text-to-morse')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'text-to-morse'
                ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Text ➔ Morse Code
          </button>
          <button
            onClick={() => setMode('morse-to-text')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'morse-to-text'
                ? 'bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            Morse Code ➔ Text
          </button>
        </div>

        <button
          onClick={playAudio}
          disabled={isPlaying || !output}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-rose-600 dark:hover:bg-rose-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
        >
          {isPlaying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Volume2 className="w-3.5 h-3.5" />}
          {isPlaying ? 'Playing Audio Beeps...' : 'Play Morse Audio'}
        </button>
      </div>

      {/* Inputs and Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span className="font-semibold uppercase tracking-wider">{mode === 'text-to-morse' ? 'English Text' : 'Morse Code (Dots & Dashes)'}</span>
            <span>{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'text-to-morse' ? 'Enter plain text...' : 'Enter morse (e.g. ... --- ...)'}
            className="w-full h-64 p-4 font-mono text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span className="font-semibold uppercase tracking-wider">{mode === 'text-to-morse' ? 'Morse Code Output' : 'Decoded Text'}</span>
            <button
              onClick={handleSwap}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" /> Swap
            </button>
          </div>

          <div className="relative h-64">
            <textarea
              readOnly
              value={output}
              placeholder="Translation will appear here instantly..."
              className="w-full h-full p-4 font-mono text-sm tracking-wider rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 outline-none resize-none shadow-sm"
            />
            {output && (
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 transition-all text-xs flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
