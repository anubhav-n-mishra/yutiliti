"use client";

import { useMemo, useState } from "react";

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weightKg, setWeightKg] = useState(75);
  const [heightCm, setHeightCm] = useState(178);
  const [waistCm, setWaistCm] = useState(82);
  const [neckCm, setNeckCm] = useState(38);
  const [hipCm, setHipCm] = useState(95); // female only

  const stats = useMemo(() => {
    const w = Math.max(1, weightKg);
    const h = Math.max(1, heightCm);
    const waist = Math.max(1, waistCm);
    const neck = Math.max(1, neckCm);
    const hip = Math.max(1, hipCm);

    // US Navy Body Fat Formula
    let bodyFatPercent = 0;
    if (gender === "male") {
      // 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
      const diff = waist - neck;
      if (diff > 0) {
        bodyFatPercent = 86.01 * Math.log10(diff) - 70.041 * Math.log10(h) + 36.76;
      }
    } else {
      // 163.205 * log10(waist + hip - neck) - 97.884 * log10(height) - 78.387
      const sum = waist + hip - neck;
      if (sum > 0) {
        bodyFatPercent = 163.205 * Math.log10(sum) - 97.884 * Math.log10(h) - 78.387;
      }
    }

    bodyFatPercent = Math.max(2, Math.min(60, bodyFatPercent));

    const fatMass = (w * bodyFatPercent) / 100;
    const leanMass = w - fatMass;

    let category = "Fitness";
    if (gender === "male") {
      if (bodyFatPercent < 6) category = "Essential Fat";
      else if (bodyFatPercent < 14) category = "Athletes";
      else if (bodyFatPercent < 18) category = "Fitness";
      else if (bodyFatPercent < 25) category = "Average";
      else category = "Obese";
    } else {
      if (bodyFatPercent < 14) category = "Essential Fat";
      else if (bodyFatPercent < 21) category = "Athletes";
      else if (bodyFatPercent < 25) category = "Fitness";
      else if (bodyFatPercent < 32) category = "Average";
      else category = "Obese";
    }

    return {
      bodyFatPercent: isFinite(bodyFatPercent) ? bodyFatPercent : 0,
      fatMass: isFinite(fatMass) ? fatMass : 0,
      leanMass: isFinite(leanMass) ? leanMass : 0,
      category,
    };
  }, [gender, weightKg, heightCm, waistCm, neckCm, hipCm]);

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Body Fat Percentage Calculator</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Estimate body fat percentage, lean mass, and fat mass using US Navy anthropometric formulas.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Biological Sex</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`py-2 px-4 rounded-xl text-sm font-semibold transition ${
                  gender === "male"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`py-2 px-4 rounded-xl text-sm font-semibold transition ${
                  gender === "female"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                }`}
              >
                Female
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Waist (cm)</label>
              <input
                type="number"
                value={waistCm}
                onChange={(e) => setWaistCm(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Neck (cm)</label>
              <input
                type="number"
                value={neckCm}
                onChange={(e) => setNeckCm(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          {gender === "female" && (
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Hip (cm)</label>
              <input
                type="number"
                value={hipCm}
                onChange={(e) => setHipCm(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Body Fat Percentage</p>
            <p className="mt-2 text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats.bodyFatPercent.toFixed(1)}%
            </p>
            <p className="mt-1 text-xs text-zinc-500 font-medium">Category: {stats.category}</p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Lean Body Mass</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{stats.leanMass.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Body Fat Mass</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">{stats.fatMass.toFixed(1)} kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
