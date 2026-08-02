"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function HraCalculator() {
  const [currency, setCurrency] = useState("INR");
  const [basicSalaryAnnual, setBasicSalaryAnnual] = useState(600000);
  const [hraReceivedAnnual, setHraReceivedAnnual] = useState(240000);
  const [rentPaidAnnual, setRentPaidAnnual] = useState(210000);
  const [isMetroCity, setIsMetroCity] = useState(true);

  const stats = useMemo(() => {
    const basic = Math.max(0, basicSalaryAnnual);
    const hra = Math.max(0, hraReceivedAnnual);
    const rent = Math.max(0, rentPaidAnnual);

    // Rule 1: Actual HRA received
    const rule1 = hra;
    // Rule 2: 50% basic for metro, 40% for non-metro
    const rule2 = basic * (isMetroCity ? 0.5 : 0.4);
    // Rule 3: Rent paid minus 10% of basic
    const rule3 = Math.max(0, rent - basic * 0.1);

    const exemptHra = Math.min(rule1, rule2, rule3);
    const taxableHra = Math.max(0, hra - exemptHra);

    return {
      exemptHra,
      taxableHra,
      rule1,
      rule2,
      rule3,
    };
  }, [basicSalaryAnnual, hraReceivedAnnual, rentPaidAnnual, isMetroCity]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">HRA Exemption Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate tax-exempt House Rent Allowance under Section 10(13A).</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Annual Basic Salary + DA</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(basicSalaryAnnual, currency)}</span>
            </div>
            <input
              type="range"
              min="100000"
              max="3000000"
              step="25000"
              value={basicSalaryAnnual}
              onChange={(e) => setBasicSalaryAnnual(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Annual HRA Received</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(hraReceivedAnnual, currency)}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="1500000"
              step="10000"
              value={hraReceivedAnnual}
              onChange={(e) => setHraReceivedAnnual(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <label className="text-zinc-700 dark:text-zinc-300">Annual Rent Paid</label>
              <span className="text-blue-600 dark:text-cyan-300">{formatCurrency(rentPaidAnnual, currency)}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="1500000"
              step="10000"
              value={rentPaidAnnual}
              onChange={(e) => setRentPaidAnnual(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isMetroCity"
              checked={isMetroCity}
              onChange={(e) => setIsMetroCity(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isMetroCity" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Residing in Metro City (Delhi, Mumbai, Kolkata, Chennai - 50% limit)
            </label>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Tax Exempt HRA Amount</p>
            <p className="mt-2 text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(stats.exemptHra, currency)}
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Taxable HRA Share</span>
              <span className="font-semibold text-rose-600">{formatCurrency(stats.taxableHra, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Rent Paid Exceeding 10% Basic</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(stats.rule3, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
