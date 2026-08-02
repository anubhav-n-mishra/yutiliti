import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, RefreshCw, Sparkles, Star } from 'lucide-react';

interface AgeCalculatorInMonthsProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function AgeCalculatorInMonths({ onCopy }: AgeCalculatorInMonthsProps) {
  const [dob, setDob] = useState<string>('2000-01-15');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    const start = new Date(dob);
    const end = targetDate ? new Date(targetDate) : currentTime;

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      return null;
    }

    const diffMs = end.getTime() - start.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);

    // Exact Year and Month calculation
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMonths = years * 12 + months + (days / 30.4375);
    const exactTotalMonthsInt = years * 12 + months;

    return {
      years,
      months,
      days,
      exactTotalMonthsInt,
      exactTotalMonthsDecimal: totalMonths.toFixed(1),
      totalWeeks: totalWeeks.toLocaleString(),
      totalDays: totalDays.toLocaleString(),
      totalHours: totalHours.toLocaleString(),
      totalMinutes: totalMinutes.toLocaleString(),
      totalSeconds: totalSeconds.toLocaleString(),
    };
  }, [dob, targetDate, currentTime]);

  const handleReset = () => {
    setDob('2000-01-15');
    setTargetDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Date Details
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Target / As of Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-cyan-400"
          >
            <RefreshCw className="h-4 w-4" /> Reset Dates
          </button>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {stats ? (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Total Age in Months</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {stats.exactTotalMonthsInt} <span className="text-xl font-medium text-zinc-500 dark:text-zinc-400">months</span>
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Approx. {stats.exactTotalMonthsDecimal} months ({stats.years} years, {stats.months} months, {stats.days} days)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Total Weeks</div>
                  <div className="font-display text-lg font-bold text-zinc-900 dark:text-white">{stats.totalWeeks}</div>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Total Days</div>
                  <div className="font-display text-lg font-bold text-zinc-900 dark:text-white">{stats.totalDays}</div>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Total Hours</div>
                  <div className="font-display text-lg font-bold text-zinc-900 dark:text-white">{stats.totalHours}</div>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Total Minutes</div>
                  <div className="font-display text-lg font-bold text-zinc-900 dark:text-white">{stats.totalMinutes}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`${stats.exactTotalMonthsInt} months (${stats.years} years and ${stats.months} months)`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Age Summary
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Please select a valid birth date.</div>
          )}
        </div>
      </div>
    </div>
  );
}
