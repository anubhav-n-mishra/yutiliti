import React, { useState, useMemo } from 'react';
import { Star, Moon, Sun, Sparkles, RefreshCw, Compass } from 'lucide-react';

interface ZodiacAgeCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function ZodiacAgeCalculator({ onCopy }: ZodiacAgeCalculatorProps) {
  const [dob, setDob] = useState<string>('1998-07-22');

  const info = useMemo(() => {
    const d = new Date(dob);
    if (isNaN(d.getTime())) return null;

    const day = d.getDate();
    const month = d.getMonth() + 1; // 1-12
    const year = d.getFullYear();

    const today = new Date();
    const diffMs = today.getTime() - d.getTime();
    const earthAgeYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);

    // Western Zodiac
    let westernSign = '';
    let element = '';
    let birthstone = '';

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      westernSign = 'Aries ♈'; element = 'Fire'; birthstone = 'Diamond';
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      westernSign = 'Taurus ♉'; element = 'Earth'; birthstone = 'Emerald';
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
      westernSign = 'Gemini ♊'; element = 'Air'; birthstone = 'Pearl';
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
      westernSign = 'Cancer ♋'; element = 'Water'; birthstone = 'Ruby';
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      westernSign = 'Leo ♌'; element = 'Fire'; birthstone = 'Peridot';
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      westernSign = 'Virgo ♍'; element = 'Earth'; birthstone = 'Sapphire';
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
      westernSign = 'Libra ♎'; element = 'Air'; birthstone = 'Opal';
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
      westernSign = 'Scorpio ♏'; element = 'Water'; birthstone = 'Topaz';
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      westernSign = 'Sagittarius ♐'; element = 'Fire'; birthstone = 'Turquoise';
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      westernSign = 'Capricorn ♑'; element = 'Earth'; birthstone = 'Garnet';
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      westernSign = 'Aquarius ♒'; element = 'Air'; birthstone = 'Amethyst';
    } else {
      westernSign = 'Pisces ♓'; element = 'Water'; birthstone = 'Aquamarine';
    }

    // Chinese Zodiac
    const chineseAnimals = ['Rat 🐀', 'Ox 🐂', 'Tiger 🐅', 'Rabbit 🐇', 'Dragon 🐉', 'Snake 🐍', 'Horse 🐎', 'Goat 🐐', 'Monkey 🐒', 'Rooster 🐓', 'Dog 🐕', 'Pig 🐖'];
    const chineseIndex = (year - 4) % 12;
    const chineseSign = chineseAnimals[chineseIndex < 0 ? chineseIndex + 12 : chineseIndex];

    // Planetary Ages (Orbital period ratios relative to Earth)
    const mercuryAge = (earthAgeYears / 0.2408467).toFixed(1);
    const venusAge = (earthAgeYears / 0.61519726).toFixed(1);
    const marsAge = (earthAgeYears / 1.8808476).toFixed(1);
    const jupiterAge = (earthAgeYears / 11.862615).toFixed(2);

    return {
      earthAgeFormatted: `${Math.floor(earthAgeYears)} years old`,
      westernSign,
      element,
      birthstone,
      chineseSign,
      mercuryAge,
      venusAge,
      marsAge,
      jupiterAge,
    };
  }, [dob]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <Star className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Enter Birth Date
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {info ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Astrological Profile</span>
                <div className="mt-1 font-display text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
                  {info.westernSign}
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {info.element} Element · Birthstone: {info.birthstone}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Chinese Zodiac</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{info.chineseSign}</div>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Age on Mercury</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{info.mercuryAge} yrs</div>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Age on Venus</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{info.venusAge} yrs</div>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Age on Mars</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{info.marsAge} yrs</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`Zodiac Sign: ${info.westernSign} (${info.element}) | Chinese Sign: ${info.chineseSign}`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Astrological Summary
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Please enter a valid date.</div>
          )}
        </div>
      </div>
    </div>
  );
}
