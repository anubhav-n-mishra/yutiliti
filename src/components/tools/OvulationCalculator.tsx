import React, { useState } from 'react';
import { Heart, Calendar, Copy, Check, Sparkles, Baby } from 'lucide-react';

interface OvulationCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function OvulationCalculator({ onCopy }: OvulationCalculatorProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [lmpDate, setLmpDate] = useState<string>(todayStr);
  const [cycleDays, setCycleDays] = useState<string>('28');
  const [copied, setCopied] = useState<boolean>(false);

  const cycle = parseInt(cycleDays, 10);
  const isValid = lmpDate && !isNaN(cycle) && cycle >= 21 && cycle <= 45;

  const results = (() => {
    if (!isValid) return null;

    const lmp = new Date(lmpDate);
    if (isNaN(lmp.getTime())) return null;

    // Ovulation occurs approximately (cycle - 14) days after LMP
    const lutealDays = 14;
    const ovulationOffset = cycle - lutealDays;

    const ovulationDate = new Date(lmp);
    ovulationDate.setDate(ovulationDate.getDate() + ovulationOffset);

    // Fertile window: 5 days prior to ovulation up to 1 day after
    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    // Peak fertility (2 days prior + ovulation day)
    const peakStart = new Date(ovulationDate);
    peakStart.setDate(peakStart.getDate() - 2);

    // Next period
    const nextPeriod = new Date(lmp);
    nextPeriod.setDate(nextPeriod.getDate() + cycle);

    // Earliest pregnancy test (12 days post-ovulation)
    const testDate = new Date(ovulationDate);
    testDate.setDate(testDate.getDate() + 12);

    // Estimated due date if conceived: LMP + 280 days (Naegele's rule)
    const dueDate = new Date(lmp);
    dueDate.setDate(dueDate.getDate() + 280);

    const fmt = (d: Date) =>
      d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    return {
      ovulation: fmt(ovulationDate),
      fertileWindow: `${fmt(fertileStart)} – ${fmt(fertileEnd)}`,
      peakWindow: `${fmt(peakStart)} – ${fmt(ovulationDate)}`,
      nextPeriod: fmt(nextPeriod),
      testDate: fmt(testDate),
      dueDate: fmt(dueDate),
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `Estimated Ovulation: ${results.ovulation} | Fertile Window: ${results.fertileWindow} | Next Period: ${results.nextPeriod}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Inputs */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <Heart className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-white">Menstrual Cycle Details</h3>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">
              First Day of Last Menstrual Period (LMP)
            </label>
            <input
              type="date"
              value={lmpDate}
              onChange={(e) => setLmpDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">
              Average Cycle Length ({cycleDays} days)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="21"
                max="40"
                value={cycleDays}
                onChange={(e) => setCycleDays(e.target.value)}
                className="w-full accent-rose-500"
              />
              <span className="w-12 text-center text-sm font-mono font-bold text-white bg-slate-950 border border-slate-800 py-1 rounded-lg">
                {cycleDays}d
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Standard cycle is typically between 28 and 30 days.
            </p>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block mb-1">
              Estimated Ovulation Day
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white my-2">
              {results ? results.ovulation : '—'}
            </div>

            {results && (
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-800 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Fertile Window:</span>
                  <span className="text-emerald-400 font-bold">{results.fertileWindow}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Peak Conception:</span>
                  <span className="text-rose-300 font-bold">{results.peakWindow}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Next Expected Period:</span>
                  <span className="text-slate-200">{results.nextPeriod}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Earliest Pregnancy Test:</span>
                  <span className="text-indigo-300">{results.testDate}</span>
                </div>
              </div>
            )}
          </div>

          {results && (
            <button
              type="button"
              onClick={handleCopy}
              className="mt-6 w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Fertility Timeline'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
