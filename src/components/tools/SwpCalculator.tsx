"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency, getCurrency } from "@/src/lib/currency";

export default function SwpCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(800);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [tenureYears, setTenureYears] = useState(10);

  const stats = useMemo(() => {
    let balance = Math.max(0, initialInvestment);
    const r = Math.max(0, expectedReturn) / 12 / 100;
    const months = Math.max(1, tenureYears * 12);
    const w = Math.max(0, monthlyWithdrawal);

    let totalWithdrawn = 0;
    for (let i = 0; i < months; i++) {
      balance = balance * (1 + r) - w;
      totalWithdrawn += w;
      if (balance <= 0) {
        balance = 0;
        break;
      }
    }

    return {
      totalWithdrawn,
      finalBalance: Math.max(0, balance),
      depleted: balance <= 0,
    };
  }, [initialInvestment, monthlyWithdrawal, expectedReturn, tenureYears]);

  const symbol = getCurrency(currency).symbol;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">SWP Calculator (Systematic Withdrawal Plan)</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate regular monthly income payouts and remaining corpus value.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Initial Corpus ({symbol})</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(initialInvestment, currency)}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="2000000"
              step="10000"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Monthly Withdrawal ({symbol})</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(monthlyWithdrawal, currency)}</span>
            </div>
            <input
              type="range"
              min="100"
              max="20000"
              step="100"
              value={monthlyWithdrawal}
              onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
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
              min="1"
              max="20"
              step="0.5"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Withdrawal Period (Years)</label>
              <span className="text-blue-600 dark:text-cyan-300">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Total Payout Received</p>
            <p className="mt-2 text-4xl font-extrabold text-zinc-950 dark:text-white">
              {formatCurrency(stats.totalWithdrawn, currency)}
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Initial Corpus Invested</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(initialInvestment, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Remaining Balance at End</span>
              <span className={`font-bold ${stats.depleted ? "text-rose-600" : "text-emerald-600 dark:text-emerald-400"}`}>
                {stats.depleted ? "Corpus Depleted" : formatCurrency(stats.finalBalance, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
