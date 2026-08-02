import React, { useState, useMemo } from 'react';
import { Baby, Calendar, Heart, Sparkles, Clock, RefreshCw } from 'lucide-react';

interface PregnancyDueDateCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

type Method = 'lmp' | 'conception' | 'ultrasound';

export default function PregnancyDueDateCalculator({ onCopy }: PregnancyDueDateCalculatorProps) {
  const [method, setMethod] = useState<Method>('lmp');
  const [inputDate, setInputDate] = useState<string>('2026-01-01');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState<number>(10);

  const calc = useMemo(() => {
    const d = new Date(inputDate);
    if (isNaN(d.getTime())) return null;

    let dueDate = new Date(d);

    if (method === 'lmp') {
      // Naegele's Rule adjusted for cycle length: LMP + 280 days + (cycleLength - 28)
      const offsetDays = 280 + (cycleLength - 28);
      dueDate.setDate(dueDate.getDate() + offsetDays);
    } else if (method === 'conception') {
      // Conception + 266 days
      dueDate.setDate(dueDate.getDate() + 266);
    } else if (method === 'ultrasound') {
      // 280 days total minus ultrasound weeks
      const remainingDays = 280 - ultrasoundWeeks * 7;
      dueDate.setDate(dueDate.getDate() + remainingDays);
    }

    const today = new Date();
    const lmpEstimated = new Date(dueDate);
    lmpEstimated.setDate(lmpEstimated.getDate() - 280);

    const diffDays = Math.floor((today.getTime() - lmpEstimated.getTime()) / (1000 * 60 * 60 * 24));
    const currentWeeks = Math.max(0, Math.floor(diffDays / 7));
    const currentDays = Math.max(0, diffDays % 7);

    const totalProgressPercent = Math.min(100, Math.max(0, Math.round((diffDays / 280) * 100)));

    let trimester = 'First Trimester (Weeks 1 - 12)';
    if (currentWeeks >= 13 && currentWeeks <= 26) {
      trimester = 'Second Trimester (Weeks 13 - 26)';
    } else if (currentWeeks >= 27) {
      trimester = 'Third Trimester (Weeks 27 - 40+)';
    }

    // Milestones
    const heartbeatDate = new Date(lmpEstimated);
    heartbeatDate.setDate(heartbeatDate.getDate() + 42); // 6 weeks

    const movementDate = new Date(lmpEstimated);
    movementDate.setDate(movementDate.getDate() + 126); // 18 weeks

    const viabilityDate = new Date(lmpEstimated);
    viabilityDate.setDate(viabilityDate.getDate() + 168); // 24 weeks

    const fullTermDate = new Date(lmpEstimated);
    fullTermDate.setDate(fullTermDate.getDate() + 259); // 37 weeks

    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return {
      dueDateFormatted: formatDate(dueDate),
      currentWeeks,
      currentDays,
      progressPercent: totalProgressPercent,
      trimester,
      milestones: [
        { label: 'First Heartbeat (~6 Wks)', date: formatDate(heartbeatDate) },
        { label: 'First Movement (~18 Wks)', date: formatDate(movementDate) },
        { label: 'Viability Milestone (~24 Wks)', date: formatDate(viabilityDate) },
        { label: 'Full Term (~37 Wks)', date: formatDate(fullTermDate) },
      ],
    };
  }, [inputDate, method, cycleLength, ultrasoundWeeks]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <Baby className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Calculation Inputs
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Calculate Based On</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'lmp', label: 'Last Period' },
                { id: 'conception', label: 'Conception' },
                { id: 'ultrasound', label: 'Ultrasound' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMethod(item.id as Method)}
                  className={`rounded-xl border p-2 text-center text-xs font-semibold transition ${
                    method === item.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-cyan-400 dark:bg-cyan-950/40 dark:text-cyan-300'
                      : 'border-zinc-200 bg-white hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {method === 'lmp' && 'First Day of Last Menstrual Period'}
              {method === 'conception' && 'Date of Conception'}
              {method === 'ultrasound' && 'Date of Ultrasound Scan'}
            </label>
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {method === 'lmp' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Average Cycle Length (Days)</label>
              <input
                type="number"
                min="20"
                max="45"
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          )}

          {method === 'ultrasound' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Gestational Age at Scan (Weeks)</label>
              <input
                type="number"
                min="4"
                max="36"
                value={ultrasoundWeeks}
                onChange={(e) => setUltrasoundWeeks(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {calc ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Estimated Due Date</span>
                <div className="mt-1 font-display text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
                  {calc.dueDateFormatted}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                  <span>Current: {calc.currentWeeks} wks {calc.currentDays} days</span>
                  <span>{calc.trimester}</span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-3.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${calc.progressPercent}%` }}
                  />
                </div>
                <div className="mt-1 text-right text-[11px] text-zinc-500">{calc.progressPercent}% completed</div>
              </div>

              <div className="space-y-2 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                <div className="text-xs font-bold text-zinc-900 dark:text-white">Key Pregnancy Milestones</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {calc.milestones.map((m) => (
                    <div key={m.label} className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-900/60">
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">{m.label}</div>
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200">{m.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`Estimated Due Date: ${calc.dueDateFormatted} (${calc.currentWeeks} weeks pregnant)`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Due Date Details
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
