import React, { useState } from 'react';
import { HeartPulse, Copy, Check, Activity } from 'lucide-react';

interface TargetHeartRateCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function TargetHeartRateCalculator({ onCopy }: TargetHeartRateCalculatorProps) {
  const [age, setAge] = useState<string>('30');
  const [restingHr, setRestingHr] = useState<string>('65');
  const [method, setMethod] = useState<'karvonen' | 'standard'>('karvonen');
  const [copied, setCopied] = useState<boolean>(false);

  const a = parseFloat(age);
  const rhr = parseFloat(restingHr) || 60;

  const isValid = !isNaN(a) && a >= 10 && a <= 100;

  const results = (() => {
    if (!isValid) return null;

    // Tanaka Max HR formula: 208 - 0.7 * age (more accurate than 220 - age)
    const mhr = Math.round(208 - 0.7 * a);
    const standardMhr = Math.round(220 - a);
    const effectiveMhr = mhr;

    // Heart Rate Reserve = MHR - RHR
    const hrr = Math.max(0, effectiveMhr - rhr);

    const calcZone = (lowPct: number, highPct: number) => {
      if (method === 'karvonen') {
        const low = Math.round(rhr + hrr * lowPct);
        const high = Math.round(rhr + hrr * highPct);
        return `${low} – ${high} bpm`;
      } else {
        const low = Math.round(effectiveMhr * lowPct);
        const high = Math.round(effectiveMhr * highPct);
        return `${low} – ${high} bpm`;
      }
    };

    const zones = [
      {
        zone: 'Zone 1: Very Light',
        intensity: '50% – 60%',
        bpm: calcZone(0.5, 0.6),
        benefit: 'Warm-up, active recovery, improved base circulation.',
        color: 'text-slate-300 border-slate-700',
      },
      {
        zone: 'Zone 2: Light / Aerobic Base',
        intensity: '60% – 70%',
        bpm: calcZone(0.6, 0.7),
        benefit: 'Optimal fat burning, mitochondrial density, all-day endurance.',
        color: 'text-cyan-400 border-cyan-800/60',
      },
      {
        zone: 'Zone 3: Moderate / Tempo',
        intensity: '70% – 80%',
        bpm: calcZone(0.7, 0.8),
        benefit: 'Aerobic fitness, increased lung capacity, marathon pace.',
        color: 'text-emerald-400 border-emerald-800/60',
      },
      {
        zone: 'Zone 4: Hard / Lactate Threshold',
        intensity: '80% – 90%',
        bpm: calcZone(0.8, 0.9),
        benefit: 'Lactate clearance, speed endurance, high-intensity intervals.',
        color: 'text-amber-400 border-amber-800/60',
      },
      {
        zone: 'Zone 5: Maximum / VO2 Max',
        intensity: '90% – 100%',
        bpm: calcZone(0.9, 1.0),
        benefit: 'Peak athletic capacity, sprint intervals, neuromuscular power.',
        color: 'text-rose-400 border-rose-800/60',
      },
    ];

    return {
      mhr: effectiveMhr,
      standardMhr,
      hrr,
      zones,
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `Max HR: ${results.mhr} bpm | Zone 2 (Aerobic Base): ${results.zones[1].bpm} | Zone 4 (Threshold): ${results.zones[3].bpm}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Input */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400">
            <HeartPulse className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-white">Heart Rate Parameters</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMethod('karvonen')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                method === 'karvonen' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Karvonen (with Resting HR)
            </button>
            <button
              type="button"
              onClick={() => setMethod('standard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                method === 'standard' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              % of Max HR
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1">Age (Years)</label>
            <input
              type="number"
              min="10"
              max="100"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-base"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">
              Resting Heart Rate (BPM upon waking)
            </label>
            <input
              type="number"
              min="30"
              max="120"
              value={restingHr}
              onChange={(e) => setRestingHr(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-base"
            />
          </div>
        </div>

        {results && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
            <span className="text-slate-400">
              Estimated Max HR (Tanaka): <strong className="text-white">{results.mhr} bpm</strong>
            </span>
            <span className="text-slate-400">
              Heart Rate Reserve (HRR): <strong className="text-indigo-400">{results.hrr} bpm</strong>
            </span>
          </div>
        )}
      </div>

      {/* Zones Grid */}
      {results && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Target Heart Rate Training Zones</h4>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Zones'}
            </button>
          </div>

          <div className="space-y-2.5">
            {results.zones.map((z, idx) => (
              <div
                key={idx}
                className={`p-4 bg-slate-900/60 rounded-xl border ${z.color} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{z.zone}</span>
                    <span className="text-xs font-mono text-slate-400">({z.intensity})</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{z.benefit}</p>
                </div>
                <div className="text-xl font-mono font-black text-white shrink-0 sm:text-right">
                  {z.bpm}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
