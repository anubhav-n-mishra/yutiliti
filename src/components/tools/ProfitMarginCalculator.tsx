"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function ProfitMarginCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [costPrice, setCostPrice] = useState(60);
  const [sellingPrice, setSellingPrice] = useState(100);

  const stats = useMemo(() => {
    const cost = Math.max(0, costPrice);
    const sell = Math.max(0, sellingPrice);

    const grossProfit = sell - cost;
    const profitMarginPercent = sell > 0 ? (grossProfit / sell) * 100 : 0;
    const markupPercent = cost > 0 ? (grossProfit / cost) * 100 : 0;

    return {
      grossProfit,
      profitMarginPercent: isFinite(profitMarginPercent) ? profitMarginPercent : 0,
      markupPercent: isFinite(markupPercent) ? markupPercent : 0,
    };
  }, [costPrice, sellingPrice]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Profit Margin & Markup Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate gross profit margin percentage and markup on cost.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Cost Price</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(costPrice, currency)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="1000"
              step="5"
              value={costPrice}
              onChange={(e) => setCostPrice(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Selling Price</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(sellingPrice, currency)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="2000"
              step="5"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Gross Profit Margin</p>
            <p className={`mt-2 text-4xl font-extrabold ${stats.profitMarginPercent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
              {stats.profitMarginPercent.toFixed(2)}%
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Gross Profit</span>
              <span className={`font-bold ${stats.grossProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
                {formatCurrency(stats.grossProfit, currency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Markup on Cost</span>
              <span className="font-semibold text-blue-600 dark:text-cyan-300">+{stats.markupPercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
