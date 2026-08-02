"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function GstCalculator() {
  const [currency, setCurrency] = useState("INR");
  const [amount, setAmount] = useState(10000);
  const [gstRate, setGstRate] = useState(18);
  const [isInclusive, setIsInclusive] = useState(false);

  const stats = useMemo(() => {
    const amt = Math.max(0, amount);
    const rate = Math.max(0, gstRate) / 100;

    let baseAmount = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (isInclusive) {
      // Inclusive: GST Amount = Amount - (Amount / (1 + Rate))
      baseAmount = amt / (1 + rate);
      gstAmount = amt - baseAmount;
      totalAmount = amt;
    } else {
      // Exclusive: GST Amount = Amount * Rate
      baseAmount = amt;
      gstAmount = amt * rate;
      totalAmount = amt + gstAmount;
    }

    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;

    return {
      baseAmount,
      gstAmount,
      totalAmount,
      cgst,
      sgst,
    };
  }, [amount, gstRate, isInclusive]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">GST Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate inclusive and exclusive GST tax amounts with CGST/SGST breakdown.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Calculation Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsInclusive(false)}
                className={`py-2 px-4 rounded-xl text-sm font-semibold transition ${
                  !isInclusive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                }`}
              >
                Add GST (Exclusive)
              </button>
              <button
                type="button"
                onClick={() => setIsInclusive(true)}
                className={`py-2 px-4 rounded-xl text-sm font-semibold transition ${
                  isInclusive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                }`}
              >
                Remove GST (Inclusive)
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Amount</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(amount, currency)}</span>
            </div>
            <input
              type="range"
              min="100"
              max="500000"
              step="500"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">GST Rate (%)</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 12, 18, 28].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setGstRate(rate)}
                  className={`py-2 text-sm font-bold rounded-xl border transition ${
                    gstRate === rate
                      ? "border-blue-600 bg-blue-50 text-blue-600 dark:border-cyan-400 dark:bg-cyan-950/40 dark:text-cyan-300"
                      : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Total Amount</p>
            <p className="mt-2 text-4xl font-extrabold text-zinc-950 dark:text-white">
              {formatCurrency(stats.totalAmount, currency)}
            </p>
          </div>

          <div className="mt-6 space-y-3 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Net / Base Price</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(stats.baseAmount, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Total GST Amount ({gstRate}%)</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(stats.gstAmount, currency)}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-500 pt-2 border-t border-dashed border-zinc-300 dark:border-zinc-800">
              <span>CGST ({gstRate / 2}%): {formatCurrency(stats.cgst, currency)}</span>
              <span>SGST ({gstRate / 2}%): {formatCurrency(stats.sgst, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
