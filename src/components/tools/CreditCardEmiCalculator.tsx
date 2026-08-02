"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function CreditCardEmiCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [purchaseAmount, setPurchaseAmount] = useState(3000);
  const [annualInterestRate, setAnnualInterestRate] = useState(16);
  const [tenureMonths, setTenureMonths] = useState(12);
  const [processingFeePercent, setProcessingFeePercent] = useState(1);

  const stats = useMemo(() => {
    const p = Math.max(0, purchaseAmount);
    const r = Math.max(0, annualInterestRate) / 12 / 100;
    const n = Math.max(1, tenureMonths);
    const fee = (p * Math.max(0, processingFeePercent)) / 100;

    let emi = 0;
    if (r > 0) {
      emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      emi = p / n;
    }

    const totalInterest = Math.max(0, emi * n - p);
    const totalOutflow = p + totalInterest + fee;

    return {
      emi: isFinite(emi) ? emi : 0,
      totalInterest: isFinite(totalInterest) ? totalInterest : 0,
      processingFee: fee,
      totalOutflow: isFinite(totalOutflow) ? totalOutflow : 0,
    };
  }, [purchaseAmount, annualInterestRate, tenureMonths, processingFeePercent]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Credit Card EMI & Payoff Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate credit card balance EMI conversion costs, interest charges, and processing fees.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Credit Card Purchase / Balance</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(purchaseAmount, currency)}</span>
            </div>
            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Annual Interest Rate (%)</label>
              <span className="text-blue-600 dark:text-cyan-300">{annualInterestRate}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="42"
              step="1"
              value={annualInterestRate}
              onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Tenure (Months)</label>
              <span className="text-blue-600 dark:text-cyan-300">{tenureMonths} Months</span>
            </div>
            <input
              type="range"
              min="3"
              max="36"
              step="1"
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Monthly Credit Card EMI</p>
            <p className="mt-2 text-4xl font-extrabold text-zinc-950 dark:text-white">
              {formatCurrency(stats.emi, currency)}
              <span className="text-sm font-medium text-zinc-500"> / mo</span>
            </p>
          </div>

          <div className="mt-6 space-y-3 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Total Interest Cost</span>
              <span className="font-semibold text-rose-600">{formatCurrency(stats.totalInterest, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Processing Fee</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(stats.processingFee, currency)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <span className="font-bold text-zinc-900 dark:text-white">Total Outflow</span>
              <span className="font-bold text-zinc-950 dark:text-white">{formatCurrency(stats.totalOutflow, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
