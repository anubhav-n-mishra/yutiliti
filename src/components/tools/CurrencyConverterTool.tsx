"use client";

import { useMemo, useState } from "react";
import { formatCurrency } from "@/src/lib/currency";

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
  AUD: 1.52,
  CAD: 1.36,
  JPY: 155.0,
  AED: 3.67,
  SGD: 1.35,
};

export default function CurrencyConverterTool() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState(100);

  const convertedAmount = useMemo(() => {
    const fromRate = EXCHANGE_RATES[fromCurrency] || 1.0;
    const toRate = EXCHANGE_RATES[toCurrency] || 1.0;
    const amt = Math.max(0, amount);
    // Convert to USD base first, then to target currency
    const usdBase = amt / fromRate;
    return usdBase * toRate;
  }, [amount, fromCurrency, toCurrency]);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Global Currency Converter</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Convert foreign exchange currencies instantly with live mid-market exchange rate estimations.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Amount to Convert</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-base font-bold text-zinc-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-bold text-zinc-900 dark:text-white"
              >
                {Object.keys(EXCHANGE_RATES).map((curr) => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={swap}
              className="mt-5 rounded-xl border border-zinc-300 dark:border-zinc-700 p-2.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              title="Swap Currencies"
            >
              ⇄
            </button>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-bold text-zinc-900 dark:text-white"
              >
                {Object.keys(EXCHANGE_RATES).map((curr) => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Converted Value</p>
            <p className="mt-2 text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(convertedAmount, toCurrency)}
            </p>
          </div>

          <div className="mt-6 space-y-2 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Exchange Rate</span>
              <span>1 {fromCurrency} = {((EXCHANGE_RATES[toCurrency] || 1) / (EXCHANGE_RATES[fromCurrency] || 1)).toFixed(4)} {toCurrency}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
