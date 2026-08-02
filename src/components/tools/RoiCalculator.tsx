"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function RoiCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [initialInvestment, setInitialInvestment] = useState(25000);
  const [finalValue, setFinalValue] = useState(42000);

  const stats = useMemo(() => {
    const inv = Math.max(0, initialInvestment);
    const end = Math.max(0, finalValue);

    const netProfit = end - inv;
    const roiPercent = inv > 0 ? (netProfit / inv) * 100 : 0;

    return {
      netProfit,
      roiPercent: isFinite(roiPercent) ? roiPercent : 0,
    };
  }, [initialInvestment, finalValue]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">ROI Calculator (Return on Investment)</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate net profit percentage and total return on invested capital.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Initial Amount Invested</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(initialInvestment, currency)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="500000"
              step="1000"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Final Returned Value</label>
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
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Return on Investment (ROI)</p>
            <p className={`mt-2 text-4xl font-extrabold ${stats.roiPercent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
              {stats.roiPercent >= 0 ? "+" : ""}{stats.roiPercent.toFixed(2)}%
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Net Profit / Loss</span>
              <span className={`font-bold ${stats.netProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
                {formatCurrency(stats.netProfit, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
