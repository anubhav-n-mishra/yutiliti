import React, { useState, useMemo } from 'react';
import { Dog, Heart, Info, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';

interface DogAgeCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

type BreedSize = 'small' | 'medium' | 'large' | 'giant';

export default function DogAgeCalculator({ onCopy }: DogAgeCalculatorProps) {
  const [dogYears, setDogYears] = useState<number>(3);
  const [dogMonths, setDogMonths] = useState<number>(6);
  const [breedSize, setBreedSize] = useState<BreedSize>('medium');

  const result = useMemo(() => {
    const ageInYears = Math.max(0, dogYears) + Math.max(0, Math.min(11, dogMonths)) / 12;

    if (ageInYears <= 0) {
      return { humanAge: 0, lifeStage: 'Newborn', advice: 'Keep puppy warm and with mom.' };
    }

    let humanAge = 0;

    if (ageInYears <= 1) {
      // First year of dog's life equals ~15 human years
      humanAge = ageInYears * 15;
    } else if (ageInYears <= 2) {
      // Second year adds ~9 human years (Total 24)
      humanAge = 15 + (ageInYears - 1) * 9;
    } else {
      // Year 3+ rate depends on size
      const sizeMultipliers: Record<BreedSize, number> = {
        small: 4.0,   // Small dogs age ~4 human yrs per dog yr
        medium: 5.0,  // Medium dogs age ~5 human yrs per dog yr
        large: 6.0,   // Large dogs age ~6 human yrs per dog yr
        giant: 7.5,   // Giant breeds age ~7.5 human yrs per dog yr
      };

      humanAge = 24 + (ageInYears - 2) * sizeMultipliers[breedSize];
    }

    const roundedHumanAge = Math.round(humanAge);

    let lifeStage = 'Puppy';
    let advice = 'High energy, socialization phase, active training recommended.';

    if (ageInYears >= 1 && roundedHumanAge < 24) {
      lifeStage = 'Junior / Young Adult';
      advice = 'High physical energy. Ensure annual vet checkups and regular exercise.';
    } else if (roundedHumanAge >= 24 && roundedHumanAge < 55) {
      lifeStage = 'Adult';
      advice = 'Prime adulthood. Maintain balanced diet, dental care, and steady exercise routine.';
    } else if (roundedHumanAge >= 55 && roundedHumanAge < 75) {
      lifeStage = 'Senior';
      advice = 'Transition to senior care. Check joint health, perform biannual blood tests, soft bedding.';
    } else if (roundedHumanAge >= 75) {
      lifeStage = 'Geriatric';
      advice = 'Gentle care, orthopedic support, high-digestibility senior diet, extra warmth and comfort.';
    }

    return {
      humanAge: roundedHumanAge,
      lifeStage,
      advice,
    };
  }, [dogYears, dogMonths, breedSize]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <Dog className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Dog Details
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Breed Size Category</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { id: 'small', label: 'Small', desc: '<20 lbs' },
                { id: 'medium', label: 'Medium', desc: '21-50 lbs' },
                { id: 'large', label: 'Large', desc: '51-90 lbs' },
                { id: 'giant', label: 'Giant', desc: '>90 lbs' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBreedSize(item.id as BreedSize)}
                  className={`rounded-xl border p-2.5 text-center transition ${
                    breedSize === item.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-cyan-400 dark:bg-cyan-950/40 dark:text-cyan-300'
                      : 'border-zinc-200 bg-white hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Age (Years)</label>
              <input
                type="number"
                min="0"
                max="25"
                value={dogYears}
                onChange={(e) => setDogYears(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Age (Months)</label>
              <input
                type="number"
                min="0"
                max="11"
                value={dogMonths}
                onChange={(e) => setDogMonths(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setDogYears(3);
              setDogMonths(0);
              setBreedSize('medium');
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-cyan-400"
          >
            <RefreshCw className="h-4 w-4" /> Reset
          </button>
        </div>

        {/* Output */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Equivalent Human Age</span>
              <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                {result.humanAge} <span className="text-xl font-medium text-zinc-500 dark:text-zinc-400">human years</span>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                For a {dogYears}y {dogMonths}m {breedSize} breed dog.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Life Stage</span>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-cyan-500/20 dark:text-cyan-300">
                  {result.lifeStage}
                </span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">{result.advice}</p>
            </div>

            <button
              type="button"
              onClick={() => onCopy(`My dog is ${dogYears} years old (${result.humanAge} in human years) — ${result.lifeStage}`)}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
            >
              Copy Dog Age Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
