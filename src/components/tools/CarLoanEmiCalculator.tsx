import React, { useState, useMemo } from 'react';
import { Car, DollarSign, Percent } from 'lucide-react';
import CurrencySelector from '@/src/components/CurrencySelector';
import { formatCurrency as formatCurr, getCurrency } from '@/src/lib/currency';

interface CarLoanEmiCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
  initialCarPrice?: number;
  initialDownPayment?: number;
  initialTradeInValue?: number;
  initialInterestRate?: number;
  initialTenureYears?: number;
  initialCurrency?: string;
}

export default function CarLoanEmiCalculator({
  onCopy,
  onShare,
  initialCarPrice,
  initialDownPayment,
  initialTradeInValue,
  initialInterestRate,
  initialTenureYears,
  initialCurrency,
}: CarLoanEmiCalculatorProps) {
  const [currency, setCurrency] = useState<string>(initialCurrency || 'USD');
  const [carPrice, setCarPrice] = useState<number>(initialCarPrice ?? 35000);
  const [downPayment, setDownPayment] = useState<number>(initialDownPayment ?? 5000);
  const [tradeInValue, setTradeInValue] = useState<number>(initialTradeInValue ?? 0);
  const [interestRate, setInterestRate] = useState<number>(initialInterestRate ?? 6.8);
  const [tenureYears, setTenureYears] = useState<number>(initialTenureYears ?? 5);

  const currObj = getCurrency(currency);

  const calc = useMemo(() => {
    const netLoanAmount = Math.max(0, carPrice - downPayment - tradeInValue);

    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (netLoanAmount <= 0 || interestRate <= 0 || tenureYears <= 0) return null;

    const emi = (netLoanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - netLoanAmount;

    const fmt = (val: number) => formatCurr(val, currency);

    return {
      netLoanAmountFormatted: fmt(netLoanAmount),
      emiFormatted: fmt(emi),
      totalInterestFormatted: fmt(totalInterest),
      totalPaymentFormatted: fmt(totalPayment),
    };
  }, [carPrice, downPayment, tradeInValue, interestRate, tenureYears, currency]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <CurrencySelector value={currency} onChange={setCurrency} />

          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-zinc-900 dark:text-white">
            <Car className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
            Car Finance Parameters
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Car On-Road Price ({currObj.symbol})</label>
            <input
              type="number"
              value={carPrice}
              step="25000"
              onChange={(e) => setCarPrice(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Down Payment (₹)</label>
              <input
                type="number"
                value={downPayment}
                step="10000"
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Trade-In Value (₹)</label>
              <input
                type="number"
                value={tradeInValue}
                step="5000"
                onChange={(e) => setTradeInValue(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Interest Rate (% p.a.)</label>
              <input
                type="number"
                value={interestRate}
                step="0.25"
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
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Monthly Car EMI</span>
                <div className="mt-1 font-display text-4xl font-extrabold text-zinc-900 dark:text-white sm:text-5xl">
                  {calc.emiFormatted}
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Financed Loan Amount: {calc.netLoanAmountFormatted}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Total Interest Payable</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{calc.totalInterestFormatted}</div>
                </div>
                <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80">
                  <div className="text-zinc-500">Total Payment Amount</div>
                  <div className="font-bold text-zinc-900 dark:text-white">{calc.totalPaymentFormatted}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onCopy(`Car Loan Monthly EMI: ${calc.emiFormatted} | Loan Financed: ${calc.netLoanAmountFormatted}`)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                Copy Car Loan Summary
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">Enter valid car loan parameters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
