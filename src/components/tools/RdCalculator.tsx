import React, { useState, useMemo } from 'react';
import { PiggyBank, Calendar, Percent } from 'lucide-react';
import CurrencySelector from '@/src/components/CurrencySelector';
import { formatCurrency as formatCurr, getCurrency } from '@/src/lib/currency';

interface RdCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function RdCalculator({ onCopy }: RdCalculatorProps) {
  const [currency, setCurrency] = useState<string>('USD');
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(5000);
  const [interestRate, setInterestRate] = useState<number>(7.0);
  const [tenureMonths, setTenureMonths] = useState<number>(36); // 3 Years

  const currObj = getCurrency(currency);

  const calc = useMemo(() => {
    const P = monthlyDeposit;
    const rate = interestRate / 100;
    const N = tenureMonths;

    if (P <= 0 || rate <= 0 || N <= 0) return null;

    let maturityValue = 0;
    for (let i = 1; i <= N; i++) {
      const monthsRemaining = N - i + 1;
      const quarters = monthsRemaining / 3;
      maturityValue += P * Math.pow(1 + rate / 4, quarters);
    }

    const totalInvested = P * N;
    const interestEarned = maturityValue - totalInvested;

    const fmt = (val: number) => formatCurr(val, currency);

    return {
      totalInvestedFormatted: fmt(totalInvested),
      interestEarnedFormatted: fmt(interestEarned),
      maturityValueFormatted: fmt(maturityValue),
    };
  }, [monthlyDeposit, interestRate, tenureMonths, currency]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <CurrencySelector value={currency} onChange={setCurrency} />

          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <PiggyBank className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Recurring Deposit Details
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Monthly Installment ({currObj.symbol})</label>
            <input
              type="number"
              value={monthlyDeposit}
              step="500"
              onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
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
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Tenure (Months)</label>
              <input
                type="number"
                value={tenureMonths}
                step="6"
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {calc ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">RD Maturity Value</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {calc.maturityValueFormatted}
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Total Invested: {calc.totalInvestedFormatted}</p>
              </div>

              <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                <div className="text-xs text-zinc-500">Interest Returns Earned</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">{calc.interestEarnedFormatted}</div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`RD Maturity Value: ${calc.maturityValueFormatted} | Interest Earned: ${calc.interestEarnedFormatted}`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy RD Summary
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Enter valid RD inputs.</div>
          )}
        </div>
      </div>
    </div>
  );
}
