import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Share2, Palette } from 'lucide-react';

interface HexColorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function HexColorConverter({ onCopy, onShare }: HexColorProps) {
  const [hex, setHex] = useState<string>('#E11D48'); // Rose-600
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number }>({ r: 225, g: 29, b: 72 });
  const [hsl, setHsl] = useState<{ h: number; s: number; l: number }>({ h: 347, s: 77, l: 50 });
  const [cmyk, setCmyk] = useState<{ c: number; m: number; y: number; k: number }>({ c: 0, m: 87, y: 68, k: 12 });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const hexToRgb = (h: string) => {
    let clean = h.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    if (clean.length !== 6) return null;
    const num = parseInt(clean, 16);
    if (isNaN(num)) return null;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, Math.min(m, y));

    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);

    return { c, m, y, k };
  };

  const updateFromHex = (newHex: string) => {
    setHex(newHex);
    const parsed = hexToRgb(newHex);
    if (parsed) {
      setRgb(parsed);
      setHsl(rgbToHsl(parsed.r, parsed.g, parsed.b));
      setCmyk(rgbToCmyk(parsed.r, parsed.g, parsed.b));
    }
  };

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    if (onCopy) onCopy(val);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const colorFormats = [
    { label: 'HEX', val: hex.toUpperCase(), css: hex.toUpperCase() },
    { label: 'RGB', val: `${rgb.r}, ${rgb.g}, ${rgb.b}`, css: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', val: `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`, css: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'CMYK', val: `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`, css: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            HEX to RGB, HSL & CMYK Color Converter
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Convert color codes seamlessly between HEX, RGB, HSL, and CMYK with CSS code snippets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onShare && (
            <button
              onClick={() => onShare("HEX Color Converter", "hex-color-converter")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Color Swatch & Picker */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className="w-full aspect-video rounded-2xl shadow-inner border border-zinc-200 dark:border-zinc-800 flex items-end p-5 transition-all duration-200"
            style={{ backgroundColor: hex }}
          >
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur px-3.5 py-2 rounded-xl text-xs font-mono font-bold shadow-sm text-zinc-900 dark:text-zinc-100">
              {hex.toUpperCase()}
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex.startsWith('#') && hex.length === 7 ? hex : '#E11D48'}
                onChange={(e) => updateFromHex(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Pick Custom Color</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-400 font-mono">#</span>
              <input
                type="text"
                value={hex.replace('#', '')}
                onChange={(e) => updateFromHex('#' + e.target.value)}
                maxLength={6}
                className="w-24 px-3 py-1.5 font-mono text-xs uppercase font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
          </div>
        </div>

        {/* Right Formats Pane */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
            Converted Color Formats
          </h3>

          <div className="space-y-3">
            {colorFormats.map((item) => (
              <div
                key={item.label}
                className="p-4 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{item.label}</div>
                  <div className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 select-all">
                    {item.css}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(item.label, item.css)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all shrink-0"
                >
                  {copiedKey === item.label ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
