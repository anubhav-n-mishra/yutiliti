import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Share2, Calendar, Star, Clock, Heart } from 'lucide-react';

interface AgeCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

interface ZodiacInfo {
  name: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  traits: string;
  compatibility: string;
}

export default function AgeCalculator({ onCopy, onShare }: AgeCalculatorProps) {
  const [dobString, setDobString] = useState<string>('1998-05-15');
  const [dobTime, setDobTime] = useState<string>('08:30');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Ticker for real-time seconds ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dobDate = useMemo(() => {
    const dateStr = `${dobString}T${dobTime || '00:00'}`;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date('1998-05-15T08:30:00') : d;
  }, [dobString, dobTime]);

  // Exact calculations
  const ageCalculations = useMemo(() => {
    const diffMs = currentTime.getTime() - dobDate.getTime();
    if (diffMs < 0) {
      return {
        years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0,
        totalDays: 0, totalHours: 0, totalMinutes: 0, totalSeconds: 0,
        nextBirthday: { days: 0, hours: 0, minutes: 0, seconds: 0 },
        weekday: ''
      };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // Calculate years, months, days accurately
    const birthYear = dobDate.getFullYear();
    const birthMonth = dobDate.getMonth();
    const birthDay = dobDate.getDate();

    const currYear = currentTime.getFullYear();
    const currMonth = currentTime.getMonth();
    const currDay = currentTime.getDate();

    let years = currYear - birthYear;
    let months = currMonth - birthMonth;
    let days = currDay - birthDay;

    if (days < 0) {
      months--;
      // Get days in previous month
      const prevMonth = new Date(currYear, currMonth, 0).getDate();
      days += prevMonth;
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const hours = currentTime.getHours() - dobDate.getHours();
    const minutes = currentTime.getMinutes() - dobDate.getMinutes();
    const seconds = currentTime.getSeconds() - dobDate.getSeconds();

    // Adjust hours/mins/secs
    let adjustedHours = hours;
    let adjustedMinutes = minutes;
    let adjustedSeconds = seconds;

    if (adjustedSeconds < 0) {
      adjustedSeconds += 60;
      adjustedMinutes--;
    }
    if (adjustedMinutes < 0) {
      adjustedMinutes += 60;
      adjustedHours--;
    }
    if (adjustedHours < 0) {
      adjustedHours += 24;
      // Days are already accurately derived above
    }

    // Next Birthday Countdown
    const nextBday = new Date(currYear, birthMonth, birthDay, dobDate.getHours(), dobDate.getMinutes(), dobDate.getSeconds());
    if (nextBday.getTime() < currentTime.getTime()) {
      nextBday.setFullYear(currYear + 1);
    }
    const bdayDiffMs = nextBday.getTime() - currentTime.getTime();
    
    const bdaySecs = Math.floor(bdayDiffMs / 1000);
    const bdayMins = Math.floor(bdaySecs / 60);
    const bdayHours = Math.floor(bdayMins / 60);
    const bdayDays = Math.floor(bdayHours / 24);

    const bdayCountdown = {
      days: bdayDays,
      hours: bdayHours % 24,
      minutes: bdayMins % 60,
      seconds: bdaySecs % 60
    };

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = weekdays[dobDate.getDay()];

    return {
      years,
      months,
      days,
      hours: Math.abs(adjustedHours % 24),
      minutes: Math.abs(adjustedMinutes % 60),
      seconds: Math.abs(adjustedSeconds % 60),
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      nextBirthday: bdayCountdown,
      weekday
    };
  }, [dobDate, currentTime]);

  // Determine Zodiac details
  const zodiac = useMemo<ZodiacInfo>(() => {
    const month = dobDate.getMonth() + 1; // 1-12
    const day = dobDate.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      return { name: 'Aries', element: 'Fire', traits: 'Bold, ambitious, passionate, and pioneering.', compatibility: 'Leo, Sagittarius' };
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      return { name: 'Taurus', element: 'Earth', traits: 'Reliable, patient, practical, and devoted.', compatibility: 'Virgo, Capricorn' };
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
      return { name: 'Gemini', element: 'Air', traits: 'Expressive, quick-witted, curious, and adaptable.', compatibility: 'Libra, Aquarius' };
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
      return { name: 'Cancer', element: 'Water', traits: 'Intuitive, sentimental, compassionate, and protective.', compatibility: 'Scorpio, Pisces' };
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      return { name: 'Leo', element: 'Fire', traits: 'Generous, warm-hearted, creative, and enthusiastic.', compatibility: 'Aries, Sagittarius' };
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      return { name: 'Virgo', element: 'Earth', traits: 'Loyal, analytical, kind, and hardworking.', compatibility: 'Taurus, Capricorn' };
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
      return { name: 'Libra', element: 'Air', traits: 'Social, fair-minded, diplomatic, and gracious.', compatibility: 'Gemini, Aquarius' };
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
      return { name: 'Scorpio', element: 'Water', traits: 'Resourceful, brave, passionate, and a true friend.', compatibility: 'Cancer, Pisces' };
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      return { name: 'Sagittarius', element: 'Fire', traits: 'Generous, idealistic, humorous, and loves travel.', compatibility: 'Aries, Leo' };
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      return { name: 'Capricorn', element: 'Earth', traits: 'Responsible, disciplined, self-control, and good managers.', compatibility: 'Taurus, Virgo' };
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      return { name: 'Aquarius', element: 'Air', traits: 'Progressive, original, independent, and humanitarian.', compatibility: 'Gemini, Libra' };
    } else {
      return { name: 'Pisces', element: 'Water', traits: 'Compassionate, artistic, intuitive, gentle, and wise.', compatibility: 'Cancer, Scorpio' };
    }
  }, [dobDate]);

  const handleReset = () => {
    setDobString('1998-05-15');
    setDobTime('08:30');
  };

  const handleCopyResults = () => {
    const text = `Age Metrics:\nExact Age: ${ageCalculations.years} Years, ${ageCalculations.months} Months, ${ageCalculations.days} Days\nBorn on: ${ageCalculations.weekday}\nZodiac: ${zodiac.name} (${zodiac.element} element)\nTotal Days Lived: ${ageCalculations.totalDays.toLocaleString()} days\nNext Birthday in: ${ageCalculations.nextBirthday.days} Days, ${ageCalculations.nextBirthday.hours} Hours`;
    onCopy(text);
  };

  const zodiacColors = {
    Fire: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900',
    Earth: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900',
    Air: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900',
    Water: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900'
  };

  return (
    <div className="space-y-8">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Age & Time Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Get precise details of your elapsed time on Earth and zodiac profiles.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleCopyResults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Copy
          </button>
          <button
            onClick={() => onShare("Age Calculator", "age-calculator")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Pane */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl p-5 space-y-5">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-400" />
              Birth Specifications
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Date of Birth</label>
                <input
                  type="date"
                  value={dobString}
                  onChange={(e) => setDobString(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950 dark:text-zinc-50 focus:border-zinc-400 dark:focus:border-zinc-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Time of Birth (Optional)</label>
                <input
                  type="time"
                  value={dobTime}
                  onChange={(e) => setDobTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950 dark:text-zinc-50 focus:border-zinc-400 dark:focus:border-zinc-700"
                />
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded p-3 font-medium">
              You were born on a <strong className="text-zinc-800 dark:text-zinc-200">{ageCalculations.weekday || '...'}</strong>.
            </div>
          </div>

          {/* Zodiac Details Panel */}
          <div className={`border rounded-xl p-5 space-y-3 ${zodiacColors[zodiac.element] || ''}`}>
            <h3 className="text-sm font-semibold flex items-center gap-1.5">
              <Star className="w-4 h-4" />
              Zodiac Sign: {zodiac.name}
            </h3>
            <p className="text-xs leading-relaxed opacity-90">
              <strong className="opacity-80">Element:</strong> {zodiac.element}
              <br />
              <strong className="opacity-80">Personality:</strong> {zodiac.traits}
            </p>
            <div className="h-[1px] bg-current opacity-20" />
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>Greatest Compatibility: {zodiac.compatibility}</span>
            </div>
          </div>
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Age breakdown */}
          <div className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
            <h2 className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider mb-4">Chronological Age</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-4 rounded-xl text-center">
                <p className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50">{ageCalculations.years}</p>
                <p className="text-xs font-medium text-zinc-400 mt-1">Years</p>
              </div>
              <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-4 rounded-xl text-center">
                <p className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50">{ageCalculations.months}</p>
                <p className="text-xs font-medium text-zinc-400 mt-1">Months</p>
              </div>
              <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-4 rounded-xl text-center">
                <p className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50">{ageCalculations.days}</p>
                <p className="text-xs font-medium text-zinc-400 mt-1">Days</p>
              </div>
            </div>

            {/* Live Ticker Clock for precision */}
            <div className="mt-5 flex items-center justify-center gap-2 bg-zinc-900 text-zinc-50 dark:bg-zinc-950 dark:border dark:border-zinc-900 py-3 rounded-lg font-mono text-xs shadow-inner">
              <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>
                + {ageCalculations.hours.toString().padStart(2, '0')}h :{' '}
                {ageCalculations.minutes.toString().padStart(2, '0')}m :{' '}
                {ageCalculations.seconds.toString().padStart(2, '0')}s
              </span>
              <span className="text-[10px] text-emerald-400 font-sans font-medium">(Ticking Live)</span>
            </div>
          </div>

          {/* Birthday Countdown */}
          <div className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
            <h2 className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider mb-4">Next Birthday Countdown</h2>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 py-3 rounded-lg">
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{ageCalculations.nextBirthday.days}</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-tight">Days</p>
              </div>
              <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 py-3 rounded-lg">
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{ageCalculations.nextBirthday.hours}</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-tight">Hours</p>
              </div>
              <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 py-3 rounded-lg">
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{ageCalculations.nextBirthday.minutes}</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-tight">Mins</p>
              </div>
              <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 py-3 rounded-lg">
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{ageCalculations.nextBirthday.seconds}</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-tight">Secs</p>
              </div>
            </div>
          </div>

          {/* Life Stats Accumulated */}
          <div className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
            <h2 className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider mb-4">Lifetime Accruals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-100 dark:border-zinc-900">
                <p className="text-xs text-zinc-400">Total Days</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 mt-1">{ageCalculations.totalDays.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-100 dark:border-zinc-900">
                <p className="text-xs text-zinc-400">Total Hours</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 mt-1">{ageCalculations.totalHours.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-100 dark:border-zinc-900">
                <p className="text-xs text-zinc-400">Total Mins</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 mt-1">{ageCalculations.totalMinutes.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-100 dark:border-zinc-900">
                <p className="text-xs text-zinc-400">Total Secs</p>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{ageCalculations.totalSeconds.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
