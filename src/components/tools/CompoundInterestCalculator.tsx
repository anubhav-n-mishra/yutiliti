import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, RefreshCw, DollarSign, Download, Share2, ChevronDown, ChevronUp, FileSpreadsheet, Check } from 'lucide-react';
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
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Client-side URL query parameter hydration for stateful deep links
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const p = sp.get('p') || sp.get('principal');
      if (p && !isNaN(Number(p))) setInitialPrincipal(Number(p));
      const pmt = sp.get('pmt') || sp.get('monthly');
      if (pmt && !isNaN(Number(pmt))) setMonthlyContribution(Number(pmt));
      const r = sp.get('rate') || sp.get('roi');
      if (r && !isNaN(Number(r))) setAnnualRate(Number(r));
      const y = sp.get('years') || sp.get('term');
      if (y && !isNaN(Number(y))) setYears(Number(y));
      const f = sp.get('freq');
      if (f && !isNaN(Number(f))) setCompoundFreq(Number(f));
      const c = sp.get('curr') || sp.get('currency');
      if (c) setCurrency(c);
    } catch {
      // Ignore query parsing error
    }
  }, []);

  const currObj = getCurrency(currency);
  const fmt = (val: number) => formatCurr(val, currency);

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

    return {
      finalBalanceFormatted: fmt(finalBalance),
      totalInvestedFormatted: fmt(totalInvested),
      totalInterestFormatted: fmt(totalInterest),
      rawFinalBalance: finalBalance,
      rawTotalInvested: totalInvested,
      yearlyData,
    };
  }, [initialPrincipal, monthlyContribution, annualRate, years, compoundFreq, currency]);

  const handleExportCSV = () => {
    if (!calc) return;
    const headers = 'Year,Invested Capital,Compound Interest Accrued,Total Ending Portfolio Value\n';
    const rows = calc.yearlyData
      .map(
        (row) =>
          `${row.year},${row.invested.toFixed(2)},${row.interest.toFixed(2)},${row.balance.toFixed(2)}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Compound_Interest_Schedule_${initialPrincipal}_${years}yr_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleShareCustomLink = () => {
    const sp = new URLSearchParams({
      p: initialPrincipal.toString(),
      pmt: monthlyContribution.toString(),
      rate: annualRate.toString(),
      years: years.toString(),
      freq: compoundFreq.toString(),
      curr: currency,
    });
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.yuitility.app';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/tools/compound-interest-calculator';
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
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Investment Growth Inputs
          </h3>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Initial Principal ({currObj?.symbol || '$'})
            </label>
            <input
              type="number"
              value={initialPrincipal}
              step="1000"
              onChange={(e) => setInitialPrincipal(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Monthly Contribution ({currObj?.symbol || '$'})
            </label>
            <input
              type="number"
              value={monthlyContribution}
              step="100"
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
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
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Time Horizon (Years)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {calc ? (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Future Portfolio Value</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {calc.finalBalanceFormatted}
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Total Invested Capital: {calc.totalInvestedFormatted}</p>
              </div>

              <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80 space-y-2">
                <div className="flex justify-between text-xs text-zinc-700 dark:text-zinc-300">
                  <span>Compound Interest Accrued</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{calc.totalInterestFormatted}</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-700 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-600 dark:bg-cyan-500 h-full"
                    style={{ width: `${Math.min(100, (calc.rawTotalInvested / calc.rawFinalBalance) * 100)}%` }}
                    title="Invested Capital"
                  />
                  <div
                    className="bg-emerald-500 h-full flex-1"
                    title="Compound Interest Growth"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>Principal: {Math.round((calc.rawTotalInvested / calc.rawFinalBalance) * 100)}%</span>
                  <span>Returns: {Math.round(100 - (calc.rawTotalInvested / calc.rawFinalBalance) * 100)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-cyan-300 dark:hover:bg-zinc-700 transition"
                  title="Download complete annual compounding table"
                >
                  <Download className="w-3.5 h-3.5" /> Export Growth (CSV)
                </button>
                <button
                  type="button"
                  onClick={handleShareCustomLink}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition"
                  title="Copy shareable link with your exact investment parameters pre-filled"
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
                onClick={() => onCopy && onCopy(`Future Portfolio Value: ${calc.finalBalanceFormatted} | Compound Interest: ${calc.totalInterestFormatted} on ${calc.totalInvestedFormatted} invested over ${years} years`)}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Wealth Growth Summary
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Enter valid investment inputs.</div>
          )}
        </div>
      </div>

      {/* Annual Compounding Schedule Accordion */}
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
                Annual Compounding Schedule ({years} Years)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-cyan-400">
              <span>{showSchedule ? 'Hide Table' : 'Show Table'}</span>
              {showSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showSchedule && (
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-sans uppercase tracking-wider text-[10px]">
                    <th className="py-2 px-3">Year</th>
                    <th className="py-2 px-3">Invested Principal</th>
                    <th className="py-2 px-3">Accrued Interest</th>
                    <th className="py-2 px-3">Total Portfolio Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                  {calc.yearlyData.map((row) => (
                    <tr key={row.year} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="py-2 px-3 font-sans font-bold text-zinc-900 dark:text-zinc-100">Year {row.year}</td>
                      <td className="py-2 px-3 text-zinc-700 dark:text-zinc-300">{fmt(row.invested)}</td>
                      <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">+{fmt(row.interest)}</td>
                      <td className="py-2 px-3 font-bold text-blue-600 dark:text-cyan-400">{fmt(row.balance)}</td>
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
                  <Download className="w-3.5 h-3.5" /> Download Full Compounding CSV
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
