"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function NetWorthCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [cashSavings, setCashSavings] = useState(25000);
  const [investments, setInvestments] = useState(150000);
  const [realEstateValue, setRealEstateValue] = useState(350000);
  const [otherAssets, setOtherAssets] = useState(20000);

  const [mortgageDebt, setMortgageDebt] = useState(220000);
  const [vehicleLoans, setVehicleLoans] = useState(15000);
  const [creditCardDebt, setCreditCardDebt] = useState(3000);
  const [otherLiabilities, setOtherLiabilities] = useState(5000);

  const stats = useMemo(() => {
    const totalAssets =
      Math.max(0, cashSavings) +
      Math.max(0, investments) +
      Math.max(0, realEstateValue) +
      Math.max(0, otherAssets);

    const totalLiabilities =
      Math.max(0, mortgageDebt) +
      Math.max(0, vehicleLoans) +
      Math.max(0, creditCardDebt) +
      Math.max(0, otherLiabilities);

    const netWorth = totalAssets - totalLiabilities;

    return {
      totalAssets,
      totalLiabilities,
      netWorth,
    };
  }, [
    cashSavings,
    investments,
    realEstateValue,
    otherAssets,
    mortgageDebt,
    vehicleLoans,
    creditCardDebt,
    otherLiabilities,
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Net Worth Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate total personal net worth by subtracting total liabilities from total assets.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 dark:border-emerald-950/60 dark:bg-emerald-950/20 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Assets (What You Own)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Cash & Savings</label>
                <input
                  type="number"
                  value={cashSavings}
                  onChange={(e) => setCashSavings(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Investments / Stocks</label>
                <input
                  type="number"
                  value={investments}
                  onChange={(e) => setInvestments(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Real Estate Value</label>
                <input
                  type="number"
                  value={realEstateValue}
                  onChange={(e) => setRealEstateValue(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Vehicles & Personal</label>
                <input
                  type="number"
                  value={otherAssets}
                  onChange={(e) => setOtherAssets(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-5 dark:border-rose-950/60 dark:bg-rose-950/20 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">Liabilities (What You Owe)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Mortgages / Housing</label>
                <input
                  type="number"
                  value={mortgageDebt}
                  onChange={(e) => setMortgageDebt(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Vehicle / Auto Loans</label>
                <input
                  type="number"
                  value={vehicleLoans}
                  onChange={(e) => setVehicleLoans(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Credit Card Balances</label>
                <input
                  type="number"
                  value={creditCardDebt}
                  onChange={(e) => setCreditCardDebt(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Other Personal Loans</label>
                <input
                  type="number"
                  value={otherLiabilities}
                  onChange={(e) => setOtherLiabilities(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Total Net Worth</p>
            <p className={`mt-2 text-4xl font-extrabold ${stats.netWorth >= 0 ? "text-zinc-950 dark:text-white" : "text-rose-600"}`}>
              {formatCurrency(stats.netWorth, currency)}
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Total Assets</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.totalAssets, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Total Liabilities</span>
              <span className="font-bold text-rose-600">{formatCurrency(stats.totalLiabilities, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
