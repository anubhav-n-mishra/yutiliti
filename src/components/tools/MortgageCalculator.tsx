import React, { useState, useMemo, useEffect } from 'react';
import { Building, DollarSign, Percent, ShieldCheck, Download, Share2, ChevronDown, ChevronUp, FileSpreadsheet, Check } from 'lucide-react';
import CurrencySelector from '@/src/components/CurrencySelector';
import { formatCurrency as formatCurr, getCurrency } from '@/src/lib/currency';

interface MortgageCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
  initialHomePrice?: number;
  initialDownPaymentPercent?: number;
  initialInterestRate?: number;
  initialLoanTermYears?: number;
  initialPropertyTaxAnnual?: number;
  initialHomeInsuranceAnnual?: number;
  initialHoaFeesMonthly?: number;
  initialCurrency?: string;
}

export default function MortgageCalculator({
  onCopy,
  onShare,
  initialHomePrice,
  initialDownPaymentPercent,
  initialInterestRate,
  initialLoanTermYears,
  initialPropertyTaxAnnual,
  initialHomeInsuranceAnnual,
  initialHoaFeesMonthly,
  initialCurrency,
}: MortgageCalculatorProps) {
  const [currency, setCurrency] = useState<string>(initialCurrency || 'USD');
  const [homePrice, setHomePrice] = useState<number>(initialHomePrice ?? 400000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(initialDownPaymentPercent ?? 20);
  const [interestRate, setInterestRate] = useState<number>(initialInterestRate ?? 6.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(initialLoanTermYears ?? 30);
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(initialPropertyTaxAnnual ?? 4800);
  const [homeInsuranceAnnual, setHomeInsuranceAnnual] = useState<number>(initialHomeInsuranceAnnual ?? 1400);
  const [hoaFeesMonthly, setHoaFeesMonthly] = useState<number>(initialHoaFeesMonthly ?? 150);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Client-side URL query parameter hydration for stateful deep links
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const sp = new URLSearchParams(window.location.search);
      const p = sp.get('price');
      if (p && !isNaN(Number(p))) setHomePrice(Number(p));
      const d = sp.get('down');
      if (d && !isNaN(Number(d))) setDownPaymentPercent(Number(d));
      const r = sp.get('rate');
      if (r && !isNaN(Number(r))) setInterestRate(Number(r));
      const y = sp.get('term') || sp.get('years');
      if (y && !isNaN(Number(y))) setLoanTermYears(Number(y));
      const tax = sp.get('tax');
      if (tax && !isNaN(Number(tax))) setPropertyTaxAnnual(Number(tax));
      const ins = sp.get('ins');
      if (ins && !isNaN(Number(ins))) setHomeInsuranceAnnual(Number(ins));
      const hoa = sp.get('hoa');
      if (hoa && !isNaN(Number(hoa))) setHoaFeesMonthly(Number(hoa));
      const c = sp.get('curr') || sp.get('currency');
      if (c) setCurrency(c);
    } catch {
      // Ignore query parsing error on older engines
    }
  }, []);

  const currObj = getCurrency(currency);
  const fmt = (val: number) => formatCurr(val, currency);

  const calc = useMemo(() => {
    const downPayment = (homePrice * downPaymentPercent) / 100;
    const loanAmount = Math.max(0, homePrice - downPayment);

    const r = interestRate / 12 / 100;
    const n = loanTermYears * 12;

    if (loanAmount <= 0 || interestRate <= 0 || loanTermYears <= 0) return null;

    const piMonthly = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const taxMonthly = propertyTaxAnnual / 12;
    const insuranceMonthly = homeInsuranceAnnual / 12;
    const pmiMonthly = downPaymentPercent < 20 ? (loanAmount * 0.0075) / 12 : 0;
    const totalMonthlyPayment = piMonthly + taxMonthly + insuranceMonthly + pmiMonthly + hoaFeesMonthly;
    const totalInterestPaid = piMonthly * n - loanAmount;
    const totalLoanCost = piMonthly * n;

    // Build Amortization Schedule (Year-by-Year & Month-by-Month summary)
    let balance = loanAmount;
    const yearlySchedule: Array<{
      year: number;
      principalPaid: number;
      interestPaid: number;
      totalPaid: number;
      endingBalance: number;
    }> = [];

    const monthlySchedule: Array<{
      month: number;
      year: number;
      beginningBalance: number;
      principal: number;
      interest: number;
      total: number;
      endingBalance: number;
    }> = [];

    for (let yr = 1; yr <= loanTermYears; yr++) {
      let yearlyPrinc = 0;
      let yearlyInt = 0;

      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break;
        const currentMonthIdx = (yr - 1) * 12 + m;
        const beginningBalance = balance;
        const monthlyInterest = balance * r;
        const monthlyPrincipal = Math.min(balance, piMonthly - monthlyInterest);
        balance = Math.max(0, balance - monthlyPrincipal);

        yearlyInt += monthlyInterest;
        yearlyPrinc += monthlyPrincipal;

        monthlySchedule.push({
          month: currentMonthIdx,
          year: yr,
          beginningBalance,
          principal: monthlyPrincipal,
          interest: monthlyInterest,
          total: monthlyPrincipal + monthlyInterest,
          endingBalance: balance,
        });
      }

      yearlySchedule.push({
        year: yr,
        principalPaid: yearlyPrinc,
        interestPaid: yearlyInt,
        totalPaid: yearlyPrinc + yearlyInt,
        endingBalance: balance,
      });
    }

    return {
      loanAmount,
      loanAmountFormatted: fmt(loanAmount),
      downPaymentFormatted: fmt(downPayment),
      piMonthlyFormatted: fmt(piMonthly),
      taxMonthlyFormatted: fmt(taxMonthly),
      insuranceMonthlyFormatted: fmt(insuranceMonthly),
      pmiMonthlyFormatted: fmt(pmiMonthly),
      hoaMonthlyFormatted: fmt(hoaFeesMonthly),
      totalMonthlyPaymentFormatted: fmt(totalMonthlyPayment),
      totalInterestPaidFormatted: fmt(totalInterestPaid),
      totalLoanCostFormatted: fmt(totalLoanCost),
      yearlySchedule,
      monthlySchedule,
    };
  }, [homePrice, downPaymentPercent, interestRate, loanTermYears, propertyTaxAnnual, homeInsuranceAnnual, hoaFeesMonthly, currency]);

  const handleExportCSV = () => {
    if (!calc) return;
    const headers = 'Month,Year,Beginning Balance,Principal Paid,Interest Paid,Total Monthly P&I,Ending Balance\n';
    const rows = calc.monthlySchedule
      .map(
        (m) =>
          `${m.month},${m.year},${m.beginningBalance.toFixed(2)},${m.principal.toFixed(2)},${m.interest.toFixed(2)},${m.total.toFixed(2)},${m.endingBalance.toFixed(2)}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mortgage_Amortization_Schedule_${homePrice}_${loanTermYears}yr_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleShareCustomLink = () => {
    const sp = new URLSearchParams({
      price: homePrice.toString(),
      down: downPaymentPercent.toString(),
      rate: interestRate.toString(),
      term: loanTermYears.toString(),
      tax: propertyTaxAnnual.toString(),
      ins: homeInsuranceAnnual.toString(),
      hoa: hoaFeesMonthly.toString(),
      curr: currency,
    });
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.yuitility.app';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/tools/mortgage-calculator';
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
            <Building className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Mortgage Parameters
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Home Price ({currObj?.symbol || '$'})</label>
              <input
                type="number"
                value={homePrice}
                step="10000"
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Down Payment (%)</label>
              <input
                type="number"
                value={downPaymentPercent}
                min="0"
                max="80"
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                step="0.125"
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Loan Term (Years)</label>
              <input
                type="number"
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">Annual Tax ({currObj?.symbol || '$'})</label>
              <input
                type="number"
                value={propertyTaxAnnual}
                onChange={(e) => setPropertyTaxAnnual(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">Home Ins. ({currObj?.symbol || '$'})</label>
              <input
                type="number"
                value={homeInsuranceAnnual}
                onChange={(e) => setHomeInsuranceAnnual(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">HOA / Mo ({currObj?.symbol || '$'})</label>
              <input
                type="number"
                value={hoaFeesMonthly}
                onChange={(e) => setHoaFeesMonthly(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {calc ? (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Total Monthly Payment</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {calc.totalMonthlyPaymentFormatted}
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Loan: {calc.loanAmountFormatted} | Down: {calc.downPaymentFormatted}</p>
              </div>

              <div className="space-y-1.5 rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm text-xs dark:border-zinc-800 dark:bg-zinc-800/80">
                <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
                  <span>Principal & Interest (P&I)</span>
                  <span className="font-bold">{calc.piMonthlyFormatted}</span>
                </div>
                <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
                  <span>Property Tax</span>
                  <span>{calc.taxMonthlyFormatted}</span>
                </div>
                <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
                  <span>Home Insurance</span>
                  <span>{calc.insuranceMonthlyFormatted}</span>
                </div>
                {downPaymentPercent < 20 && (
                  <div className="flex justify-between text-amber-600 dark:text-amber-400 font-medium">
                    <span>PMI (&lt;20% Down)</span>
                    <span>{calc.pmiMonthlyFormatted}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
                  <span>HOA Fees</span>
                  <span>{calc.hoaMonthlyFormatted}</span>
                </div>
                <div className="pt-1.5 border-t border-zinc-200/60 dark:border-zinc-700/60 flex justify-between text-zinc-500 dark:text-zinc-400">
                  <span>Total Interest Over {loanTermYears} Yrs</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{calc.totalInterestPaidFormatted}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-cyan-300 dark:hover:bg-zinc-700 transition"
                  title="Download complete month-by-month amortization schedule"
                >
                  <Download className="w-3.5 h-3.5" /> Export Schedule (CSV)
                </button>
                <button
                  type="button"
                  onClick={handleShareCustomLink}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition"
                  title="Copy shareable link with your exact loan parameters pre-filled"
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
                onClick={() => onCopy && onCopy(`Mortgage Monthly Payment: ${calc.totalMonthlyPaymentFormatted} (P&I: ${calc.piMonthlyFormatted}, Total Interest: ${calc.totalInterestPaidFormatted})`)}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Mortgage Breakdown
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Enter valid mortgage details.</div>
          )}
        </div>
      </div>

      {/* Amortization Schedule Accordion */}
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
                Annual Amortization Breakdown ({loanTermYears} Years)
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
                    <th className="py-2 px-3">Principal Paid</th>
                    <th className="py-2 px-3">Interest Paid</th>
                    <th className="py-2 px-3">Total Annual P&I</th>
                    <th className="py-2 px-3">Ending Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                  {calc.yearlySchedule.map((row) => (
                    <tr key={row.year} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="py-2 px-3 font-sans font-bold text-zinc-900 dark:text-zinc-100">Year {row.year}</td>
                      <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">{fmt(row.principalPaid)}</td>
                      <td className="py-2 px-3 text-amber-600 dark:text-amber-400">{fmt(row.interestPaid)}</td>
                      <td className="py-2 px-3 font-semibold text-zinc-800 dark:text-zinc-200">{fmt(row.totalPaid)}</td>
                      <td className="py-2 px-3 text-zinc-600 dark:text-zinc-400">{fmt(row.endingBalance)}</td>
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
                  <Download className="w-3.5 h-3.5" /> Download Full Month-by-Month CSV
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
