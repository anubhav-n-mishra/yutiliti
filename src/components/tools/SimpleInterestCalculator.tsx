import React, { useState, useMemo } from 'react';
import { Calculator, Percent, Clock } from 'lucide-react';
import CurrencySelector from '@/src/components/CurrencySelector';
import { formatCurrency as formatCurr, getCurrency } from '@/src/lib/currency';

interface SimpleInterestCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

type TimeUnit = 'years' | 'months' | 'days';

export default function SimpleInterestCalculator({ onCopy }: SimpleInterestCalculatorProps) {
  const [currency, setCurrency] = useState<string>('USD');
  const [principal, setPrincipal] = useState<number>(50000);
  const [rate, setRate] = useState<number>(6.5);
  const [timeValue, setTimeValue] = useState<number>(2);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('years');

  const currObj = getCurrency(currency);

  const calc = useMemo(() => {
    const P = principal;
    const R = rate;

    let timeInYears = timeValue;
    if (timeUnit === 'months') timeInYears = timeValue / 12;
    else if (timeUnit === 'days') timeInYears = timeValue / 365;

    if (P <= 0 || R <= 0 || timeValue <= 0) return null;

    const interest = (P * R * timeInYears) / 100;
    const totalAmount = P + interest;

    const fmt = (val: number) => formatCurr(val, currency);

    return {
      interestFormatted: fmt(interest),
      totalAmountFormatted: fmt(totalAmount),
      formulaText: `I = (${currObj.symbol}${P.toLocaleString()} × ${R}% × ${timeInYears.toFixed(2)} yrs) / 100 = ${fmt(interest)}`,
    };
  }, [principal, rate, timeValue, timeUnit, currency, currObj]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <CurrencySelector value={currency} onChange={setCurrency} />

          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <Calculator className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Simple Interest Parameters
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Principal Amount ({currObj.symbol})</label>
            <input
              type="number"
              value={principal}
              step="5000"
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
                step="0.25"
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Tenure Duration</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={timeValue}
                  onChange={(e) => setTimeValue(Number(e.target.value))}
                  className="w-1/2 rounded-xl border border-zinc-300 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <select
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}
                  className="w-1/2 rounded-xl border border-zinc-300 bg-white px-1 py-2 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {calc ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Total Payback Amount</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {calc.totalAmountFormatted}
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Simple Interest Earned: {calc.interestFormatted}</p>
              </div>

              <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                <div className="text-xs text-zinc-500">Formula Calculation</div>
                <div className="mt-1 font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200">{calc.formulaText}</div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`Simple Interest Total: ${calc.totalAmountFormatted} (Interest: ${calc.interestFormatted})`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Simple Interest Summary
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Enter valid inputs to calculate simple interest.</div>
          )}
        </div>
      </div>
    </div>
  );
}
