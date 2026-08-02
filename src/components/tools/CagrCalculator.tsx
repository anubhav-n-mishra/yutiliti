"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function CagrCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [initialValue, setInitialValue] = useState(10000);
  const [finalValue, setFinalValue] = useState(25000);
  const [years, setYears] = useState(5);

  const stats = useMemo(() => {
    const start = Math.max(0.01, initialValue);
    const end = Math.max(0, finalValue);
    const y = Math.max(0.1, years);

    // CAGR = (End / Start)^(1/y) - 1
    const cagr = (Math.pow(end / start, 1 / y) - 1) * 100;
    const totalGrowth = end - start;
    const totalGrowthPercent = ((end - start) / start) * 100;

    return {
      cagr: isFinite(cagr) ? cagr : 0,
      totalGrowth,
      totalGrowthPercent: isFinite(totalGrowthPercent) ? totalGrowthPercent : 0,
    };
  }, [initialValue, finalValue, years]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">CAGR Calculator (Compound Annual Growth Rate)</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate smoothed annual return rate for investments over multiple years.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Initial Portfolio Value</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(initialValue, currency)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="500000"
              step="1000"
              value={initialValue}
              onChange={(e) => setInitialValue(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Final Portfolio Value</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(finalValue, currency)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="1000000"
              step="2500"
              value={finalValue}
              onChange={(e) => setFinalValue(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Duration (Years)</label>
              <span className="text-blue-600 dark:text-cyan-300">{years} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Compound Annual Growth Rate (CAGR)</p>
            <p className="mt-2 text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats.cagr >= 0 ? "+" : ""}{stats.cagr.toFixed(2)}%
              <span className="text-sm font-medium text-zinc-500"> / yr</span>
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Absolute Total Gain</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(stats.totalGrowth, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Absolute Growth Rate</span>
              <span className="font-semibold text-blue-600 dark:text-cyan-300">+{stats.totalGrowthPercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
