import React, { useState, useMemo, useEffect } from 'react';
import { PiggyBank, TrendingUp, RefreshCw, Info, DollarSign, Download, Share2, ChevronDown, ChevronUp, FileSpreadsheet, Check } from 'lucide-react';
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
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Client-side URL query parameter hydration for stateful deep links
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const age = sp.get('age');
      if (age && !isNaN(Number(age))) setCurrentAge(Number(age));
      const ret = sp.get('retire') || sp.get('retireAge');
      if (ret && !isNaN(Number(ret))) setRetirementAge(Number(ret));
      const life = sp.get('life');
      if (life && !isNaN(Number(life))) setLifeExpectancy(Number(life));
      const sav = sp.get('savings');
      if (sav && !isNaN(Number(sav))) setCurrentSavings(Number(sav));
      const exp = sp.get('expenses') || sp.get('monthly');
      if (exp && !isNaN(Number(exp))) setMonthlyExpenses(Number(exp));
      const roi = sp.get('roi') || sp.get('return');
      if (roi && !isNaN(Number(roi))) setExpectedReturn(Number(roi));
      const inf = sp.get('inf') || sp.get('inflation');
      if (inf && !isNaN(Number(inf))) setInflationRate(Number(inf));
      const c = sp.get('curr') || sp.get('currency');
      if (c) setCurrency(c);
    } catch {
      // Ignore query parsing error
    }
  }, []);

  const currObj = getCurrency(currency);
  const fmt = (val: number) => formatCurr(val, currency);

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

    // Build Lifetime Financial Roadmap Schedule (Accumulation + Decumulation)
    const roadmapSchedule: Array<{
      age: number;
      year: number;
      phase: string;
      annualCashflow: number;
      annualGrowth: number;
      endingNetWorth: number;
    }> = [];

    let netWorth = currentSavings;
    const annualSavingsContribution = monthlySavingsNeeded * 12;

    // 1. Accumulation Phase
    for (let yr = 1; yr <= yearsToRetire; yr++) {
      const age = currentAge + yr;
      const startBalance = netWorth;
      const investmentGrowth = (startBalance + annualSavingsContribution / 2) * (expectedReturn / 100);
      netWorth = startBalance + annualSavingsContribution + investmentGrowth;

      roadmapSchedule.push({
        age,
        year: yr,
        phase: 'Accumulation',
        annualCashflow: annualSavingsContribution,
        annualGrowth: investmentGrowth,
        endingNetWorth: netWorth,
      });
    }

    // 2. Decumulation Phase (Retirement)
    let currentAnnualExpenses = annualExpAtRetirement;
    const retirementRoi = expectedReturn * 0.7; // conservative allocation post-retirement

    for (let yr = 1; yr <= yearsInRetirement; yr++) {
      const age = retirementAge + yr;
      const startBalance = netWorth;
      const investmentGrowth = Math.max(0, (startBalance - currentAnnualExpenses / 2) * (retirementRoi / 100));
      netWorth = Math.max(0, startBalance - currentAnnualExpenses + investmentGrowth);

      roadmapSchedule.push({
        age,
        year: yearsToRetire + yr,
        phase: 'Retirement',
        annualCashflow: -currentAnnualExpenses,
        annualGrowth: investmentGrowth,
        endingNetWorth: netWorth,
      });

      currentAnnualExpenses *= (1 + inflationRate / 100);
    }

    return {
      yearsToRetire,
      yearsInRetirement,
      monthlyExpAtRetirementFormatted: fmt(monthlyExpAtRetirement),
      targetCorpusFormatted: fmt(targetCorpus),
      fvCurrentSavingsFormatted: fmt(fvCurrentSavings),
      shortfallFormatted: fmt(shortfall),
      monthlySavingsNeededFormatted: fmt(monthlySavingsNeeded),
      rawTargetCorpus: targetCorpus,
      rawMonthlySavings: monthlySavingsNeeded,
      roadmapSchedule,
    };
  }, [currentAge, retirementAge, lifeExpectancy, currentSavings, monthlyExpenses, expectedReturn, inflationRate, currency]);

  const handleExportCSV = () => {
    if (!calc) return;
    const headers = 'Age,Year,Lifecycle Phase,Annual Cashflow (Added or Withdrawn),Investment Growth Earned,Ending Portfolio Net Worth\n';
    const rows = calc.roadmapSchedule
      .map(
        (r) =>
          `${r.age},${r.year},${r.phase},${r.annualCashflow.toFixed(2)},${r.annualGrowth.toFixed(2)},${r.endingNetWorth.toFixed(2)}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Retirement_Roadmap_${currentAge}_to_${lifeExpectancy}_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleShareCustomLink = () => {
    const sp = new URLSearchParams({
      age: currentAge.toString(),
      retire: retirementAge.toString(),
      life: lifeExpectancy.toString(),
      savings: currentSavings.toString(),
      expenses: monthlyExpenses.toString(),
      roi: expectedReturn.toString(),
      inflation: inflationRate.toString(),
      curr: currency,
    });
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.yuitility.app';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/tools/retirement-calculator';
    const fullUrl = `${origin}${pathname}?${sp.toString()}`;

    if (onCopy) {
      onCopy(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <CurrencySelector value={currency} onChange={setCurrency} />

          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <PiggyBank className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Financial &amp; Age Parameters
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Retire Age</label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Life Expectancy</label>
              <input
                type="number"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Current Monthly Expenses ({currObj?.symbol || '$'})
            </label>
            <input
              type="number"
              value={monthlyExpenses}
              step="500"
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Existing Retirement Savings ({currObj?.symbol || '$'})
            </label>
            <input
              type="number"
              value={currentSavings}
              step="10000"
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
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
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Inflation Rate (%)</label>
              <input
                type="number"
                value={inflationRate}
                step="0.5"
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Target Retirement Corpus</span>
              <div className="mt-1 font-display text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
                {calc.targetCorpusFormatted}
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                To sustain monthly living expenses of {calc.monthlyExpAtRetirementFormatted} after age {retirementAge} (for {calc.yearsInRetirement} years).
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Required Monthly SIP / Contribution</span>
              <div className="mt-1 font-display text-2xl font-bold text-blue-600 dark:text-cyan-400">
                {calc.monthlySavingsNeededFormatted} <span className="text-xs font-normal text-zinc-500">/ month</span>
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">
                For the next {calc.yearsToRetire} years at {expectedReturn}% expected return.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-cyan-300 dark:hover:bg-zinc-700 transition"
                title="Download complete lifetime accumulation and withdrawal schedule"
              >
                <Download className="w-3.5 h-3.5" /> Export Plan (CSV)
              </button>
              <button
                type="button"
                onClick={handleShareCustomLink}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition"
                title="Copy shareable link with your exact retirement plan pre-filled"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied Pre-filled Link!
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" /> Share Pre-filled Link
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onCopy && onCopy(`Target Retirement Corpus: ${calc.targetCorpusFormatted} | Monthly Savings Required: ${calc.monthlySavingsNeededFormatted} (Age ${currentAge} to ${retirementAge})`)}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
            >
              Copy Retirement Plan
            </button>
          </div>
        </div>
      </div>

      {/* Lifetime Roadmap Accordion */}
      {calc && (
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowSchedule(!showSchedule)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition"
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Lifetime Net Worth Roadmap (Age {currentAge} to {lifeExpectancy})
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-cyan-400">
              <span>{showSchedule ? 'Hide Table' : 'Show Table'}</span>
              {showSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showSchedule && (
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs font-mono">
                <thead className="sticky top-0 bg-white dark:bg-zinc-900">
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-sans uppercase tracking-wider text-[10px]">
                    <th className="py-2 px-3">Age</th>
                    <th className="py-2 px-3">Lifecycle Phase</th>
                    <th className="py-2 px-3">Annual Cashflow</th>
                    <th className="py-2 px-3">Growth Earned</th>
                    <th className="py-2 px-3">Ending Nest Egg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                  {calc.roadmapSchedule.map((row) => (
                    <tr key={row.age} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="py-2 px-3 font-sans font-bold text-zinc-900 dark:text-zinc-100">Age {row.age}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold ${
                          row.phase === 'Accumulation'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-cyan-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}>
                          {row.phase}
                        </span>
                      </td>
                      <td className={`py-2 px-3 ${row.annualCashflow >= 0 ? 'text-zinc-700 dark:text-zinc-300' : 'text-red-500 dark:text-red-400'}`}>
                        {row.annualCashflow >= 0 ? `+${fmt(row.annualCashflow)}` : fmt(row.annualCashflow)}
                      </td>
                      <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">+{fmt(row.annualGrowth)}</td>
                      <td className="py-2 px-3 font-bold text-zinc-900 dark:text-zinc-100">{fmt(row.endingNetWorth)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400"
                >
                  <Download className="w-3.5 h-3.5" /> Download Full Lifetime CSV
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
