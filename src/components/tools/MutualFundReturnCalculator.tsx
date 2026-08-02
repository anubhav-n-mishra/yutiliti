"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function MutualFundReturnCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [investmentType, setInvestmentType] = useState<"lumpsum" | "sip">("lumpsum");
  const [amount, setAmount] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [tenureYears, setTenureYears] = useState(5);

  const stats = useMemo(() => {
    const p = Math.max(0, amount);
    const r = Math.max(0, expectedReturn) / 100;
    const y = Math.max(1, tenureYears);

    let totalInvested = 0;
    let finalCorpus = 0;

    if (investmentType === "lumpsum") {
      totalInvested = p;
      finalCorpus = p * Math.pow(1 + r, y);
    } else {
      const monthlyRate = r / 12;
      const months = y * 12;
      totalInvested = p * months;
      if (monthlyRate > 0) {
        finalCorpus = p * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
      } else {
        finalCorpus = totalInvested;
      }
    }

    const estimatedWealthGain = Math.max(0, finalCorpus - totalInvested);

    return {
      totalInvested,
      finalCorpus: isFinite(finalCorpus) ? finalCorpus : 0,
      estimatedWealthGain: isFinite(estimatedWealthGain) ? estimatedWealthGain : 0,
    };
  }, [investmentType, amount, expectedReturn, tenureYears]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Mutual Fund Return Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate lump sum and SIP mutual fund wealth growth and returns over time.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Investment Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setInvestmentType("lumpsum")}
                className={`py-2 px-4 rounded-xl text-sm font-semibold transition ${
                  investmentType === "lumpsum"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                }`}
              >
                One-Time Lump Sum
              </button>
              <button
                type="button"
                onClick={() => setInvestmentType("sip")}
                className={`py-2 px-4 rounded-xl text-sm font-semibold transition ${
                  investmentType === "sip"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                }`}
              >
                Monthly SIP
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">
                {investmentType === "lumpsum" ? "Total Lump Sum Investment" : "Monthly SIP Contribution"}
              </label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(amount, currency)}</span>
            </div>
            <input
              type="range"
              min="500"
              max="500000"
              step="500"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Expected Annual Return Rate (%)</label>
              <span className="text-blue-600 dark:text-cyan-300">{expectedReturn}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Investment Horizon (Years)</label>
              <span className="text-blue-600 dark:text-cyan-300">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Expected Future Maturity Value</p>
            <p className="mt-2 text-4xl font-extrabold text-zinc-950 dark:text-white">
              {formatCurrency(stats.finalCorpus, currency)}
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Total Invested Principal</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(stats.totalInvested, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Estimated Wealth Gain</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.estimatedWealthGain, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
