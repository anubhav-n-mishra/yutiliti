import React, { useState } from 'react';
import { Timer, Copy, Check, Route, Zap } from 'lucide-react';

interface RunningPaceCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

type Mode = 'pace' | 'time' | 'distance';

export default function RunningPaceCalculator({ onCopy }: RunningPaceCalculatorProps) {
  const [mode, setMode] = useState<Mode>('pace');
  const [unit, setUnit] = useState<'km' | 'miles'>('km');

  // Distance
  const [distance, setDistance] = useState<string>('10');

  // Time
  const [hours, setHours] = useState<string>('0');
  const [minutes, setMinutes] = useState<string>('50');
  const [seconds, setSeconds] = useState<string>('0');

  // Pace
  const [paceMins, setPaceMins] = useState<string>('5');
  const [paceSecs, setPaceSecs] = useState<string>('0');

  const [copied, setCopied] = useState<boolean>(false);

  // Quick preset events
  const applyPreset = (kmDist: number) => {
    const d = unit === 'km' ? kmDist : kmDist * 0.621371;
    setDistance(d.toFixed(2));
  };

  const totalTimeSeconds =
    (parseFloat(hours) || 0) * 3600 + (parseFloat(minutes) || 0) * 60 + (parseFloat(seconds) || 0);

  const paceSecondsPerUnit = (parseFloat(paceMins) || 0) * 60 + (parseFloat(paceSecs) || 0);

  const distVal = parseFloat(distance);

  const results = (() => {
    const fmtTime = (totalSec: number) => {
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = Math.round(totalSec % 60);
      if (h > 0) {
        return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
      }
      return `${m}m ${s.toString().padStart(2, '0')}s`;
    };

    if (mode === 'pace') {
      if (isNaN(distVal) || distVal <= 0 || totalTimeSeconds <= 0) return null;
      const paceSec = totalTimeSeconds / distVal;
      const paceKm = unit === 'km' ? paceSec : paceSec / 1.60934;
      const paceMi = unit === 'miles' ? paceSec : paceSec * 1.60934;
      const speedKmh = (distVal / totalTimeSeconds) * 3600 * (unit === 'km' ? 1 : 1.60934);

      return {
        primaryPace: `${fmtTime(paceSec)} / ${unit}`,
        altPace: `${fmtTime(unit === 'km' ? paceMi : paceKm)} / ${unit === 'km' ? 'mi' : 'km'}`,
        speed: `${speedKmh.toFixed(2)} km/h (${(speedKmh * 0.621371).toFixed(2)} mph)`,
        splits: Array.from({ length: Math.min(10, Math.ceil(distVal)) }).map((_, i) => ({
          split: i + 1,
          time: fmtTime(paceSec * (i + 1)),
        })),
      };
    } else if (mode === 'time') {
      if (isNaN(distVal) || distVal <= 0 || paceSecondsPerUnit <= 0) return null;
      const finishSec = distVal * paceSecondsPerUnit;
      return {
        finishTime: fmtTime(finishSec),
        speed: `${((3600 / paceSecondsPerUnit) * (unit === 'km' ? 1 : 1.60934)).toFixed(2)} km/h`,
      };
    } else {
      // Distance
      if (totalTimeSeconds <= 0 || paceSecondsPerUnit <= 0) return null;
      const d = totalTimeSeconds / paceSecondsPerUnit;
      return {
        calcDistance: `${d.toFixed(2)} ${unit}`,
      };
    }
  })();

  const handleCopy = () => {
    if (!results) return;
    const text =
      mode === 'pace'
        ? `Running Pace: ${results.primaryPace} (${results.speed})`
        : mode === 'time'
        ? `Estimated Finish Time: ${results.finishTime}`
        : `Calculated Distance: ${results.calcDistance}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('pace')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              mode === 'pace' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Calculate Pace
          </button>
          <button
            type="button"
            onClick={() => setMode('time')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              mode === 'time' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Calculate Finish Time
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUnit('km')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              unit === 'km' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kilometers (km)
          </button>
          <button
            type="button"
            onClick={() => setUnit('miles')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              unit === 'miles' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Miles (mi)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Race & Running Metrics</h3>

          {/* Presets */}
          <div>
            <span className="text-[11px] text-slate-500 block mb-1.5">Standard Distance Presets:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset(5)}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                5K
              </button>
              <button
                type="button"
                onClick={() => applyPreset(10)}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                10K
              </button>
              <button
                type="button"
                onClick={() => applyPreset(21.0975)}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                Half Marathon
              </button>
              <button
                type="button"
                onClick={() => applyPreset(42.195)}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                Marathon
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Distance ({unit})</label>
            <input
              type="number"
              step="0.01"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-base"
            />
          </div>

          {mode === 'pace' ? (
            <div>
              <label className="text-xs text-slate-300 block mb-1">Total Time (Hours : Mins : Secs)</label>
              <div className="grid grid-cols-3 gap-2 font-mono">
                <input
                  type="number"
                  placeholder="H"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-center text-white text-base"
                />
                <input
                  type="number"
                  placeholder="M"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-center text-white text-base"
                />
                <input
                  type="number"
                  placeholder="S"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-center text-white text-base"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs text-slate-300 block mb-1">Pace (Mins : Secs per {unit})</label>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <input
                  type="number"
                  placeholder="Mins"
                  value={paceMins}
                  onChange={(e) => setPaceMins(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-center text-white text-base"
                />
                <input
                  type="number"
                  placeholder="Secs"
                  value={paceSecs}
                  onChange={(e) => setPaceSecs(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-center text-white text-base"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
              {mode === 'pace' ? 'Calculated Pace' : 'Predicted Finish Time'}
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono text-white my-2">
              {results
                ? mode === 'pace'
                  ? results.primaryPace
                  : results.finishTime
                : '—'}
            </div>

            {results && mode === 'pace' && (
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-800 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Alternate Pace:</span>
                  <span className="font-bold text-white">{results.altPace}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Speed:</span>
                  <span className="font-bold text-emerald-400">{results.speed}</span>
                </div>
              </div>
            )}
          </div>

          {results && (
            <button
              type="button"
              onClick={handleCopy}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Pace Summary'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
