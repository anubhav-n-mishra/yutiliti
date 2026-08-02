import React, { useState, useMemo } from 'react';
import { Bike, DollarSign, Percent, ShieldCheck } from 'lucide-react';

interface BikeLoanEmiCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function BikeLoanEmiCalculator({ onCopy }: BikeLoanEmiCalculatorProps) {
  const [exShowroomPrice, setExShowroomPrice] = useState<number>(120000);
  const [downPayment, setDownPayment] = useState<number>(25000);
  const [interestRate, setInterestRate] = useState<number>(11.0);
  const [tenureYears, setTenureYears] = useState<number>(3);
  const [rtoInsurance, setRtoInsurance] = useState<number>(15000);

  const calc = useMemo(() => {
    const onRoadPrice = exShowroomPrice + rtoInsurance;
    const loanAmount = Math.max(0, onRoadPrice - downPayment);

    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (loanAmount <= 0 || interestRate <= 0 || tenureYears <= 0) return null;

    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanAmount;

    const ltvRatio = Math.round((loanAmount / onRoadPrice) * 100);

    const fmt = (val: number) =>
      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    return {
      onRoadPriceFormatted: fmt(onRoadPrice),
      loanAmountFormatted: fmt(loanAmount),
      emiFormatted: fmt(emi),
      totalInterestFormatted: fmt(totalInterest),
      totalPaymentFormatted: fmt(totalPayment),
      ltvRatio,
    };
  }, [exShowroomPrice, downPayment, interestRate, tenureYears, rtoInsurance]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <Bike className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Two-Wheeler Loan Details
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Ex-Showroom Price (₹)</label>
              <input
                type="number"
                value={exShowroomPrice}
                step="5000"
                onChange={(e) => setExShowroomPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">RTO + Insurance (₹)</label>
              <input
                type="number"
                value={rtoInsurance}
                step="1000"
                onChange={(e) => setRtoInsurance(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Down Payment (₹)</label>
            <input
              type="number"
              value={downPayment}
              step="5000"
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-cyan-950/20">
          {calc ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Monthly Bike EMI</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {calc.emiFormatted}
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  Loan: {calc.loanAmountFormatted} on On-Road Price of {calc.onRoadPriceFormatted} ({calc.ltvRatio}% LTV)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Total Interest</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{calc.totalInterestFormatted}</div>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Total Outlay</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{calc.totalPaymentFormatted}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`Bike Loan EMI: ${calc.emiFormatted} | Loan Amount: ${calc.loanAmountFormatted}`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Bike Loan Summary
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Enter valid bike loan inputs.</div>
          )}
        </div>
      </div>
    </div>
  );
}
