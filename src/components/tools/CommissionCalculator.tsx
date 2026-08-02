"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function CommissionCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [salesAmount, setSalesAmount] = useState(15000);
  const [commissionRate, setCommissionRate] = useState(7.5);

  const stats = useMemo(() => {
    const sale = Math.max(0, salesAmount);
    const rate = Math.max(0, commissionRate) / 100;

    const commissionEarnings = sale * rate;
    const netSellerProceeds = Math.max(0, sale - commissionEarnings);

    return {
      commissionEarnings,
      netSellerProceeds,
    };
  }, [salesAmount, commissionRate]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Sales Commission Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate total commission payout earnings and net seller proceeds on sales revenue.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Total Sales Revenue</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(salesAmount, currency)}</span>
            </div>
            <input
              type="range"
              min="500"
              max="500000"
              step="1000"
              value={salesAmount}
              onChange={(e) => setSalesAmount(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Commission Rate (%)</label>
              <span className="text-blue-600 dark:text-cyan-300">{commissionRate}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="30"
              step="0.5"
              value={commissionRate}
              onChange={(e) => setCommissionRate(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Commission Earned</p>
            <p className="mt-2 text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(stats.commissionEarnings, currency)}
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Net Seller Proceeds</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(stats.netSellerProceeds, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
