"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function DividendCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [sharePrice, setSharePrice] = useState(150);
  const [numberOfShares, setNumberOfShares] = useState(100);
  const [annualDividendPerShare, setAnnualDividendPerShare] = useState(4.5);

  const stats = useMemo(() => {
    const price = Math.max(0.01, sharePrice);
    const shares = Math.max(0, numberOfShares);
    const divPerShare = Math.max(0, annualDividendPerShare);

    const totalInvestment = price * shares;
    const annualDividendPayout = divPerShare * shares;
    const monthlyDividendPayout = annualDividendPayout / 12;
    const dividendYieldPercent = price > 0 ? (divPerShare / price) * 100 : 0;

    return {
      totalInvestment,
      annualDividendPayout,
      monthlyDividendPayout,
      dividendYieldPercent: isFinite(dividendYieldPercent) ? dividendYieldPercent : 0,
    };
  }, [sharePrice, numberOfShares, annualDividendPerShare]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Dividend Yield & Payout Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate annual passive dividend income and dividend yield percentage.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Stock Share Price</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(sharePrice, currency)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="2000"
              step="5"
              value={sharePrice}
              onChange={(e) => setSharePrice(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Number of Shares Owned</label>
              <span className="text-blue-600 dark:text-cyan-300">{numberOfShares} Shares</span>
            </div>
            <input
              type="range"
              min="1"
              max="10000"
              step="10"
              value={numberOfShares}
              onChange={(e) => setNumberOfShares(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Annual Dividend Per Share</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(annualDividendPerShare, currency)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="100"
              step="0.5"
              value={annualDividendPerShare}
              onChange={(e) => setAnnualDividendPerShare(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Annual Dividend Income</p>
            <p className="mt-2 text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(stats.annualDividendPayout, currency)}
              <span className="text-sm font-medium text-zinc-500"> / yr</span>
            </p>
            <p className="mt-1 text-xs text-zinc-500 font-medium">Dividend Yield: {stats.dividendYieldPercent.toFixed(2)}%</p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Monthly Average Dividend</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(stats.monthlyDividendPayout, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Total Portfolio Position Value</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(stats.totalInvestment, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
