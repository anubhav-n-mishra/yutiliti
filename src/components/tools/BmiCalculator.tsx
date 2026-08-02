import React, { useState, useMemo } from 'react';
import { Activity, Scale, RefreshCw, Heart } from 'lucide-react';

interface BmiCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

type UnitSystem = 'metric' | 'imperial';

export default function BmiCalculator({ onCopy }: BmiCalculatorProps) {
  const [unit, setUnit] = useState<UnitSystem>('metric');

  // Metric inputs
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);

  // Imperial inputs
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);

  const calc = useMemo(() => {
    let bmi = 0;
    let heightInMeters = 0;

    if (unit === 'metric') {
      heightInMeters = heightCm / 100;
      if (heightInMeters > 0 && weightKg > 0) {
        bmi = weightKg / (heightInMeters * heightInMeters);
      }
    } else {
      const totalInches = heightFeet * 12 + heightInches;
      heightInMeters = totalInches * 0.0254;
      if (totalInches > 0 && weightLbs > 0) {
        bmi = (weightLbs / (totalInches * totalInches)) * 703;
      }
    }

    if (bmi <= 0 || !isFinite(bmi)) return null;

    let category = 'Normal weight';
    let categoryColor = 'text-emerald-600 dark:text-emerald-400';
    let advice = 'Maintain your current diet and active physical routine.';

    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'text-amber-600 dark:text-amber-400';
      advice = 'Consult a nutritionist to safely build muscle mass and increase healthy caloric intake.';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal weight';
      categoryColor = 'text-emerald-600 dark:text-emerald-400';
      advice = 'Great shape! Maintain a balanced diet and regular weekly physical activity.';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      categoryColor = 'text-orange-600 dark:text-orange-400';
      advice = 'Consider incorporating moderate cardio and portion awareness into daily routine.';
    } else {
      category = 'Obese';
      categoryColor = 'text-red-600 dark:text-red-400';
      advice = 'Recommend consulting a healthcare provider for personalized fitness and medical advice.';
    }

    // Healthy Weight Range for height (BMI 18.5 to 24.9)
    const minHealthyKg = 18.5 * (heightInMeters * heightInMeters);
    const maxHealthyKg = 24.9 * (heightInMeters * heightInMeters);

    const minHealthyLbs = minHealthyKg * 2.20462;
    const maxHealthyLbs = maxHealthyKg * 2.20462;

    const healthyRangeText =
      unit === 'metric'
        ? `${minHealthyKg.toFixed(1)} kg – ${maxHealthyKg.toFixed(1)} kg`
        : `${minHealthyLbs.toFixed(1)} lbs – ${maxHealthyLbs.toFixed(1)} lbs`;

    // Prime Index (BMI / 25)
    const bmiPrime = (bmi / 25).toFixed(2);

    return {
      bmi: bmi.toFixed(1),
      category,
      categoryColor,
      advice,
      healthyRangeText,
      bmiPrime,
    };
  }, [unit, weightKg, heightCm, weightLbs, heightFeet, heightInches]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <Scale className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Body Measurements
          </h3>

          <div className="flex rounded-xl bg-zinc-200/60 p-1 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setUnit('metric')}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                unit === 'metric' ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-white' : 'text-zinc-500'
              }`}
            >
              Metric (kg / cm)
            </button>
            <button
              type="button"
              onClick={() => setUnit('imperial')}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                unit === 'imperial' ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-white' : 'text-zinc-500'
              }`}
            >
              Imperial (lbs / ft)
            </button>
          </div>

          {unit === 'metric' ? (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Height (Feet)</label>
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Inches</label>
                  <input
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Weight (lbs)</label>
                <input
                  type="number"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {calc ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Body Mass Index (BMI)</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {calc.bmi}
                </div>
                <div className={`mt-1 font-bold text-sm ${calc.categoryColor}`}>{calc.category}</div>
              </div>

              <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                <div className="text-xs text-zinc-500">Healthy Weight Range for Height</div>
                <div className="font-bold text-zinc-900 dark:text-white">{calc.healthyRangeText}</div>
                <p className="mt-1 text-[11px] text-zinc-500">{calc.advice}</p>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`BMI: ${calc.bmi} (${calc.category}) | Healthy Weight Range: ${calc.healthyRangeText}`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy BMI Summary
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Please enter valid height & weight.</div>
          )}
        </div>
      </div>
    </div>
  );
}
