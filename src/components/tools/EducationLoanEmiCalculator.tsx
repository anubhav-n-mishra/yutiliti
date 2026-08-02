import React, { useState, useMemo } from 'react';
import { GraduationCap, BookOpen, Percent, ShieldCheck } from 'lucide-react';
import CurrencySelector from '@/src/components/CurrencySelector';
import { formatCurrency as formatCurr, getCurrency } from '@/src/lib/currency';

interface EducationLoanEmiCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function EducationLoanEmiCalculator({ onCopy }: EducationLoanEmiCalculatorProps) {
  const [currency, setCurrency] = useState<string>('USD');
  const [loanAmount, setLoanAmount] = useState<number>(1000000); // 10 Lakhs
  const [interestRate, setInterestRate] = useState<number>(9.5);
  const [courseDurationYears, setCourseDurationYears] = useState<number>(4);
  const [moratoriumGraceMonths, setMoratoriumGraceMonths] = useState<number>(12);
  const [repaymentTenureYears, setRepaymentTenureYears] = useState<number>(7);
  const [payInterestDuringStudy, setPayInterestDuringStudy] = useState<boolean>(false);

  const currObj = getCurrency(currency);

  const calc = useMemo(() => {
    const P = loanAmount;
    const studyMonths = courseDurationYears * 12 + moratoriumGraceMonths;
    const studyYears = studyMonths / 12;

    const moratoriumInterest = P * (interestRate / 100) * studyYears;

    const effectivePrincipal = payInterestDuringStudy ? P : P + moratoriumInterest;

    const r = interestRate / 12 / 100;
    const n = repaymentTenureYears * 12;

    const emi = (effectivePrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalRepayment = emi * n + (payInterestDuringStudy ? moratoriumInterest : 0);
    const totalInterest = totalRepayment - P;

    const annualAvgInterest = totalInterest / (repaymentTenureYears + (payInterestDuringStudy ? studyYears : 0));
    const estimatedTaxSavedAnnual = annualAvgInterest * 0.30;

    const fmt = (val: number) => formatCurr(val, currency);

    return {
      emiFormatted: fmt(emi),
      moratoriumInterestFormatted: fmt(moratoriumInterest),
      effectivePrincipalFormatted: fmt(effectivePrincipal),
      totalInterestFormatted: fmt(totalInterest),
      totalRepaymentFormatted: fmt(totalRepayment),
      estimatedTaxSavedAnnualFormatted: fmt(estimatedTaxSavedAnnual),
    };
  }, [loanAmount, interestRate, courseDurationYears, moratoriumGraceMonths, repaymentTenureYears, payInterestDuringStudy, currency]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <CurrencySelector value={currency} onChange={setCurrency} />

          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <GraduationCap className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Education Loan Details
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Loan Amount (₹)</label>
            <input
              type="number"
              value={loanAmount}
              step="50000"
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                step="0.25"
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Repayment (Years)</label>
              <input
                type="number"
                value={repaymentTenureYears}
                onChange={(e) => setRepaymentTenureYears(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Course Duration (Years)</label>
              <input
                type="number"
                value={courseDurationYears}
                onChange={(e) => setCourseDurationYears(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Grace Period (Months)</label>
              <input
                type="number"
                value={moratoriumGraceMonths}
                onChange={(e) => setMoratoriumGraceMonths(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="payInterest"
              checked={payInterestDuringStudy}
              onChange={(e) => setPayInterestDuringStudy(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="payInterest" className="text-xs text-zinc-700 dark:text-zinc-300">
              Pay simple interest during course & grace period
            </label>
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Post-Study Monthly EMI</span>
              <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                {calc.emiFormatted}
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Principal at repayment: {calc.effectivePrincipalFormatted} (Moratorium interest: {calc.moratoriumInterestFormatted})
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200/80 bg-white p-3.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Sec 80E Tax Savings (Est. 30% Slab)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">~{calc.estimatedTaxSavedAnnualFormatted} / year</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onCopy(`Education Loan EMI: ${calc.emiFormatted} | Total Repayment: ${calc.totalRepaymentFormatted}`)}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
            >
              Copy Education Loan Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
