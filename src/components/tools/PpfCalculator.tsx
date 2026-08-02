import React, { useState, useMemo } from 'react';
import { Landmark, ShieldCheck, TrendingUp, Info } from 'lucide-react';
import CurrencySelector from '@/src/components/CurrencySelector';
import { formatCurrency as formatCurr, getCurrency } from '@/src/lib/currency';

interface PpfCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function PpfCalculator({ onCopy }: PpfCalculatorProps) {
  const [currency, setCurrency] = useState<string>('INR');
  const [annualDeposit, setAnnualDeposit] = useState<number>(150000); // Max 1.5L per year
  const [interestRate, setInterestRate] = useState<number>(7.1); // Current Govt rate
  const [tenureYears, setTenureYears] = useState<number>(15); // Standard 15 years

  const currObj = getCurrency(currency);

  const calc = useMemo(() => {
    const P = Math.min(150000, Math.max(500, annualDeposit));
    const r = interestRate / 100;
    const t = tenureYears;

    if (P <= 0 || interestRate <= 0 || tenureYears <= 0) return null;

    let balance = 0;
    let totalInvested = 0;

    for (let yr = 1; yr <= t; yr++) {
      totalInvested += P;
      balance += P;
      const interestForYear = balance * r;
      balance += interestForYear;
    }

    const totalInterest = balance - totalInvested;

    const fmt = (val: number) => formatCurr(val, currency);

    return {
      depositFormatted: fmt(P),
      totalInvestedFormatted: fmt(totalInvested),
      totalInterestFormatted: fmt(totalInterest),
      maturityBalanceFormatted: fmt(balance),
    };
  }, [annualDeposit, interestRate, tenureYears, currency]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <CurrencySelector value={currency} onChange={setCurrency} />

          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <Landmark className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            PPF Investment Parameters
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Annual Investment Amount ({currObj.symbol})
            </label>
            <input
              type="number"
              value={annualDeposit}
              min="500"
              max="150000"
              step="5000"
              onChange={(e) => setAnnualDeposit(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Govt Interest Rate (% p.a.)</label>
              <input
                type="number"
                value={interestRate}
                step="0.1"
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Tenure Period</label>
              <select
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value={15}>15 Years (Standard)</option>
                <option value={20}>20 Years (1 Block Extension)</option>
                <option value={25}>25 Years (2 Block Extensions)</option>
                <option value={30}>30 Years (3 Block Extensions)</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              EEE Tax Exemption Status
            </div>
            <p className="mt-1 leading-relaxed">
              Exempt-Exempt-Exempt: Contributions qualify for Sec 80C, interest earned is tax-free, and maturity payout is 100% tax-free.
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {calc ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Tax-Free Maturity Corpus</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {calc.maturityBalanceFormatted}
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Total Invested: {calc.totalInvestedFormatted} over {tenureYears} yrs</p>
              </div>

              <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                <div className="text-xs text-zinc-500">Tax-Free Interest Earned</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">{calc.totalInterestFormatted}</div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`PPF Maturity Corpus: ${calc.maturityBalanceFormatted} | Total Interest: ${calc.totalInterestFormatted}`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy PPF Summary
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Enter valid PPF details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
