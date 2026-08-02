"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function DiscountCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [originalPrice, setOriginalPrice] = useState(120);
  const [discountPercent, setDiscountPercent] = useState(25);

  const stats = useMemo(() => {
    const orig = Math.max(0, originalPrice);
    const disc = Math.min(100, Math.max(0, discountPercent));

    const savings = (orig * disc) / 100;
    const finalPrice = Math.max(0, orig - savings);

    return {
      savings,
      finalPrice,
    };
  }, [originalPrice, discountPercent]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Discount & Sale Price Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate final sale price and total monetary savings after percentage discounts.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Original Price</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(originalPrice, currency)}</span>
            </div>
            <input
              type="range"
              min="5"
              max="5000"
              step="5"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Discount Off (%)</label>
              <span className="text-blue-600 dark:text-cyan-300">{discountPercent}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="95"
              step="1"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Final Discounted Price</p>
            <p className="mt-2 text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(stats.finalPrice, currency)}
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Total Money Saved</span>
              <span className="font-bold text-blue-600 dark:text-cyan-300">{formatCurrency(stats.savings, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
