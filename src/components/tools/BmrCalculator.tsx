"use client";

import { useMemo, useState } from "react";

export default function BmrCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState(30);
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);

  const stats = useMemo(() => {
    const w = Math.max(1, weightKg);
    const h = Math.max(1, heightCm);
    const a = Math.max(1, age);

    // Mifflin-St Jeor Equation:
    // BMR = 10W + 6.25H - 5A + S (S = +5 for male, -161 for female)
    const s = gender === "male" ? 5 : -161;
    const bmr = 10 * w + 6.25 * h - 5 * a + s;

    // TDEE estimates based on activity multipliers
    const sedentary = bmr * 1.2;
    const moderate = bmr * 1.55;
    const active = bmr * 1.725;

    return {
      bmr: Math.round(bmr),
      sedentary: Math.round(sedentary),
      moderate: Math.round(moderate),
      active: Math.round(active),
    };
  }, [gender, age, weightKg, heightCm]);

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">BMR Calculator (Basal Metabolic Rate)</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate baseline daily calories burned at complete rest using the Mifflin-St Jeor formula.</p>
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

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Age (Years)</label>
              <span className="text-blue-600 dark:text-cyan-300">{age} Years</span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              step="1"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Weight (kg)</label>
              <span className="text-blue-600 dark:text-cyan-300">{weightKg} kg</span>
            </div>
            <input
              type="range"
              min="30"
              max="200"
              step="1"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Height (cm)</label>
              <span className="text-blue-600 dark:text-cyan-300">{heightCm} cm</span>
            </div>
            <input
              type="range"
              min="120"
              max="220"
              step="1"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Basal Metabolic Rate (BMR)</p>
            <p className="mt-2 text-4xl font-extrabold text-zinc-950 dark:text-white">
              {stats.bmr.toLocaleString()}
              <span className="text-sm font-medium text-zinc-500"> kcal/day</span>
            </p>
          </div>

          <div className="mt-6 space-y-3 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Daily Calorie Maintenance (TDEE)</h4>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Sedentary (Little/no exercise)</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{stats.sedentary} kcal</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Moderate (3-5 days/wk)</span>
              <span className="font-semibold text-blue-600 dark:text-cyan-300">{stats.moderate} kcal</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Heavy Exercise (6-7 days/wk)</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.active} kcal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
