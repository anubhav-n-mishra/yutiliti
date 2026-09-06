import React, { useState, useMemo } from 'react';
import { PiggyBank, TrendingUp, RefreshCw, Info, DollarSign } from 'lucide-react';
import CurrencySelector from '@/src/components/CurrencySelector';
import { formatCurrency as formatCurr, getCurrency } from '@/src/lib/currency';

interface RetirementCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
  initialCurrentAge?: number;
  initialRetirementAge?: number;
  initialLifeExpectancy?: number;
  initialCurrentSavings?: number;
  initialMonthlyExpenses?: number;
  initialExpectedReturn?: number;
  initialInflationRate?: number;
  initialCurrency?: string;
}

export default function RetirementCalculator({
  onCopy,
  onShare,
  initialCurrentAge,
  initialRetirementAge,
  initialLifeExpectancy,
  initialCurrentSavings,
  initialMonthlyExpenses,
  initialExpectedReturn,
  initialInflationRate,
  initialCurrency,
}: RetirementCalculatorProps) {
  const [currency, setCurrency] = useState<string>(initialCurrency || 'USD');
  const [currentAge, setCurrentAge] = useState<number>(initialCurrentAge ?? 30);
  const [retirementAge, setRetirementAge] = useState<number>(initialRetirementAge ?? 60);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(initialLifeExpectancy ?? 85);
  const [currentSavings, setCurrentSavings] = useState<number>(initialCurrentSavings ?? 50000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(initialMonthlyExpenses ?? 4000);
  const [expectedReturn, setExpectedReturn] = useState<number>(initialExpectedReturn ?? 8.0);
  const [inflationRate, setInflationRate] = useState<number>(initialInflationRate ?? 3.0);

  const currObj = getCurrency(currency);

  const calc = useMemo(() => {
    const yearsToRetire = Math.max(1, retirementAge - currentAge);
    const yearsInRetirement = Math.max(1, lifeExpectancy - retirementAge);

    const monthlyExpAtRetirement = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetire);
    const annualExpAtRetirement = monthlyExpAtRetirement * 12;

    const realReturnInRetirement = Math.max(0.005, (expectedReturn * 0.7 - inflationRate) / 100);

    const r = realReturnInRetirement;
    const n = yearsInRetirement;
    const targetCorpus = annualExpAtRetirement * ((1 - Math.pow(1 + r, -n)) / r);

    const fvCurrentSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetire);

    const shortfall = Math.max(0, targetCorpus - fvCurrentSavings);

    const monthlyRate = expectedReturn / 12 / 100;
    const totalMonths = yearsToRetire * 12;

    const monthlySavingsNeeded = shortfall <= 0
      ? 0
      : (shortfall * monthlyRate) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const formatVal = (val: number) => formatCurr(val, currency);

    return {
      yearsToRetire,
      yearsInRetirement,
      monthlyExpAtRetirement: formatVal(monthlyExpAtRetirement),
      targetCorpus: formatVal(targetCorpus),
      fvCurrentSavings: formatVal(fvCurrentSavings),
      shortfall: formatVal(shortfall),
      monthlySavingsNeeded: formatVal(monthlySavingsNeeded),
      rawTargetCorpus: targetCorpus,
      rawMonthlySavings: monthlySavingsNeeded,
    };
  }, [currentAge, retirementAge, lifeExpectancy, currentSavings, monthlyExpenses, expectedReturn, inflationRate, currency]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <CurrencySelector value={currency} onChange={setCurrency} />

          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <PiggyBank className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Financial & Age Parameters
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Retire Age</label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Life Expectancy</label>
              <input
                type="number"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Current Monthly Expenses (₹)</label>
            <input
              type="number"
              value={monthlyExpenses}
              step="1000"
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Existing Retirement Savings (₹)</label>
            <input
              type="number"
              value={currentSavings}
              step="50000"
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Expected ROI (%)</label>
              <input
                type="number"
                value={expectedReturn}
                step="0.5"
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Inflation Rate (%)</label>
              <input
                type="number"
                value={inflationRate}
                step="0.5"
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Target Retirement Corpus</span>
              <div className="mt-1 font-display text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
                {calc.targetCorpus}
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                To sustain monthly expenses of {calc.monthlyExpAtRetirement} after age {retirementAge} (for {calc.yearsInRetirement} years).
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Recommended Additional Monthly Investment</span>
              <div className="mt-1 font-display text-2xl font-bold text-blue-600 dark:text-cyan-400">
                {calc.monthlySavingsNeeded} <span className="text-xs font-normal text-zinc-500">/ month</span>
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">
                For the next {calc.yearsToRetire} years at {expectedReturn}% expected return.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onCopy(`Target Retirement Corpus: ${calc.targetCorpus} | Monthly Investment Required: ${calc.monthlySavingsNeeded}`)}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
            >
              Copy Retirement Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
