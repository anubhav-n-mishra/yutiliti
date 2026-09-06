import React, { useState, useMemo } from 'react';
import { Building, DollarSign, Percent, ShieldCheck } from 'lucide-react';
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

  const currObj = getCurrency(currency);

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

    const fmt = (val: number) => formatCurr(val, currency);

    return {
      loanAmountFormatted: fmt(loanAmount),
      downPaymentFormatted: fmt(downPayment),
      piMonthlyFormatted: fmt(piMonthly),
      taxMonthlyFormatted: fmt(taxMonthly),
      insuranceMonthlyFormatted: fmt(insuranceMonthly),
      pmiMonthlyFormatted: fmt(pmiMonthly),
      hoaMonthlyFormatted: fmt(hoaFeesMonthly),
      totalMonthlyPaymentFormatted: fmt(totalMonthlyPayment),
    };
  }, [homePrice, downPaymentPercent, interestRate, loanTermYears, propertyTaxAnnual, homeInsuranceAnnual, hoaFeesMonthly, currency]);

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
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Home Price ($)</label>
              <input
                type="number"
                value={homePrice}
                step="10000"
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
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
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
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
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Loan Term (Years)</label>
              <input
                type="number"
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">Annual Tax ($)</label>
              <input
                type="number"
                value={propertyTaxAnnual}
                onChange={(e) => setPropertyTaxAnnual(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">Home Ins. ($)</label>
              <input
                type="number"
                value={homeInsuranceAnnual}
                onChange={(e) => setHomeInsuranceAnnual(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-zinc-700 dark:text-zinc-300">HOA / Mo ($)</label>
              <input
                type="number"
                value={hoaFeesMonthly}
                onChange={(e) => setHoaFeesMonthly(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {calc ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Total Monthly Payment</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {calc.totalMonthlyPaymentFormatted}
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Loan: {calc.loanAmountFormatted} | Down: {calc.downPaymentFormatted}</p>
              </div>

              <div className="space-y-1.5 rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm text-xs dark:border-zinc-800 dark:bg-zinc-800/80">
                <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
                  <span>Principal & Interest</span>
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
              </div>

              <button
                type="button"
                onClick={() => onCopy(`Mortgage Monthly Payment: ${calc.totalMonthlyPaymentFormatted} (P&I: ${calc.piMonthlyFormatted})`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Mortgage Breakdown
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Enter valid mortgage details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
