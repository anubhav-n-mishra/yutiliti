import React, { useState } from 'react';
import { Globe, Copy, Check, Clock, Sun, Moon, Sparkles } from 'lucide-react';

interface TimeZoneConverterProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

interface CityTz {
  city: string;
  tz: string;
  country: string;
}

const DEFAULT_CITIES: CityTz[] = [
  { city: 'London', tz: 'Europe/London', country: 'United Kingdom' },
  { city: 'New York', tz: 'America/New_York', country: 'United States' },
  { city: 'San Francisco', tz: 'America/Los_Angeles', country: 'United States' },
  { city: 'New Delhi', tz: 'Asia/Kolkata', country: 'India' },
  { city: 'Dubai', tz: 'Asia/Dubai', country: 'United Arab Emirates' },
  { city: 'Singapore', tz: 'Asia/Singapore', country: 'Singapore' },
  { city: 'Tokyo', tz: 'Asia/Tokyo', country: 'Japan' },
  { city: 'Sydney', tz: 'Australia/Sydney', country: 'Australia' },
  { city: 'UTC / GMT', tz: 'UTC', country: 'Universal' },
];

export default function TimeZoneConverter({ onCopy }: TimeZoneConverterProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>('14:00');
  const [baseTz, setBaseTz] = useState<string>('UTC');
  const [copied, setCopied] = useState<boolean>(false);

  // Construct target ISO timestamp from selected date and time in baseTz
  const baseDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

  const setNow = () => {
    const now = new Date();
    setSelectedDate(now.toISOString().split('T')[0]);
    setSelectedTime(
      `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    );
  };

  const getCityTime = (tz: string) => {
    try {
      const formatterTime = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const formatterDate = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      const formatterHour24 = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        hour12: false,
      });

      const timeStr = formatterTime.format(baseDateTime);
      const dateStr = formatterDate.format(baseDateTime);
      const hour24 = parseInt(formatterHour24.format(baseDateTime), 10);

      // Business hours flag (9am to 6pm)
      const isBusiness = hour24 >= 9 && hour24 < 18;
      const isNight = hour24 >= 22 || hour24 < 6;

      return { timeStr, dateStr, hour24, isBusiness, isNight };
    } catch {
      return { timeStr: '—', dateStr: '—', hour24: 12, isBusiness: false, isNight: false };
    }
  };

  const handleCopy = () => {
    const summary = DEFAULT_CITIES.map((c) => {
      const info = getCityTime(c.tz);
      return `${c.city} (${c.tz}): ${info.timeStr}, ${info.dateStr}`;
    }).join('\n');

    navigator.clipboard.writeText(summary);
    setCopied(true);
    if (onCopy) onCopy(summary);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Controller */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" /> World Time Zone & Meeting Planner
          </h3>
          <button
            type="button"
            onClick={setNow}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Set to Current Time
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Origin Reference Time Zone</label>
            <select
              value={baseTz}
              onChange={(e) => setBaseTz(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
            >
              {DEFAULT_CITIES.map((c) => (
                <option key={c.tz} value={c.tz}>
                  {c.city} ({c.tz})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Multi-City Comparison Grid */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Business Hours (9am–6pm)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Night / Sleeping
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Meeting Schedule'}
          </button>
        </div>

        <div className="divide-y divide-slate-800/60 font-mono text-xs">
          {DEFAULT_CITIES.map((c) => {
            const info = getCityTime(c.tz);
            let badgeBg = 'bg-slate-950/80 border-slate-800 text-slate-300';
            if (info.isBusiness) {
              badgeBg = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300';
            } else if (info.isNight) {
              badgeBg = 'bg-rose-950/30 border-rose-800/40 text-rose-300';
            }

            return (
              <div
                key={c.tz}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/40 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-white font-sans">{c.city}</span>
                  <span className="text-slate-500 text-xs">{c.country}</span>
                  <span className="text-[10px] text-slate-600 px-1.5 py-0.5 rounded bg-slate-950">
                    {c.tz}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-slate-400 text-xs">{info.dateStr}</span>
                  <div className={`px-3 py-1.5 rounded-xl border text-sm font-bold flex items-center gap-2 ${badgeBg}`}>
                    {info.isNight ? (
                      <Moon className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>{info.timeStr}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
