import React, { useState, useMemo } from 'react';
import { TrendingUp, RefreshCw, DollarSign } from 'lucide-react';
import CurrencySelector from '@/src/components/CurrencySelector';
import { formatCurrency as formatCurr, getCurrency } from '@/src/lib/currency';

interface CompoundInterestCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
  initialPrincipal?: number;
  initialMonthlyContribution?: number;
  initialAnnualRate?: number;
  initialYears?: number;
  initialCompoundFreq?: number;
  initialCurrency?: string;
}

export default function CompoundInterestCalculator({
  onCopy,
  onShare,
  initialPrincipal: propInitialPrincipal,
  initialMonthlyContribution,
  initialAnnualRate,
  initialYears,
  initialCompoundFreq,
  initialCurrency,
}: CompoundInterestCalculatorProps) {
  const [currency, setCurrency] = useState<string>(initialCurrency || 'USD');
  const [initialPrincipal, setInitialPrincipal] = useState<number>(propInitialPrincipal ?? 10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(initialMonthlyContribution ?? 500);
  const [annualRate, setAnnualRate] = useState<number>(initialAnnualRate ?? 10.0);
  const [years, setYears] = useState<number>(initialYears ?? 10);
  const [compoundFreq, setCompoundFreq] = useState<number>(initialCompoundFreq ?? 12);

  const currObj = getCurrency(currency);

  const calc = useMemo(() => {
    const P = initialPrincipal;
    const PMT = monthlyContribution;
    const r = annualRate / 100;
    const t = years;
    const n = compoundFreq;

    if (P < 0 || annualRate <= 0 || years <= 0) return null;

    let currentBalance = P;
    let totalInvested = P;

    const yearlyData = [];

    for (let yr = 1; yr <= t; yr++) {
      let yearlyContrib = 0;
      for (let m = 1; m <= 12; m++) {
        currentBalance += PMT;
        yearlyContrib += PMT;
        currentBalance *= Math.pow(1 + r / n, n / 12);
      }
      totalInvested += yearlyContrib;

      yearlyData.push({
        year: yr,
        invested: Math.round(totalInvested),
        balance: Math.round(currentBalance),
        interest: Math.round(currentBalance - totalInvested),
      });
    }

    const finalBalance = currentBalance;
    const totalInterest = finalBalance - totalInvested;

    const fmt = (val: number) => formatCurr(val, currency);

    return {
      finalBalanceFormatted: fmt(finalBalance),
      totalInvestedFormatted: fmt(totalInvested),
      totalInterestFormatted: fmt(totalInterest),
      yearlyData,
    };
  }, [initialPrincipal, monthlyContribution, annualRate, years, compoundFreq, currency]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <CurrencySelector value={currency} onChange={setCurrency} />

          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Investment Growth Inputs
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Initial Principal (₹)</label>
            <input
              type="number"
              value={initialPrincipal}
              step="10000"
              onChange={(e) => setInitialPrincipal(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Monthly Contribution (₹)</label>
            <input
              type="number"
              value={monthlyContribution}
              step="1000"
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Annual Return (%)</label>
              <input
                type="number"
                value={annualRate}
                step="0.5"
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Time Horizon (Years)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
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
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Future Portfolio Value</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {calc.finalBalanceFormatted}
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Total Invested Capital: {calc.totalInvestedFormatted}</p>
              </div>

              <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                <div className="text-xs text-zinc-500">Compound Returns Accrued</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">{calc.totalInterestFormatted}</div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`Future Portfolio Value: ${calc.finalBalanceFormatted} | Total Interest: ${calc.totalInterestFormatted}`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Wealth Growth Summary
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Enter valid investment inputs.</div>
          )}
        </div>
      </div>
    </div>
  );
}
