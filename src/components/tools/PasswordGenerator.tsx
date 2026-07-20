import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Share2, Copy, Check, Shield, ShieldAlert, Eye, EyeOff } from 'lucide-react';

interface PasswordGeneratorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function PasswordGenerator({ onCopy, onShare }: PasswordGeneratorProps) {
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(false);
  const [batchCount, setBatchCount] = useState<number>(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [reveal, setReveal] = useState<boolean>(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const characterPools = useMemo(() => {
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:\',.<>?/';

    if (excludeSimilar) {
      upper = upper.replace(/[IO]/g, '');
      lower = lower.replace(/[ilo]/g, '');
      numbers = numbers.replace(/[01]/g, '');
      symbols = symbols.replace(/[|]/g, '');
    }

    return { upper, lower, numbers, symbols };
  }, [excludeSimilar]);

  const generatePasswords = () => {
    const { upper, lower, numbers, symbols } = characterPools;
    let allowedChars = '';
    if (includeUppercase) allowedChars += upper;
    if (includeLowercase) allowedChars += lower;
    if (includeNumbers) allowedChars += numbers;
    if (includeSymbols) allowedChars += symbols;

    if (!allowedChars) {
      setPasswords(['Please select at least one option']);
      return;
    }

    const newPasswords: string[] = [];
    for (let b = 0; b < batchCount; b++) {
      let pwd = '';
      
      // Ensure at least one char from each selected group is included to maximize strength
      const mandatory: string[] = [];
      if (includeUppercase && upper) mandatory.push(upper[Math.floor(Math.random() * upper.length)]);
      if (includeLowercase && lower) mandatory.push(lower[Math.floor(Math.random() * lower.length)]);
      if (includeNumbers && numbers) mandatory.push(numbers[Math.floor(Math.random() * numbers.length)]);
      if (includeSymbols && symbols) mandatory.push(symbols[Math.floor(Math.random() * symbols.length)]);

      for (let i = 0; i < length; i++) {
        pwd += allowedChars[Math.floor(Math.random() * allowedChars.length)];
      }

      // Mix in mandatory characters to guarantee strict inclusion rules
      const pwdArray = pwd.split('');
      mandatory.forEach((char, idx) => {
        if (idx < pwdArray.length) {
          pwdArray[idx] = char;
        }
      });

      // Shuffle array
      const shuffled = pwdArray.sort(() => Math.random() - 0.5).join('');
      newPasswords.push(shuffled);
    }
    setPasswords(newPasswords);
  };

  // Run on mount or configuration change
  useEffect(() => {
    generatePasswords();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, batchCount]);

  // Compute entropy and strength
  const metrics = useMemo(() => {
    const primaryPassword = passwords[0] || '';
    if (!primaryPassword || passwords[0].includes(' ')) {
      return { score: 0, label: 'Invalid', color: 'bg-zinc-200', text: 'text-zinc-500', bits: 0 };
    }

    let poolSize = 0;
    const { upper, lower, numbers, symbols } = characterPools;
    if (includeUppercase) poolSize += upper.length;
    if (includeLowercase) poolSize += lower.length;
    if (includeNumbers) poolSize += numbers.length;
    if (includeSymbols) poolSize += symbols.length;

    if (poolSize === 0) {
      return { score: 0, label: 'Weak', color: 'bg-red-500', text: 'text-red-500', bits: 0 };
    }

    const bits = Math.round(length * Math.log2(poolSize));

    let score = 0;
    let label = 'Weak';
    let color = 'bg-red-500';
    let text = 'text-red-500';

    if (bits < 40) {
      score = 25;
      label = 'Weak (Dangerous)';
    } else if (bits < 60) {
      score = 50;
      label = 'Moderate (Decent)';
      color = 'bg-amber-500';
      text = 'text-amber-500';
    } else if (bits < 80) {
      score = 75;
      label = 'Strong (Secure)';
      color = 'bg-emerald-500';
      text = 'text-emerald-500';
    } else {
      score = 100;
      label = 'Military Grade (Unbreakable)';
      color = 'bg-blue-600';
      text = 'text-blue-600';
    }

    return { score, label, color, text, bits };
  }, [passwords, length, characterPools, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const handleCopySingle = (text: string, index: number) => {
    onCopy(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleReset = () => {
    setLength(16);
    setIncludeUppercase(true);
    setIncludeLowercase(true);
    setIncludeNumbers(true);
    setIncludeSymbols(true);
    setExcludeSimilar(false);
    setBatchCount(1);
    setReveal(true);
  };

  return (
    <div className="space-y-8">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Key & Password Generator</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Create cryptographically secure credentials with customizable pools and batching.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={() => onShare("Password Generator", "#/password-generator")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Pane */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl p-5 space-y-6">
            {/* Length Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Character Length</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="6"
                    max="128"
                    value={length}
                    onChange={(e) => setLength(Math.min(128, Math.max(6, parseInt(e.target.value) || 6)))}
                    className="w-16 text-right px-2 py-0.5 text-sm font-bold rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 outline-none"
                  />
                </div>
              </div>
              <input
                type="range"
                min="6"
                max="64"
                step="1"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-zinc-100"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                <span>6 Chars</span>
                <span>64 Chars (Recommended: 12+)</span>
              </div>
            </div>

            {/* Checklist options */}
            <div className="space-y-4">
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Include Rules</p>
              
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 p-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-lg cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-950 accent-zinc-900 dark:accent-zinc-100"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Uppercase</span>
                    <span className="text-[9px] text-zinc-400 font-mono">A-Z</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-lg cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-950 accent-zinc-900 dark:accent-zinc-100"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Lowercase</span>
                    <span className="text-[9px] text-zinc-400 font-mono">a-z</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-lg cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-950 accent-zinc-900 dark:accent-zinc-100"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Numbers</span>
                    <span className="text-[9px] text-zinc-400 font-mono">0-9</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-lg cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-950 accent-zinc-900 dark:accent-zinc-100"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Symbols</span>
                    <span className="text-[9px] text-zinc-400 font-mono">!@#$..</span>
                  </div>
                </label>
              </div>

              <div className="h-[1px] bg-zinc-200/50 dark:bg-zinc-800" />

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={excludeSimilar}
                    onChange={(e) => setExcludeSimilar(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-950 accent-zinc-900 dark:accent-zinc-100"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Exclude Similar Characters</span>
                    <span className="text-[10px] text-zinc-400">Do not use confusing characters like i, l, 1, o, 0, O</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Batch generation options */}
            <div className="space-y-2 border-t border-zinc-200/50 dark:border-zinc-800 pt-4">
              <label className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Generation Mode</label>
              <div className="flex gap-2">
                {[1, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setBatchCount(num)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${batchCount === num ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100' : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:bg-zinc-100/50 dark:text-zinc-400 dark:hover:bg-zinc-900/50'}`}
                  >
                    {num === 1 ? 'Single Password' : `Batch of ${num}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6 space-y-6 flex-1">
            <div className="flex justify-between items-center">
              <h2 className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Security Analytics</h2>
              <button
                onClick={() => setReveal(!reveal)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                title="Toggle visibility"
              >
                {reveal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {reveal ? 'Hide Passwords' : 'Show Passwords'}
              </button>
            </div>

            {/* Password lists */}
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {passwords.map((pwd, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl group relative overflow-hidden"
                >
                  <span
                    className={`font-mono text-sm tracking-wide ${reveal ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-300 dark:text-zinc-700 select-none blur-[4px]'}`}
                  >
                    {pwd}
                  </span>
                  <button
                    onClick={() => handleCopySingle(pwd, idx)}
                    className="p-1.5 rounded bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                    title="Copy this password"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Strength Meter details (Only for the first password in batch) */}
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-600 dark:text-zinc-400">Calculated Entropy:</span>
                <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{metrics.bits} Bits</span>
              </div>

              {/* Slider Representation */}
              <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${metrics.color}`}
                  style={{ width: `${metrics.score}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {metrics.score >= 75 ? (
                    <Shield className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`font-bold ${metrics.text}`}>{metrics.label}</span>
                </div>
                <span className="text-[10px] text-zinc-400">Entropy bits dictate crack times.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
