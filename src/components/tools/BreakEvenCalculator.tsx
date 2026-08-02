"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function BreakEvenCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [fixedCosts, setFixedCosts] = useState(25000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(40);
  const [pricePerUnit, setPricePerUnit] = useState(100);

  const stats = useMemo(() => {
    const fc = Math.max(0, fixedCosts);
    const vc = Math.max(0, variableCostPerUnit);
    const p = Math.max(0, pricePerUnit);

    const marginPerUnit = Math.max(0, p - vc);
    const breakEvenUnits = marginPerUnit > 0 ? Math.ceil(fc / marginPerUnit) : 0;
    const breakEvenRevenue = breakEvenUnits * p;
    const marginRatio = p > 0 ? (marginPerUnit / p) * 100 : 0;

    return {
      marginPerUnit,
      breakEvenUnits,
      breakEvenRevenue,
      marginRatio,
    };
  }, [fixedCosts, variableCostPerUnit, pricePerUnit]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Break-Even Analysis Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate exact sales volume units and revenue needed to cover all fixed and variable costs.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Total Fixed Overhead Costs</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(fixedCosts, currency)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Variable Cost Per Unit</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(variableCostPerUnit, currency)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="1000"
              step="5"
              value={variableCostPerUnit}
              onChange={(e) => setVariableCostPerUnit(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Selling Price Per Unit</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(pricePerUnit, currency)}</span>
            </div>
            <input
              type="range"
              min="5"
              max="2000"
              step="5"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Break-Even Sales Volume</p>
            <p className="mt-2 text-4xl font-extrabold text-zinc-950 dark:text-white">
              {stats.breakEvenUnits.toLocaleString()}
              <span className="text-sm font-medium text-zinc-500"> units</span>
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Break-Even Revenue Required</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.breakEvenRevenue, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Contribution Margin / Unit</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(stats.marginPerUnit, currency)} ({stats.marginRatio.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
