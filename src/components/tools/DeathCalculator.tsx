import React, { useState, useMemo } from 'react';
import { Skull, Heart, Activity, ShieldCheck, Sparkles } from 'lucide-react';

interface DeathCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function DeathCalculator({ onCopy }: DeathCalculatorProps) {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [exercise, setExercise] = useState<'regular' | 'moderate' | 'none'>('moderate');
  const [diet, setDiet] = useState<'healthy' | 'average' | 'junk'>('healthy');
  const [smoking, setSmoking] = useState<'no' | 'occasional' | 'daily'>('no');
  const [stress, setStress] = useState<'low' | 'moderate' | 'high'>('moderate');

  const longevity = useMemo(() => {
    // Base actuarial life expectancy
    let base = gender === 'female' ? 81 : 76;

    // Lifestyle adjustments
    if (exercise === 'regular') base += 3.5;
    else if (exercise === 'none') base -= 2.5;

    if (diet === 'healthy') base += 2.5;
    else if (diet === 'junk') base -= 3.0;

    if (smoking === 'occasional') base -= 4.0;
    else if (smoking === 'daily') base -= 9.0;

    if (stress === 'low') base += 1.5;
    else if (stress === 'high') base -= 3.5;

    const estimatedDeathAge = Math.max(currentAge + 1, Math.round(base));
    const remainingYears = Math.max(0, estimatedDeathAge - currentAge);
    const remainingDays = remainingYears * 365;
    const remainingHours = remainingDays * 24;

    const tips = [];
    if (smoking !== 'no') tips.push('Quitting smoking can add up to 7-10 years to your lifespan.');
    if (exercise === 'none') tips.push('Adding 150 minutes of weekly moderate walking adds ~3.5 years.');
    if (stress === 'high') tips.push('Mindfulness and stress-reduction routines reduce cardiovascular risk.');

    return {
      estimatedDeathAge,
      remainingYears,
      remainingDaysFormatted: remainingDays.toLocaleString(),
      remainingHoursFormatted: remainingHours.toLocaleString(),
      tips,
    };
  }, [currentAge, gender, exercise, diet, smoking, stress]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <Activity className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Health & Lifestyle Factors
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Biological Sex</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Physical Activity</label>
              <select
                value={exercise}
                onChange={(e) => setExercise(e.target.value as any)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="regular">Regular (3+ days/wk)</option>
                <option value="moderate">Moderate</option>
                <option value="none">Sedentary / None</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Diet Quality</label>
              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value as any)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="healthy">Balanced & Whole foods</option>
                <option value="average">Average</option>
                <option value="junk">High Processed/Fast Food</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Smoking</label>
              <select
                value={smoking}
                onChange={(e) => setSmoking(e.target.value as any)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="no">Non-Smoker</option>
                <option value="occasional">Occasional</option>
                <option value="daily">Daily Smoker</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Daily Stress</label>
              <select
                value={stress}
                onChange={(e) => setStress(e.target.value as any)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="low">Low Stress</option>
                <option value="moderate">Moderate</option>
                <option value="high">High / Chronic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Statistical Life Expectancy</span>
              <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                {longevity.estimatedDeathAge} <span className="text-xl font-medium text-zinc-500">years old</span>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Estimated ~{longevity.remainingYears} remaining years ({longevity.remainingDaysFormatted} days)
              </p>
            </div>

            {longevity.tips.length > 0 && (
              <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                <div className="text-xs font-bold text-zinc-900 dark:text-white">Longevity Enhancement Tips</div>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-zinc-600 dark:text-zinc-300">
                  {longevity.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={() => onCopy(`Statistical Life Expectancy: ${longevity.estimatedDeathAge} years (${longevity.remainingYears} years remaining)`)}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
            >
              Copy Longevity Estimate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
