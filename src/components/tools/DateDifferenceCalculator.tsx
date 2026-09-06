import React, { useState } from 'react';
import { Calendar, Clock, Copy, Check, ArrowRight, Briefcase } from 'lucide-react';

interface DateDifferenceCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

export default function DateDifferenceCalculator({ onCopy }: DateDifferenceCalculatorProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  const nextMonthStr = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  })();

  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(nextMonthStr);
  const [includeEndDay, setIncludeEndDay] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Tab 2: Add/Subtract date
  const [activeTab, setActiveTab] = useState<'diff' | 'add'>('diff');
  const [baseDate, setBaseDate] = useState<string>(todayStr);
  const [addAmount, setAddAmount] = useState<string>('30');
  const [addUnit, setAddUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days');
  const [addOp, setAddOp] = useState<'add' | 'subtract'>('add');

  // Compute Difference
  const diffResult = (() => {
    if (!startDate || !endDate) return null;
    let d1 = new Date(startDate);
    let d2 = new Date(endDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    let isReversed = false;
    if (d1 > d2) {
      const temp = d1;
      d1 = d2;
      d2 = temp;
      isReversed = true;
    }

    // Total milliseconds
    let msDiff = d2.getTime() - d1.getTime();
    let totalDays = Math.round(msDiff / (1000 * 60 * 60 * 24));
    if (includeEndDay) {
      totalDays += 1;
    }

    // Calendar Y, M, D breakdown
    let y1 = d1.getFullYear(), m1 = d1.getMonth(), day1 = d1.getDate();
    let y2 = d2.getFullYear(), m2 = d2.getMonth(), day2 = d2.getDate();

    let years = y2 - y1;
    let months = m2 - m1;
    let days = day2 - day1;

    if (days < 0) {
      months--;
      // Days in previous month
      const prevMonthLastDay = new Date(y2, m2, 0).getDate();
      days += prevMonthLastDay;
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    if (includeEndDay) {
      days += 1;
      const daysInTargetMonth = new Date(y2, m2 + 1, 0).getDate();
      if (days >= daysInTargetMonth) {
        days = 0;
        months++;
        if (months >= 12) {
          months = 0;
          years++;
        }
      }
    }

    // Business days vs Weekends
    let workingDays = 0;
    let weekendDays = 0;
    const cur = new Date(d1);
    const limit = new Date(d2);
    if (includeEndDay) {
      limit.setDate(limit.getDate() + 1);
    }
    while (cur < limit) {
      const dayOfWeek = cur.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDays++;
      } else {
        workingDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;
    const hours = totalDays * 24;
    const minutes = hours * 60;

    return {
      years,
      months,
      days,
      totalDays,
      weeks,
      remDays,
      hours,
      minutes,
      workingDays,
      weekendDays,
      isReversed,
    };
  })();

  // Compute Add/Subtract date
  const addedDateResult = (() => {
    if (!baseDate) return null;
    const d = new Date(baseDate);
    if (isNaN(d.getTime())) return null;

    const val = parseInt(addAmount, 10);
    if (isNaN(val)) return null;

    const factor = addOp === 'add' ? 1 : -1;
    const target = new Date(d);

    if (addUnit === 'days') {
      target.setDate(target.getDate() + val * factor);
    } else if (addUnit === 'weeks') {
      target.setDate(target.getDate() + val * 7 * factor);
    } else if (addUnit === 'months') {
      target.setMonth(target.getMonth() + val * factor);
    } else if (addUnit === 'years') {
      target.setFullYear(target.getFullYear() + val * factor);
    }

    return {
      formatted: target.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      iso: target.toISOString().split('T')[0],
    };
  })();

  const handleCopy = () => {
    if (!diffResult) return;
    const text = `${diffResult.years} years, ${diffResult.months} months, ${diffResult.days} days (${diffResult.totalDays.toLocaleString()} total days)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onCopy) onCopy(text);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('diff')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'diff' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Date Difference
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('add')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'add' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Add / Subtract Days
        </button>
      </div>

      {activeTab === 'diff' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-1 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeEndDay}
                  onChange={(e) => setIncludeEndDay(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-500 bg-slate-950"
                />
                Include end day (+1 day)
              </label>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 block mb-2">Quick Presets</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStartDate(todayStr);
                    const d = new Date();
                    d.setDate(d.getDate() + 30);
                    setEndDate(d.toISOString().split('T')[0]);
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  +30 Days
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStartDate(todayStr);
                    const d = new Date();
                    d.setDate(d.getDate() + 90);
                    setEndDate(d.toISOString().split('T')[0]);
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  +90 Days
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStartDate(todayStr);
                    const y = new Date().getFullYear();
                    setEndDate(`${y}-12-31`);
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  End of Year
                </button>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2 space-y-4">
            {/* Primary Banner */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Exact Calendar Duration</span>
                {diffResult && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>

              {diffResult ? (
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white flex flex-wrap items-baseline gap-2">
                    {diffResult.years > 0 && (
                      <span>
                        <strong className="text-indigo-400 font-mono">{diffResult.years}</strong> year{diffResult.years > 1 ? 's' : ''},
                      </span>
                    )}
                    {diffResult.months > 0 && (
                      <span>
                        <strong className="text-cyan-400 font-mono">{diffResult.months}</strong> month{diffResult.months > 1 ? 's' : ''},
                      </span>
                    )}
                    <span>
                      <strong className="text-emerald-400 font-mono">{diffResult.days}</strong> day{diffResult.days > 1 ? 's' : ''}
                    </span>
                  </div>

                  {diffResult.isReversed && (
                    <span className="text-xs text-amber-400 block mt-2">
                      (Start date was after end date; inverted chronologically)
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-slate-500 text-sm">Select two valid dates above.</div>
              )}
            </div>

            {/* Equivalent Units Grid */}
            {diffResult && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Total Days</span>
                  <span className="text-lg font-bold text-white">{diffResult.totalDays.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Weeks & Days</span>
                  <span className="text-lg font-bold text-white">{diffResult.weeks}w {diffResult.remDays}d</span>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-1 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-emerald-400" /> Work Days
                  </span>
                  <span className="text-lg font-bold text-emerald-400">{diffResult.workingDays.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block mb-1">Weekend Days</span>
                  <span className="text-lg font-bold text-amber-400">{diffResult.weekendDays.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 col-span-2">
                  <span className="text-slate-500 block mb-1">Total Hours</span>
                  <span className="text-base font-bold text-slate-200">{diffResult.hours.toLocaleString()} hrs</span>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 col-span-2">
                  <span className="text-slate-500 block mb-1">Total Minutes</span>
                  <span className="text-base font-bold text-slate-200">{diffResult.minutes.toLocaleString()} mins</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tab 2: Add or Subtract Days */
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 max-w-xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Starting Date</label>
            <input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Action</label>
              <select
                value={addOp}
                onChange={(e) => setAddOp(e.target.value as 'add' | 'subtract')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
              >
                <option value="add">+ Add</option>
                <option value="subtract">- Subtract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Quantity</label>
              <input
                type="number"
                min="1"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Unit</label>
              <select
                value={addUnit}
                onChange={(e) => setAddUnit(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>

          {addedDateResult && (
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 mt-4">
              <span className="text-xs text-slate-500 block">Calculated Result Date</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">{addedDateResult.formatted}</div>
              <div className="text-xs font-mono text-slate-400 mt-0.5">{addedDateResult.iso}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
