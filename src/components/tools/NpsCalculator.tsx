"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function NpsCalculator() {
  const [currency, setCurrency] = useState("INR");
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [currentAge, setCurrentAge] = useState(30);
  const [expectedReturn, setExpectedReturn] = useState(10);

  const stats = useMemo(() => {
    const years = Math.max(1, 60 - currentAge);
    const months = years * 12;
    const r = Math.max(0, expectedReturn) / 12 / 100;
    const p = Math.max(0, monthlyInvestment);

    let corpus = 0;
    if (r > 0) {
      corpus = p * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    } else {
      corpus = p * months;
    }

    const totalInvested = p * months;
    const totalReturns = Math.max(0, corpus - totalInvested);
    const lumpSum60Pct = corpus * 0.6;
    const annuity40Pct = corpus * 0.4;

    return {
      totalCorpus: isFinite(corpus) ? corpus : 0,
      totalInvested,
      totalReturns,
      lumpSum60Pct,
      annuity40Pct,
    };
  }, [monthlyInvestment, currentAge, expectedReturn]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">NPS Calculator (National Pension System)</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate retirement pension wealth, tax-free lump sum, and annuity balance.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Monthly Contribution</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(monthlyInvestment, currency)}</span>
            </div>
            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Current Age (Retires at 60)</label>
              <span className="text-blue-600 dark:text-cyan-300">{currentAge} Years</span>
            </div>
            <input
              type="range"
              min="18"
              max="55"
              step="1"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Expected Annual Return (%)</label>
              <span className="text-blue-600 dark:text-cyan-300">{expectedReturn}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="15"
              step="0.5"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Total NPS Retirement Wealth</p>
            <p className="mt-2 text-4xl font-extrabold text-zinc-950 dark:text-white">
              {formatCurrency(stats.totalCorpus, currency)}
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Total Invested Capital</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(stats.totalInvested, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Tax-Free Lump Sum (60%)</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.lumpSum60Pct, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Annuity Reinvestment (40%)</span>
              <span className="font-semibold text-blue-600 dark:text-cyan-300">{formatCurrency(stats.annuity40Pct, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
