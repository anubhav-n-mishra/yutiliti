"use client";

import { useMemo, useState } from "react";
import CurrencySelector from "@/src/components/CurrencySelector";
import { formatCurrency } from "@/src/lib/currency";

export default function IrrCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [initialOutflow, setInitialOutflow] = useState(50000);
  const [year1Cash, setYear1Cash] = useState(12000);
  const [year2Cash, setYear2Cash] = useState(15000);
  const [year3Cash, setYear3Cash] = useState(18000);
  const [year4Cash, setYear4Cash] = useState(22000);

  const irr = useMemo(() => {
    const cf0 = -Math.abs(initialOutflow);
    const cfs = [cf0, year1Cash, year2Cash, year3Cash, year4Cash];

    // Newton-Raphson approximation for IRR
    let rate = 0.1; // initial guess 10%
    for (let iter = 0; iter < 100; iter++) {
      let npv = 0;
      let dNpv = 0;
      for (let t = 0; t < cfs.length; t++) {
        npv += cfs[t] / Math.pow(1 + rate, t);
        dNpv -= (t * cfs[t]) / Math.pow(1 + rate, t + 1);
      }
      if (Math.abs(npv) < 0.0001) break;
      if (Math.abs(dNpv) < 1e-10) break;
      const nextRate = rate - npv / dNpv;
      if (Math.abs(nextRate - rate) < 0.00001) {
        rate = nextRate;
        break;
      }
      rate = nextRate;
    }

    const irrPercent = rate * 100;
    return isFinite(irrPercent) && !isNaN(irrPercent) ? irrPercent : 0;
  }, [initialOutflow, year1Cash, year2Cash, year3Cash, year4Cash]);

  const totalInflows = year1Cash + year2Cash + year3Cash + year4Cash;
  const netCashflow = totalInflows - initialOutflow;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">IRR Calculator (Internal Rate of Return)</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculate annual internal rate of return for multi-year cash flow streams.</p>
        </div>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Initial Outflow (Year 0)</label>
            <input
              type="number"
              value={initialOutflow}
              onChange={(e) => setInitialOutflow(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Year 1 Cashflow</label>
              <input
                type="number"
                value={year1Cash}
                onChange={(e) => setYear1Cash(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Year 2 Cashflow</label>
              <input
                type="number"
                value={year2Cash}
                onChange={(e) => setYear2Cash(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Year 3 Cashflow</label>
              <input
                type="number"
                value={year3Cash}
                onChange={(e) => setYear3Cash(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Year 4 Cashflow</label>
              <input
                type="number"
                value={year4Cash}
                onChange={(e) => setYear4Cash(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-300">Internal Rate of Return (IRR)</p>
            <p className="mt-2 text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {irr.toFixed(2)}%
            </p>
          </div>

          <div className="mt-6 space-y-4 border-t border-blue-200/60 dark:border-zinc-800 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Total Inflows (Y1-Y4)</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(totalInflows, currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Net Cash Profit</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(netCashflow, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
