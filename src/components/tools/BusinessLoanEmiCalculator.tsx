"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency, getCurrency } from "@/src/lib/currency";

export default function BusinessLoanEmiCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [loanAmount, setLoanAmount] = useState(50000);
  const [interestRate, setInterestRate] = useState(12.5);
  const [tenureYears, setTenureYears] = useState(5);

  const stats = useMemo(() => {
    const p = Math.max(0, loanAmount);
    const r = Math.max(0, interestRate) / 12 / 100;
    const n = Math.max(1, tenureYears * 12);

    let emi = 0;
    if (r > 0) {
      emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      emi = p / n;
    }

    const totalPayment = emi * n;
    const totalInterest = Math.max(0, totalPayment - p);

    return {
      emi: isFinite(emi) ? emi : 0,
      totalInterest: isFinite(totalInterest) ? totalInterest : 0,
      totalPayment: isFinite(totalPayment) ? totalPayment : 0,
    };
  }, [loanAmount, interestRate, tenureYears]);

  const symbol = getCurrency(currency).symbol;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Business Loan EMI Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate working capital and commercial loan EMI repayments.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Loan Amount ({symbol})</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(loanAmount, currency)}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="2000000"
              step="5000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Interest Rate (%)</label>
              <span className="text-blue-600 dark:text-cyan-300">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="6"
              max="30"
              step="0.25"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Tenure (Years)</label>
              <span className="text-blue-600 dark:text-cyan-300">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Monthly Business EMI</p>
            <p className="mt-2 text-4xl font-extrabold text-zinc-950 dark:text-white">
              {formatCurrency(stats.emi, currency)}
              <span className="text-sm font-medium text-zinc-500"> / mo</span>
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Principal Financing</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(loanAmount, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Interest Cost</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(stats.totalInterest, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Total Outflow</span>
              <span className="font-bold text-zinc-950 dark:text-white">{formatCurrency(stats.totalPayment, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
