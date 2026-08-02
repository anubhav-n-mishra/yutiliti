"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function IncomeTaxCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [annualIncome, setAnnualIncome] = useState(85000);
  const [deductions, setDeductions] = useState(12000);

  const stats = useMemo(() => {
    const inc = Math.max(0, annualIncome);
    const ded = Math.min(inc, Math.max(0, deductions));
    const taxableIncome = Math.max(0, inc - ded);

    // Simplified progressive tax brackets (for general estimation)
    let tax = 0;
    if (taxableIncome > 100000) {
      tax += (taxableIncome - 100000) * 0.28 + 15000;
    } else if (taxableIncome > 50000) {
      tax += (taxableIncome - 50000) * 0.20 + 5000;
    } else if (taxableIncome > 20000) {
      tax += (taxableIncome - 20000) * 0.10;
    }

    const netTakeHome = Math.max(0, inc - tax);
    const effectiveRate = inc > 0 ? (tax / inc) * 100 : 0;

    return {
      taxableIncome,
      tax,
      netTakeHome,
      effectiveRate,
    };
  }, [annualIncome, deductions]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Income Tax Estimator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Estimate income tax liability, tax brackets, and net annual take-home salary.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Annual Gross Income</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(annualIncome, currency)}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Total Deductions & Exemptions</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(deductions, currency)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={deductions}
              onChange={(e) => setDeductions(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Estimated Annual Tax</p>
            <p className="mt-2 text-4xl font-extrabold text-rose-600">
              {formatCurrency(stats.tax, currency)}
            </p>
            <p className="mt-1 text-xs text-zinc-500 font-medium">Effective Tax Rate: {stats.effectiveRate.toFixed(1)}%</p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Taxable Base Income</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(stats.taxableIncome, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Net Take-Home Salary</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.netTakeHome, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
