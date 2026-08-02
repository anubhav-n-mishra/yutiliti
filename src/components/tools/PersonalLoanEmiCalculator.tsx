import React, { useState, useMemo } from 'react';
import { User, Percent, DollarSign, ShieldAlert } from 'lucide-react';
import CurrencySelector from '@/src/components/CurrencySelector';
import { formatCurrency as formatCurr, getCurrency } from '@/src/lib/currency';

interface PersonalLoanEmiCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function PersonalLoanEmiCalculator({ onCopy }: PersonalLoanEmiCalculatorProps) {
  const [currency, setCurrency] = useState<string>('USD');
  const [loanAmount, setLoanAmount] = useState<number>(400000);
  const [interestRate, setInterestRate] = useState<number>(12.5);
  const [tenureYears, setTenureYears] = useState<number>(4);
  const [processingFeePercent, setProcessingFeePercent] = useState<number>(1.5);

  const currObj = getCurrency(currency);

  const calc = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (P <= 0 || interestRate <= 0 || tenureYears <= 0) return null;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalInterest = emi * n - P;
    const processingFee = (P * processingFeePercent) / 100;
    const totalCost = P + totalInterest + processingFee;

    const fmt = (val: number) => formatCurr(val, currency);

    return {
      emiFormatted: fmt(emi),
      totalInterestFormatted: fmt(totalInterest),
      processingFeeFormatted: fmt(processingFee),
      totalCostFormatted: fmt(totalCost),
    };
  }, [loanAmount, interestRate, tenureYears, processingFeePercent, currency]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <CurrencySelector value={currency} onChange={setCurrency} />

          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <User className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Personal Loan Details
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Loan Amount ({currObj.symbol})</label>
            <input
              type="number"
              value={loanAmount}
              step="25000"
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                step="0.5"
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Tenure (Years)</label>
              <input
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Fee (% Loan)</label>
              <input
                type="number"
                value={processingFeePercent}
                step="0.5"
                onChange={(e) => setProcessingFeePercent(Number(e.target.value))}
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
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Monthly EMI</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {calc.emiFormatted}
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Total Loan Cost: {calc.totalCostFormatted}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Total Interest</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{calc.totalInterestFormatted}</div>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Processing Fee</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{calc.processingFeeFormatted}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`Personal Loan EMI: ${calc.emiFormatted} | Total Interest: ${calc.totalInterestFormatted}`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Personal Loan Summary
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Enter valid loan parameters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
