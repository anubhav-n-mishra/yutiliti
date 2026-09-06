import React, { useState } from 'react';
import { Footprints, Copy, Check, Flame, MapPin, Clock } from 'lucide-react';

interface StepToCalorieCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function StepToCalorieCalculator({ onCopy }: StepToCalorieCalculatorProps) {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [steps, setSteps] = useState<string>('10000');
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('175');
  const [intensity, setIntensity] = useState<number>(3.0); // MET: 3.0 = moderate walk ~3 mph
  const [copied, setCopied] = useState<boolean>(false);

  const numSteps = parseFloat(steps);
  const wKg = unit === 'metric' ? parseFloat(weight) : parseFloat(weight) * 0.45359237;
  const hCm = unit === 'metric' ? parseFloat(height) : parseFloat(height) * 2.54;

  const isValid = !isNaN(numSteps) && !isNaN(wKg) && !isNaN(hCm) && numSteps > 0 && wKg > 20;

  const results = (() => {
    if (!isValid) return null;

    // Stride length in meters (typically ~0.414 * height)
    const strideM = (hCm * 0.414) / 100;
    const distanceMeters = numSteps * strideM;
    const distanceKm = distanceMeters / 1000;
    const distanceMiles = distanceKm * 0.621371;

    // Speed in km/h based on MET intensity
    // MET 2.5 ~ 4.0 km/h, MET 3.0 ~ 4.8 km/h, MET 3.5 ~ 5.6 km/h, MET 6.0 ~ 8.0 km/h (jogging)
    const speedKmh = intensity === 2.5 ? 4.0 : intensity === 3.0 ? 4.8 : intensity === 3.5 ? 5.6 : 8.0;
    const durationHours = distanceKm / speedKmh;
    const durationMins = Math.round(durationHours * 60);

    // Calories = MET * weight_in_kg * time_in_hours
    const caloriesBurned = Math.round(intensity * wKg * durationHours);

    const hours = Math.floor(durationMins / 60);
    const mins = durationMins % 60;
    const timeFormatted = hours > 0 ? `${hours}h ${mins}m` : `${mins} mins`;

    return {
      caloriesBurned,
      distanceKm: distanceKm.toFixed(2),
      distanceMiles: distanceMiles.toFixed(2),
      timeFormatted,
      strideCm: (strideM * 100).toFixed(0),
    };
  })();

  const handleCopy = () => {
    if (!results) return;
    const text = `${steps} steps burned ~${results.caloriesBurned} kcal (${results.distanceKm} km / ${results.distanceMiles} mi in ${results.timeFormatted})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400">
          <Footprints className="w-5 h-5" />
          <span className="text-sm font-semibold text-white">Steps to Calories Burned</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUnit('metric')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              unit === 'metric' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Metric (kg, cm)
          </button>
          <button
            type="button"
            onClick={() => setUnit('imperial')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              unit === 'imperial' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Imperial (lbs, in)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Inputs */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Walking Metrics</h3>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-slate-300">Total Steps Walked</label>
              <div className="flex gap-1 text-[10px]">
                {['5000', '8000', '10000', '15000'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSteps(preset)}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono"
                  >
                    {parseInt(preset, 10).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-2xl font-bold font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Weight ({unit === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Height ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Walking Pace / Speed</label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
            >
              <option value="2.5">Casual Stroll (~2.5 mph / 4.0 km/h)</option>
              <option value="3.0">Moderate Pace (~3.0 mph / 4.8 km/h)</option>
              <option value="3.5">Brisk / Fast Walk (~3.5 mph / 5.6 km/h)</option>
              <option value="6.0">Light Jogging / Running (~5.0 mph / 8.0 km/h)</option>
            </select>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
              Estimated Energy Burned
            </span>
            <div className="text-5xl font-black font-mono text-white my-2">
              {results ? `${results.caloriesBurned}` : '—'}
              <span className="text-lg font-normal text-slate-400"> kcal</span>
            </div>

            {results && (
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800 font-mono text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-500 text-[10px] block">Distance</span>
                    <span className="text-white font-bold">{results.distanceKm} km</span>
                    <span className="text-[10px] text-slate-400 block">({results.distanceMiles} miles)</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-slate-500 text-[10px] block">Active Duration</span>
                    <span className="text-white font-bold">{results.timeFormatted}</span>
                    <span className="text-[10px] text-slate-400 block">Stride ~{results.strideCm}cm</span>
                  </div>
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
              {copied ? 'Copied' : 'Copy Activity Summary'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
