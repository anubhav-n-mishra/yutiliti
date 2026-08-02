import React, { useState, useMemo } from 'react';
import { Landmark, Percent, Award, ShieldCheck } from 'lucide-react';

interface FdCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function FdCalculator({ onCopy }: FdCalculatorProps) {
  const [depositAmount, setDepositAmount] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(7.25);
  const [tenureYears, setTenureYears] = useState<number>(3);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);

  const calc = useMemo(() => {
    const P = depositAmount;
    const effectiveRate = isSeniorCitizen ? interestRate + 0.5 : interestRate;
    const r = effectiveRate / 100;
    const t = tenureYears;
    const n = 4; // Quarterly compounding for Indian FDs

    if (P <= 0 || effectiveRate <= 0 || tenureYears <= 0) return null;

    const maturityAmount = P * Math.pow(1 + r / n, n * t);
    const interestEarned = maturityAmount - P;

    const fmt = (val: number) =>
      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    return {
      effectiveRate,
      maturityAmountFormatted: fmt(maturityAmount),
      interestEarnedFormatted: fmt(interestEarned),
      principalFormatted: fmt(P),
    };
  }, [depositAmount, interestRate, tenureYears, isSeniorCitizen]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <Landmark className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Fixed Deposit Details
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Deposit Amount (₹)</label>
            <input
              type="number"
              value={depositAmount}
              step="10000"
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Interest Rate (% p.a.)</label>
              <input
                type="number"
                value={interestRate}
                step="0.25"
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Tenure (Years)</label>
              <input
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="seniorCitizen"
              checked={isSeniorCitizen}
              onChange={(e) => setIsSeniorCitizen(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="seniorCitizen" className="text-xs text-zinc-700 dark:text-zinc-300">
              Senior Citizen Special (+0.5% rate bonus)
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {calc ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">FD Maturity Value</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {calc.maturityAmountFormatted}
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Total Interest Earned: {calc.interestEarnedFormatted}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Effective Interest Rate</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{calc.effectiveRate}% p.a.</div>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Principal Deposited</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{calc.principalFormatted}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`FD Maturity Value: ${calc.maturityAmountFormatted} | Total Interest: ${calc.interestEarnedFormatted}`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy FD Summary
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Enter valid FD details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
