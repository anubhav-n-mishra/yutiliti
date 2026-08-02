"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function EmergencyFundCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [monthlyExpenses, setMonthlyExpenses] = useState(4000);
  const [targetMonths, setTargetMonths] = useState(6);
  const [currentSavings, setCurrentSavings] = useState(8000);

  const stats = useMemo(() => {
    const exp = Math.max(0, monthlyExpenses);
    const m = Math.max(1, targetMonths);
    const saved = Math.max(0, currentSavings);

    const requiredFund = exp * m;
    const remainingToSave = Math.max(0, requiredFund - saved);
    const progressPercent = requiredFund > 0 ? Math.min(100, (saved / requiredFund) * 100) : 0;

    return {
      requiredFund,
      remainingToSave,
      progressPercent,
    };
  }, [monthlyExpenses, targetMonths, currentSavings]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Emergency Fund Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate 3 to 12 months of essential living expenses safety net needed for financial security.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Monthly Essential Expenses</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(monthlyExpenses, currency)}</span>
            </div>
            <input
              type="range"
              min="500"
              max="30000"
              step="250"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Safety Buffer (Months)</label>
              <span className="text-blue-600 dark:text-cyan-300">{targetMonths} Months</span>
            </div>
            <input
              type="range"
              min="3"
              max="12"
              step="1"
              value={targetMonths}
              onChange={(e) => setTargetMonths(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Current Liquid Savings</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(currentSavings, currency)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="1000"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Required Emergency Fund ({targetMonths} Mo)</p>
            <p className="mt-2 text-4xl font-extrabold text-zinc-950 dark:text-white">
              {formatCurrency(stats.requiredFund, currency)}
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-zinc-600 dark:text-zinc-400">
                <span>Savings Progress</span>
                <span>{stats.progressPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${stats.progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Gap Still Needed</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{formatCurrency(stats.remainingToSave, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
