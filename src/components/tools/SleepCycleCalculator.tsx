import React, { useState } from 'react';
import { Moon, Sun, Clock, Copy, Check, Sparkles } from 'lucide-react';

interface SleepCycleCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function SleepCycleCalculator({ onCopy }: SleepCycleCalculatorProps) {
  const [mode, setMode] = useState<'wakeAt' | 'sleepNow'>('wakeAt');
  const [wakeTime, setWakeTime] = useState<string>('07:00');
  const [latencyMins, setLatencyMins] = useState<number>(15);
  const [copiedTime, setCopiedTime] = useState<string | null>(null);

  // Format helper
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Calculate 90-minute sleep cycles
  const cycles = (() => {
    const list = [];
    // 90 minutes per cycle
    const cycleDurationMs = 90 * 60 * 1000;
    const latencyMs = latencyMins * 60 * 1000;

    if (mode === 'wakeAt') {
      const [h, m] = wakeTime.split(':').map(Number);
      const targetDate = new Date();
      targetDate.setHours(h, m, 0, 0);

      // Bedtimes going backwards from 6 cycles down to 3
      for (let c = 6; c >= 3; c--) {
        const sleepTimeMs = targetDate.getTime() - (c * cycleDurationMs + latencyMs);
        const bedDate = new Date(sleepTimeMs);
        list.push({
          count: c,
          hours: (c * 1.5).toFixed(1),
          timeStr: formatTime(bedDate),
          recommended: c === 5,
        });
      }
    } else {
      // Sleep right now
      const now = new Date();
      // Wakeup times going forwards from 3 cycles to 6
      for (let c = 3; c <= 6; c++) {
        const wakeTimeMs = now.getTime() + latencyMs + c * cycleDurationMs;
        const wakeDate = new Date(wakeTimeMs);
        list.push({
          count: c,
          hours: (c * 1.5).toFixed(1),
          timeStr: formatTime(wakeDate),
          recommended: c === 5,
        });
      }
    }

    return list;
  })();

  const handleCopy = (t: string) => {
    navigator.clipboard.writeText(t);
    setCopiedTime(t);
    if (onCopy) onCopy(t);
    setTimeout(() => setCopiedTime(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setMode('wakeAt')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            mode === 'wakeAt' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sun className="w-3.5 h-3.5" /> I need to wake up at...
        </button>
        <button
          type="button"
          onClick={() => setMode('sleepNow')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            mode === 'sleepNow' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Moon className="w-3.5 h-3.5" /> If I go to sleep right now...
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Sleep Settings</h3>

          {mode === 'wakeAt' ? (
            <div>
              <label className="text-xs text-slate-300 block mb-1">Target Wake Up Time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-2xl font-bold font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          ) : (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
              Calculating optimal wake-up intervals based on the current time.
            </div>
          )}

          <div>
            <label className="text-xs text-slate-300 block mb-1">
              Time to Fall Asleep ({latencyMins} minutes)
            </label>
            <input
              type="range"
              min="5"
              max="45"
              step="5"
              value={latencyMins}
              onChange={(e) => setLatencyMins(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Average adult takes 10 to 20 minutes to transition into sleep.
            </span>
          </div>
        </div>

        {/* Results Cards */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-sm font-semibold text-white">
            {mode === 'wakeAt' ? 'Recommended Bedtimes' : 'Recommended Wake Up Times'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cycles.map((item) => (
              <div
                key={item.count}
                className={`p-4 rounded-xl border flex items-center justify-between transition ${
                  item.recommended
                    ? 'border-emerald-500/60 bg-emerald-950/30'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black font-mono text-white">{item.timeStr}</span>
                    {item.recommended && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Optimal
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono block mt-0.5">
                    {item.count} sleep cycles ({item.hours} hours)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(item.timeStr)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                  title="Copy time"
                >
                  {copiedTime === item.timeStr ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 pt-2">
            Waking up in the middle of a 90-minute sleep cycle causes sleep inertia and morning fatigue. Waking at the end of a cycle leaves you feeling alert and refreshed.
          </p>
        </div>
      </div>
    </div>
  );
}
