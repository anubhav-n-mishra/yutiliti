import React, { useState, useMemo } from 'react';
import { RefreshCw, Share2, Copy, Palette, Sparkles, Check, Info } from 'lucide-react';

interface ColorPaletteProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function ColorPalette({ onCopy, onShare }: ColorPaletteProps) {
  const [harmonyMode, setHarmonyMode] = useState<'analogous' | 'monochromatic' | 'complementary' | 'triad'>('analogous');
  const [baseColor, setBaseColor] = useState<string>('#3b82f6'); // standard Tailwind blue
  const [textColor, setTextColor] = useState<string>('#0f172a');
  const [contrastBgColor, setContrastBgColor] = useState<string>('#ffffff');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Helper: Hex to RGB
  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 0, g: 0, b: 0 };
  };

  // Helper: RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
    return "#" + ((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1);
  };

  // Helper: Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

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
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // Helper: Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360; s /= 100; l /= 100;
    let r = l, g = l, b = l;

    if (s !== 0) {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
  };

  // Harmonized palette computation
  const palette = useMemo(() => {
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors: string[] = [];

    switch (harmonyMode) {
      case 'analogous':
        colors.push(rgbToHex(hslToRgb((hsl.h + 330) % 360, hsl.s, hsl.l).r, hslToRgb((hsl.h + 330) % 360, hsl.s, hsl.l).g, hslToRgb((hsl.h + 330) % 360, hsl.s, hsl.l).b));
        colors.push(rgbToHex(hslToRgb((hsl.h + 345) % 360, hsl.s, hsl.l).r, hslToRgb((hsl.h + 345) % 360, hsl.s, hsl.l).g, hslToRgb((hsl.h + 345) % 360, hsl.s, hsl.l).b));
        colors.push(baseColor);
        colors.push(rgbToHex(hslToRgb((hsl.h + 15) % 360, hsl.s, hsl.l).r, hslToRgb((hsl.h + 15) % 360, hsl.s, hsl.l).g, hslToRgb((hsl.h + 15) % 360, hsl.s, hsl.l).b));
        colors.push(rgbToHex(hslToRgb((hsl.h + 30) % 360, hsl.s, hsl.l).r, hslToRgb((hsl.h + 30) % 360, hsl.s, hsl.l).g, hslToRgb((hsl.h + 30) % 360, hsl.s, hsl.l).b));
        break;

      case 'monochromatic':
        colors.push(rgbToHex(hslToRgb(hsl.h, hsl.s, Math.max(10, hsl.l - 30)).r, hslToRgb(hsl.h, hsl.s, Math.max(10, hsl.l - 30)).g, hslToRgb(hsl.h, hsl.s, Math.max(10, hsl.l - 30)).b));
        colors.push(rgbToHex(hslToRgb(hsl.h, hsl.s, Math.max(10, hsl.l - 15)).r, hslToRgb(hsl.h, hsl.s, Math.max(10, hsl.l - 15)).g, hslToRgb(hsl.h, hsl.s, Math.max(10, hsl.l - 15)).b));
        colors.push(baseColor);
        colors.push(rgbToHex(hslToRgb(hsl.h, hsl.s, Math.min(95, hsl.l + 15)).r, hslToRgb(hsl.h, hsl.s, Math.min(95, hsl.l + 15)).g, hslToRgb(hsl.h, hsl.s, Math.min(95, hsl.l + 15)).b));
        colors.push(rgbToHex(hslToRgb(hsl.h, hsl.s, Math.min(95, hsl.l + 30)).r, hslToRgb(hsl.h, hsl.s, Math.min(95, hsl.l + 30)).g, hslToRgb(hsl.h, hsl.s, Math.min(95, hsl.l + 30)).b));
        break;

      case 'complementary':
        colors.push(rgbToHex(hslToRgb(hsl.h, hsl.s, Math.max(10, hsl.l - 20)).r, hslToRgb(hsl.h, hsl.s, Math.max(10, hsl.l - 20)).g, hslToRgb(hsl.h, hsl.s, Math.max(10, hsl.l - 20)).b));
        colors.push(rgbToHex(hslToRgb(hsl.h, hsl.s, Math.max(10, hsl.l - 10)).r, hslToRgb(hsl.h, hsl.s, Math.max(10, hsl.l - 10)).g, hslToRgb(hsl.h, hsl.s, Math.max(10, hsl.l - 10)).b));
        colors.push(baseColor);
        const compHue = (hsl.h + 180) % 360;
        colors.push(rgbToHex(hslToRgb(compHue, hsl.s, Math.min(95, hsl.l + 10)).r, hslToRgb(compHue, hsl.s, Math.min(95, hsl.l + 10)).g, hslToRgb(compHue, hsl.s, Math.min(95, hsl.l + 10)).b));
        colors.push(rgbToHex(hslToRgb(compHue, hsl.s, Math.max(10, hsl.l - 10)).r, hslToRgb(compHue, hsl.s, Math.max(10, hsl.l - 10)).g, hslToRgb(compHue, hsl.s, Math.max(10, hsl.l - 10)).b));
        break;

      case 'triad':
        colors.push(rgbToHex(hslToRgb((hsl.h + 120) % 360, hsl.s, hsl.l).r, hslToRgb((hsl.h + 120) % 360, hsl.s, hsl.l).g, hslToRgb((hsl.h + 120) % 360, hsl.s, hsl.l).b));
        colors.push(rgbToHex(hslToRgb((hsl.h + 120) % 360, hsl.s, Math.max(10, hsl.l - 15)).r, hslToRgb((hsl.h + 120) % 360, hsl.s, Math.max(10, hsl.l - 15)).g, hslToRgb((hsl.h + 120) % 360, hsl.s, Math.max(10, hsl.l - 15)).b));
        colors.push(baseColor);
        colors.push(rgbToHex(hslToRgb((hsl.h + 240) % 360, hsl.s, Math.min(95, hsl.l + 15)).r, hslToRgb((hsl.h + 240) % 360, hsl.s, Math.min(95, hsl.l + 15)).g, hslToRgb((hsl.h + 240) % 360, hsl.s, Math.min(95, hsl.l + 15)).b));
        colors.push(rgbToHex(hslToRgb((hsl.h + 240) % 360, hsl.s, hsl.l).r, hslToRgb((hsl.h + 240) % 360, hsl.s, hsl.l).g, hslToRgb((hsl.h + 240) % 360, hsl.s, hsl.l).b));
        break;
    }

    return colors;
  }, [baseColor, harmonyMode]);

  // WCAG Contrast Ratio Calculations
  // Formulas: https://www.w3.org/TR/WCAG20-TECHS/G18.html
  const contrastRatio = useMemo(() => {
    const getLuminance = (rgb: { r: number, g: number, b: number }) => {
      const a = [rgb.r, rgb.g, rgb.b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const rgbText = hexToRgb(textColor);
    const rgbBg = hexToRgb(contrastBgColor);

    const l1 = getLuminance(rgbText);
    const l2 = getLuminance(rgbBg);

    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);

    return (brightest + 0.05) / (darkest + 0.05);
  }, [textColor, contrastBgColor]);

  // WCAG Criteria Check
  const contrastCriteria = useMemo(() => {
    const ratio = contrastRatio;
    return {
      normalAA: ratio >= 4.5,
      normalAAA: ratio >= 7,
      largeAA: ratio >= 3,
      largeAAA: ratio >= 4.5
    };
  }, [contrastRatio]);

  const handleCopySingle = (hex: string) => {
    onCopy(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1200);
  };

  const handleCopyPalette = () => {
    const text = `Color Scheme Harmony:\n${palette.join(', ')}`;
    onCopy(text);
  };

  const generateRandomBase = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setBaseColor(randomHex);
  };

  const handleReset = () => {
    setBaseColor('#3b82f6');
    setTextColor('#0f172a');
    setContrastBgColor('#ffffff');
    setHarmonyMode('analogous');
  };

  return (
    <div className="space-y-8">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Palette Designer & Contrast</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Generate mathematical color schemes and test WCAG text accessibility limits.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generateRandomBase}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-zinc-900 hover:opacity-95 dark:bg-zinc-100 dark:text-zinc-950 rounded-md transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Randomize
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleCopyPalette}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Copy Palette
          </button>
          <button
            onClick={() => onShare("Color Palette", "color-palette")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Pane */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl p-5 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                <Palette className="w-4 h-4 text-zinc-400" />
                Base Harmony Setup
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500">Pick Base Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-9 h-9 rounded border overflow-hidden cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="text-xs font-mono w-24 uppercase outline-none bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-2 py-1.5 rounded"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500">Harmony Model</label>
                <select
                  value={harmonyMode}
                  onChange={(e) => setHarmonyMode(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950 dark:text-zinc-50"
                >
                  <option value="analogous">Analogous (Adjacent)</option>
                  <option value="monochromatic">Monochromatic (Shades)</option>
                  <option value="complementary">Complementary (Contrast)</option>
                  <option value="triad">Triad (Equidistant)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Color palette display strip */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Compiled Color Scheme Harmony</p>
            <div className="grid grid-cols-5 gap-2.5 h-24">
              {palette.map((hex) => (
                <button
                  key={hex}
                  onClick={() => handleCopySingle(hex)}
                  className="rounded-xl overflow-hidden shadow-sm relative group flex flex-col justify-end p-2 border border-zinc-100 dark:border-zinc-900 outline-none"
                  style={{ backgroundColor: hex }}
                >
                  <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {copiedHex === hex ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Copy className="w-4 h-4 text-white" />
                    )}
                  </span>
                  <span className="font-mono text-[9px] font-bold text-white bg-black/40 px-1 py-0.5 rounded text-center select-all leading-none truncate w-full">
                    {hex.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-5 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">WCAG Accessibility Contrast Checker</h2>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-500">Text Hex</label>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-7 h-7 rounded border overflow-hidden cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="text-[11px] font-mono w-16 uppercase border rounded px-1.5 py-0.5 outline-none bg-white dark:bg-zinc-950"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-500">Background Hex</label>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="color"
                    value={contrastBgColor}
                    onChange={(e) => setContrastBgColor(e.target.value)}
                    className="w-7 h-7 rounded border overflow-hidden cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={contrastBgColor}
                    onChange={(e) => setContrastBgColor(e.target.value)}
                    className="text-[11px] font-mono w-16 uppercase border rounded px-1.5 py-0.5 outline-none bg-white dark:bg-zinc-950"
                  />
                </div>
              </div>
            </div>

            {/* Simulated Live preview block */}
            <div
              className="p-5 rounded-xl border text-center transition-all duration-300 shadow-sm"
              style={{ backgroundColor: contrastBgColor, color: textColor, borderColor: baseColor + '30' }}
            >
              <h3 className="text-base font-bold font-display">Simulated Headline</h3>
              <p className="text-xs mt-1 leading-relaxed max-w-[250px] mx-auto font-medium">
                The quick brown fox jumps over the lazy dog. Sample body text.
              </p>
            </div>

            <div className="h-[1px] bg-zinc-200/50 dark:bg-zinc-800" />

            <div className="flex justify-between items-center bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-100 dark:border-zinc-900">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Contrast Ratio:</span>
              <span className="font-mono font-bold text-lg text-zinc-900 dark:text-zinc-50">{contrastRatio.toFixed(2)} : 1</span>
            </div>

            {/* Criteria check cards */}
            <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-semibold">
              <div className={`p-2.5 rounded-lg border ${contrastCriteria.normalAA ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                <p>Normal Text (AA)</p>
                <p className="text-xs font-bold mt-0.5">{contrastCriteria.normalAA ? 'PASS (≥ 4.5)' : 'FAIL (< 4.5)'}</p>
              </div>
              <div className={`p-2.5 rounded-lg border ${contrastCriteria.normalAAA ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                <p>Normal Text (AAA)</p>
                <p className="text-xs font-bold mt-0.5">{contrastCriteria.normalAAA ? 'PASS (≥ 7.0)' : 'FAIL (< 7.0)'}</p>
              </div>
              <div className={`p-2.5 rounded-lg border ${contrastCriteria.largeAA ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                <p>Large Text (AA)</p>
                <p className="text-xs font-bold mt-0.5">{contrastCriteria.largeAA ? 'PASS (≥ 3.0)' : 'FAIL (< 3.0)'}</p>
              </div>
              <div className={`p-2.5 rounded-lg border ${contrastCriteria.largeAAA ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                <p>Large Text (AAA)</p>
                <p className="text-xs font-bold mt-0.5">{contrastCriteria.largeAAA ? 'PASS (≥ 4.5)' : 'FAIL (< 4.5)'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
