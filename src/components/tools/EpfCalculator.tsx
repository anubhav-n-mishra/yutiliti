"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function EpfCalculator() {
  const [currency, setCurrency] = useState("INR");
  const [monthlyBasicSalary, setMonthlyBasicSalary] = useState(40000);
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(58);
  const [currentEpfBalance, setCurrentEpfBalance] = useState(50000);
  const [expectedSalaryIncrease, setExpectedSalaryIncrease] = useState(5);
  const [interestRate, setInterestRate] = useState(8.25);

  const stats = useMemo(() => {
    const years = Math.max(1, retirementAge - currentAge);
    let totalBalance = Math.max(0, currentEpfBalance);
    let currentBasic = Math.max(0, monthlyBasicSalary);
    let totalEmployeeContrib = 0;
    let totalEmployerContrib = 0;

    for (let yr = 0; yr < years; yr++) {
      for (let m = 0; m < 12; m++) {
        const empContrib = currentBasic * 0.12;
        // EPF portion of employer is 3.67% (8.33% goes to EPS capped at 1250)
        const empPfundPortion = currentBasic * 0.0367;

        totalBalance += empContrib + empPfundPortion;
        totalEmployeeContrib += empContrib;
        totalEmployerContrib += empPfundPortion;
      }
      // Apply annual interest
      totalBalance += totalBalance * (interestRate / 100);
      currentBasic += currentBasic * (expectedSalaryIncrease / 100);
    }

    const totalContrib = totalEmployeeContrib + totalEmployerContrib;
    const totalInterest = Math.max(0, totalBalance - currentEpfBalance - totalContrib);

    return {
      maturityCorpus: isFinite(totalBalance) ? totalBalance : 0,
      totalEmployeeContrib,
      totalEmployerContrib,
      totalInterest,
    };
  }, [monthlyBasicSalary, currentAge, retirementAge, currentEpfBalance, expectedSalaryIncrease, interestRate]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">EPF Calculator (Employee Provident Fund)</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate accumulated retirement provident fund corpus and interest growth.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Monthly Basic + DA</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(monthlyBasicSalary, currency)}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="300000"
              step="5000"
              value={monthlyBasicSalary}
              onChange={(e) => setMonthlyBasicSalary(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Retirement Age</label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">EPF Interest Rate (%)</label>
              <span className="text-blue-600 dark:text-cyan-300">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="7"
              max="10"
              step="0.05"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Accumulated EPF Maturity Corpus</p>
            <p className="mt-2 text-4xl font-extrabold text-zinc-950 dark:text-white">
              {formatCurrency(stats.maturityCorpus, currency)}
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Employee Contribution</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(stats.totalEmployeeContrib, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Employer Contribution</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(stats.totalEmployerContrib, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Total Interest Earned</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.totalInterest, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
