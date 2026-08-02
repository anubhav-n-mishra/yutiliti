"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function GratuityCalculator() {
  const [currency, setCurrency] = useState("INR");
  const [lastDrawnBasic, setLastDrawnBasic] = useState(50000);
  const [tenureYears, setTenureYears] = useState(10);
  const [coveredByAct, setCoveredByAct] = useState(true);

  const gratuity = useMemo(() => {
    const b = Math.max(0, lastDrawnBasic);
    const y = Math.max(0, tenureYears);

    if (y < 5) return 0; // Minimum 5 years required

    if (coveredByAct) {
      // (15 * Basic Salary * Tenure) / 26
      return (15 * b * y) / 26;
    } else {
      // (15 * Basic Salary * Tenure) / 30
      return (15 * b * y) / 30;
    }
  }, [lastDrawnBasic, tenureYears, coveredByAct]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Gratuity Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate lump sum gratuity benefit payable upon leaving an employer (5+ years).</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Last Drawn Basic Salary + DA</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(lastDrawnBasic, currency)}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={lastDrawnBasic}
              onChange={(e) => setLastDrawnBasic(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Continuous Service (Years)</label>
              <span className="text-blue-600 dark:text-cyan-300">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="coveredByAct"
              checked={coveredByAct}
              onChange={(e) => setCoveredByAct(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="coveredByAct" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Covered under Gratuity Act 1972 (Default)
            </label>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Estimated Gratuity Payable</p>
            <p className="mt-2 text-4xl font-extrabold text-zinc-950 dark:text-white">
              {tenureYears >= 5 ? formatCurrency(gratuity, currency) : "₹0"}
            </p>
          </div>

          <div className="mt-6 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            {tenureYears < 5 ? (
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                Minimum 5 years of continuous service required to qualify for gratuity payout.
              </p>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Calculated based on {tenureYears} years of service at {formatCurrency(lastDrawnBasic, currency)} last drawn basic pay.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
