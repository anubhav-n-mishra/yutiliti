import React, { useState, useMemo } from 'react';
import { Calculator, Percent, TrendingUp, RefreshCw } from 'lucide-react';
import CurrencySelector from '@/src/components/CurrencySelector';
import { formatCurrency as formatCurr, getCurrency } from '@/src/lib/currency';

interface InterestCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function InterestCalculator({ onCopy }: InterestCalculatorProps) {
  const [currency, setCurrency] = useState<string>('USD');
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(8.0);
  const [timeYears, setTimeYears] = useState<number>(5);
  const [compounding, setCompounding] = useState<number>(12); // 12 = monthly, 4 = quarterly, 365 = daily, 1 = annual

  const currObj = getCurrency(currency);

  const calc = useMemo(() => {
    const P = principal;
    const r = rate / 100;
    const t = timeYears;
    const n = compounding;

    if (P <= 0 || rate <= 0 || timeYears <= 0) return null;

    const simpleInterest = P * r * t;
    const simpleTotal = P + simpleInterest;

    const compoundTotal = P * Math.pow(1 + r / n, n * t);
    const compoundInterest = compoundTotal - P;

    const diff = compoundInterest - simpleInterest;

    const fmt = (val: number) => formatCurr(val, currency);

    return {
      simpleInterestFormatted: fmt(simpleInterest),
      simpleTotalFormatted: fmt(simpleTotal),
      compoundInterestFormatted: fmt(compoundInterest),
      compoundTotalFormatted: fmt(compoundTotal),
      diffFormatted: fmt(diff),
    };
  }, [principal, rate, timeYears, compounding, currency]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <CurrencySelector value={currency} onChange={setCurrency} />

          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <Calculator className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Interest Parameters
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Principal Amount ({currObj.symbol})</label>
            <input
              type="number"
              value={principal}
              step="10000"
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Annual Interest Rate (%)</label>
              <input
                type="number"
                value={rate}
                step="0.5"
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Time Period (Years)</label>
              <input
                type="number"
                value={timeYears}
                onChange={(e) => setTimeYears(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Compounding Frequency</label>
            <select
              value={compounding}
              onChange={(e) => setCompounding(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              <option value={365}>Daily (365 times/yr)</option>
              <option value={12}>Monthly (12 times/yr)</option>
              <option value={4}>Quarterly (4 times/yr)</option>
              <option value={2}>Semi-Annually (2 times/yr)</option>
              <option value={1}>Annually (1 time/yr)</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {calc ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Compound Maturity Total</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {calc.compoundTotalFormatted}
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Compound Interest Earned: {calc.compoundInterestFormatted}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Simple Interest Total</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{calc.simpleTotalFormatted}</div>
                  <div className="mt-0.5 text-[10px] text-zinc-400">Interest: {calc.simpleInterestFormatted}</div>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Compound Gain Advantage</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">+{calc.diffFormatted}</div>
                  <div className="mt-0.5 text-[10px] text-zinc-400">Vs Simple Interest</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`Compound Maturity: ${calc.compoundTotalFormatted} | Compound Interest: ${calc.compoundInterestFormatted}`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Interest Comparison
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Enter valid interest parameters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
