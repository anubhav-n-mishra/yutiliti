import React, { useState, useMemo } from 'react';
import { Sun, Moon, Sparkles, Compass, Star } from 'lucide-react';

interface ZodiacSunMoonCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function ZodiacSunMoonCalculator({ onCopy }: ZodiacSunMoonCalculatorProps) {
  const [dobDate, setDobDate] = useState<string>('1999-10-15');
  const [dobTime, setDobTime] = useState<string>('14:30');

  const astrol = useMemo(() => {
    const d = new Date(`${dobDate}T${dobTime || '12:00'}`);
    if (isNaN(d.getTime())) return null;

    const day = d.getDate();
    const month = d.getMonth() + 1;
    const hour = d.getHours();

    // 1. Sun Sign Determination
    let sunSign = '';
    let sunElement = '';

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) { sunSign = 'Aries ♈'; sunElement = 'Fire'; }
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) { sunSign = 'Taurus ♉'; sunElement = 'Earth'; }
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) { sunSign = 'Gemini ♊'; sunElement = 'Air'; }
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) { sunSign = 'Cancer ♋'; sunElement = 'Water'; }
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) { sunSign = 'Leo ♌'; sunElement = 'Fire'; }
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) { sunSign = 'Virgo ♍'; sunElement = 'Earth'; }
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) { sunSign = 'Libra ♎'; sunElement = 'Air'; }
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) { sunSign = 'Scorpio ♏'; sunElement = 'Water'; }
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) { sunSign = 'Sagittarius ♐'; sunElement = 'Fire'; }
    else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) { sunSign = 'Capricorn ♑'; sunElement = 'Earth'; }
    else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) { sunSign = 'Aquarius ♒'; sunElement = 'Air'; }
    else { sunSign = 'Pisces ♓'; sunElement = 'Water'; }

    // 2. Moon Sign Estimation (Moon takes ~2.5 days per sign = 27.3 day cycle)
    const signs = [
      'Aries ♈', 'Taurus ♉', 'Gemini ♊', 'Cancer ♋', 'Leo ♌', 'Virgo ♍',
      'Libra ♎', 'Scorpio ♏', 'Sagittarius ♐', 'Capricorn ♑', 'Aquarius ♒', 'Pisces ♓'
    ];

    // Reference moon position (e.g. New Moon Jan 1 2000 was in Capricorn idx 9)
    const refDate = new Date('2000-01-01T00:00:00');
    const daysDiff = (d.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
    const moonProgressDays = ((daysDiff % 27.32166) + 27.32166) % 27.32166;
    const moonSignIdx = Math.floor((moonProgressDays / 27.32166) * 12);
    const moonSign = signs[(moonSignIdx + 9) % 12];

    // 3. Ascendant / Rising Sign Estimation (Based on birth hour relative to Sunrise ~6am)
    const sunSignIdx = signs.findIndex((s) => s.startsWith(sunSign.split(' ')[0]));
    const hoursFromSunrise = (hour - 6 + 24) % 24;
    const risingSignOffset = Math.floor(hoursFromSunrise / 2);
    const risingSign = signs[(sunSignIdx + risingSignOffset) % 12];

    return {
      sunSign,
      sunElement,
      moonSign,
      risingSign,
    };
  }, [dobDate, dobTime]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <Compass className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Birth Time Details
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Date of Birth</label>
            <input
              type="date"
              value={dobDate}
              onChange={(e) => setDobDate(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Exact Time of Birth (Local Time)</label>
            <input
              type="time"
              value={dobTime}
              onChange={(e) => setDobTime(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {astrol ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">The Big Three</span>
                <div className="mt-1 font-display text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
                  {astrol.sunSign}
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Sun Sign ({astrol.sunElement} Element)</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Moon className="h-3.5 w-3.5 text-indigo-500" /> Moon Sign
                  </div>
                  <div className="mt-1 font-bold text-zinc-900 dark:text-white">{astrol.moonSign}</div>
                  <div className="mt-0.5 text-[10px] text-zinc-400">Emotions & Inner Self</div>
                </div>

                <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Sun className="h-3.5 w-3.5 text-amber-500" /> Rising / Ascendant
                  </div>
                  <div className="mt-1 font-bold text-zinc-900 dark:text-white">{astrol.risingSign}</div>
                  <div className="mt-0.5 text-[10px] text-zinc-400">Outer Mask & Persona</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`Big Three: Sun in ${astrol.sunSign}, Moon in ${astrol.moonSign}, Rising in ${astrol.risingSign}`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Big Three Summary
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Please enter a birth date and time.</div>
          )}
        </div>
      </div>
    </div>
  );
}
