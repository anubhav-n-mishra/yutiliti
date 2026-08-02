"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function StockAverageCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [firstShares, setFirstShares] = useState(50);
  const [firstPrice, setFirstPrice] = useState(120);

  const [secondShares, setSecondShares] = useState(50);
  const [secondPrice, setSecondPrice] = useState(80);

  const stats = useMemo(() => {
    const q1 = Math.max(0, firstShares);
    const p1 = Math.max(0, firstPrice);
    const q2 = Math.max(0, secondShares);
    const p2 = Math.max(0, secondPrice);

    const totalCost1 = q1 * p1;
    const totalCost2 = q2 * p2;

    const totalShares = q1 + q2;
    const totalCapital = totalCost1 + totalCost2;
    const averagePrice = totalShares > 0 ? totalCapital / totalShares : 0;

    return {
      totalShares,
      totalCapital,
      averagePrice: isFinite(averagePrice) ? averagePrice : 0,
      totalCost1,
      totalCost2,
    };
  }, [firstShares, firstPrice, secondShares, secondPrice]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Stock Average Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate average buy price when buying additional stock shares (dollar-cost averaging).</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">1st Purchase Trade</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Shares Count</label>
                <input
                  type="number"
                  value={firstShares}
                  onChange={(e) => setFirstShares(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Buy Price</label>
                <input
                  type="number"
                  value={firstPrice}
                  onChange={(e) => setFirstPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">2nd Purchase Trade</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Shares Count</label>
                <input
                  type="number"
                  value={secondShares}
                  onChange={(e) => setSecondShares(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Buy Price</label>
                <input
                  type="number"
                  value={secondPrice}
                  onChange={(e) => setSecondPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Average Price Per Share</p>
            <p className="mt-2 text-4xl font-extrabold text-zinc-950 dark:text-white">
              {formatCurrency(stats.averagePrice, currency)}
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Total Shares Combined</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{stats.totalShares} Shares</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Total Capital Invested</span>
              <span className="font-bold text-zinc-950 dark:text-white">{formatCurrency(stats.totalCapital, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
