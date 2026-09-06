import React, { useState, useMemo, useEffect } from 'react';
import { Download, RefreshCw, Share2, Info, ChevronDown, ChevronUp } from 'lucide-react';

import CurrencySelector from '@/src/components/CurrencySelector';
import { formatCurrency as formatCurr, getCurrency } from '@/src/lib/currency';

interface EmiCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

const BANK_BENCHMARKS = [
  { name: 'Bank of Baroda', rate: 8.40, category: 'PSU' },
  { name: 'SBI', rate: 8.50, category: 'PSU' },
  { name: 'HDFC Bank', rate: 8.70, category: 'Private' },
  { name: 'ICICI Bank', rate: 8.75, category: 'Private' },
  { name: 'Axis Bank', rate: 8.75, category: 'Private' },
  { name: 'US 30Y Fixed', rate: 6.85, category: 'Global' },
  { name: 'US 15Y Fixed', rate: 6.10, category: 'Global' },
];

export default function EmiCalculator({ onCopy, onShare }: EmiCalculatorProps) {
  const [currency, setCurrency] = useState<string>('USD');
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(5);
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [showAmortization, setShowAmortization] = useState<boolean>(true);
  const [isDark, setIsDark] = useState(false);

  // Prepayment Scenario State
  const [enablePrepayment, setEnablePrepayment] = useState<boolean>(false);
  const [monthlyPrepayment, setMonthlyPrepayment] = useState<number>(5000);
  const [annualPrepayment, setAnnualPrepayment] = useState<number>(50000);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Perform EMI calculation (standard + prepayment scenario)
  const calculations = useMemo(() => {
    const P = loanAmount;
    const r = (interestRate / 12) / 100;
    const n = tenureUnit === 'years' ? tenure * 12 : tenure;

    if (P <= 0 || interestRate <= 0 || n <= 0) {
      return {
        emi: 0,
        totalInterest: 0,
        totalPayment: 0,
        schedule: [],
        prepaidTotalInterest: 0,
        prepaidTotalPayment: 0,
        interestSaved: 0,
        monthsSaved: 0,
        prepaidSchedule: [],
      };
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    // Standard Year-by-Year Schedule
    const schedule = [];
    let remainingPrincipal = P;
    const totalYears = Math.ceil(n / 12);

    for (let year = 1; year <= totalYears; year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      const monthsInThisYear = Math.min(12, n - (year - 1) * 12);

      for (let m = 0; m < monthsInThisYear; m++) {
        const monthlyInterest = remainingPrincipal * r;
        const monthlyPrincipal = emi - monthlyInterest;
        yearlyInterest += monthlyInterest;
        yearlyPrincipal += monthlyPrincipal;
        remainingPrincipal -= monthlyPrincipal;
      }

      schedule.push({
        year,
        principalPaid: Math.max(0, yearlyPrincipal),
        interestPaid: Math.max(0, yearlyInterest),
        totalPaid: Math.max(0, yearlyPrincipal + yearlyInterest),
        balance: Math.max(0, remainingPrincipal)
      });
    }

    // Prepayment simulation month-by-month
    let prepayRemaining = P;
    let prepayTotalInterest = 0;
    let prepayTotalPaid = 0;
    let prepayMonths = 0;
    const prepaidSchedule: Array<{ year: number; principalPaid: number; interestPaid: number; totalPaid: number; balance: number }> = [];

    if (enablePrepayment && (monthlyPrepayment > 0 || annualPrepayment > 0)) {
      let currYearInterest = 0;
      let currYearPrincipal = 0;
      let currYearTotal = 0;

      while (prepayRemaining > 0.01 && prepayMonths < n) {
        prepayMonths++;
        const monthlyInt = prepayRemaining * r;
        let monthlyPrinc = emi - monthlyInt;
        let extra = monthlyPrepayment;
        if (prepayMonths % 12 === 0) {
          extra += annualPrepayment;
        }

        const effectivePayment = Math.min(prepayRemaining + monthlyInt, monthlyPrinc + extra + monthlyInt);
        const actualPrincipalPaid = effectivePayment - monthlyInt;

        prepayTotalInterest += monthlyInt;
        prepayTotalPaid += effectivePayment;
        prepayRemaining = Math.max(0, prepayRemaining - actualPrincipalPaid);

        currYearInterest += monthlyInt;
        currYearPrincipal += actualPrincipalPaid;
        currYearTotal += effectivePayment;

        if (prepayMonths % 12 === 0 || prepayRemaining <= 0.01) {
          prepaidSchedule.push({
            year: Math.ceil(prepayMonths / 12),
            principalPaid: currYearPrincipal,
            interestPaid: currYearInterest,
            totalPaid: currYearTotal,
            balance: prepayRemaining,
          });
          currYearInterest = 0;
          currYearPrincipal = 0;
          currYearTotal = 0;
        }
      }
    }

    const interestSaved = enablePrepayment ? Math.max(0, totalInterest - prepayTotalInterest) : 0;
    const monthsSaved = enablePrepayment ? Math.max(0, n - prepayMonths) : 0;

    return {
      emi: isNaN(emi) ? 0 : emi,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
      totalPayment: isNaN(totalPayment) ? 0 : totalPayment,
      schedule,
      prepaidTotalInterest: isNaN(prepayTotalInterest) ? 0 : prepayTotalInterest,
      prepaidTotalPayment: isNaN(prepayTotalPaid) ? 0 : prepayTotalPaid,
      interestSaved,
      monthsSaved,
      prepaidSchedule: prepaidSchedule.length > 0 ? prepaidSchedule : schedule,
    };
  }, [loanAmount, interestRate, tenure, tenureUnit, enablePrepayment, monthlyPrepayment, annualPrepayment]);

  const {
    emi,
    totalInterest,
    totalPayment,
    schedule,
    prepaidTotalInterest,
    interestSaved,
    monthsSaved,
    prepaidSchedule,
  } = calculations;

  const activeSchedule = enablePrepayment ? prepaidSchedule : schedule;
  const activeInterest = enablePrepayment ? prepaidTotalInterest : totalInterest;
  const activePayment = enablePrepayment ? calculations.prepaidTotalPayment : totalPayment;

  const formatCurrency = (val: number) => formatCurr(val, currency);

  const handleReset = () => {
    setLoanAmount(500000);
    setInterestRate(8.5);
    setTenure(5);
    setTenureUnit('years');
    setEnablePrepayment(false);
    setMonthlyPrepayment(5000);
    setAnnualPrepayment(50000);
  };

  const handleExportCSV = () => {
    const headers = 'Year,Principal Paid,Interest Paid,Total Paid,Ending Balance\n';
    const rows = activeSchedule
      .map(
        (s) =>
          `${s.year},${s.principalPaid.toFixed(2)},${s.interestPaid.toFixed(2)},${s.totalPaid.toFixed(2)},${s.balance.toFixed(2)}`
      )
      .join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EMI_Amortization_Schedule_${enablePrepayment ? 'Prepaid_' : ''}${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCopyResults = () => {
    const text = `EMI Calculation:\nMonthly EMI: ${formatCurrency(emi)}\nLoan Amount: ${formatCurrency(loanAmount)}\nInterest Rate: ${interestRate}%\nTenure: ${tenure} ${tenureUnit}\nTotal Interest: ${formatCurrency(activeInterest)}\nTotal Repayment: ${formatCurrency(activePayment)}${enablePrepayment ? `\nInterest Saved by Prepayment: ${formatCurrency(interestSaved)} (${Math.floor(monthsSaved / 12)} yrs ${monthsSaved % 12} mos saved)` : ''}`;
    onCopy(text);
  };

  // SVG Chart Dimensions
  const principalPercentage = activePayment > 0 ? (loanAmount / activePayment) * 100 : 50;
  const interestPercentage = activePayment > 0 ? (activeInterest / activePayment) * 100 : 50;

  return (
    <div className="space-y-8">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">EMI Calculator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Plan your home loans, car loans, and see your yearly repayment metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            title="Reset to default values"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleCopyResults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Copy
          </button>
          <button
            onClick={() => onShare("EMI Calculator", "emi-calculator")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Pane */}
        <div className="lg:col-span-7 space-y-6">
          <CurrencySelector value={currency} onChange={setCurrency} />

          {/* Loan Amount Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Loan Amount</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-bold">{getCurrency(currency).symbol}</span>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-32 text-right px-2 py-1 text-sm font-semibold rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
            <input
              type="range"
              min="10000"
              max="10000000"
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseInt(e.target.value))}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
              <span>{formatCurrency(10000)}</span>
              <span>{formatCurrency(10000000)}</span>
            </div>
          </div>

          {/* Interest Rate Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Interest Rate (% p.a.)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.05"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-24 text-right px-2 py-1 text-sm font-semibold rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
                />
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-zinc-100"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
              <span>1%</span>
              <span>20%</span>
            </div>

            {/* Benchmark Bank Rate Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1.5">
                Popular Bank Benchmarks (Click to apply):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {BANK_BENCHMARKS.map((b) => {
                  const isSelected = Math.abs(interestRate - b.rate) < 0.01;
                  return (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => setInterestRate(b.rate)}
                      className={`px-2 py-1 text-xs rounded-lg border transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300'
                          : 'border-zinc-200 bg-zinc-50/60 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400'
                      }`}
                    >
                      {b.name} <span className="font-mono font-medium opacity-80">({b.rate}%)</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tenure Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Loan Tenure</label>
              <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-900 p-0.5">
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-right px-2 py-0.5 text-sm font-semibold text-zinc-950 dark:text-zinc-50 outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => { setTenureUnit('years'); setTenure(Math.ceil(tenureUnit === 'months' ? tenure / 12 : tenure)); }}
                  className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${tenureUnit === 'years' ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-950' : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50'}`}
                >
                  Yr
                </button>
                <button
                  type="button"
                  onClick={() => { setTenureUnit('months'); setTenure(tenureUnit === 'years' ? tenure * 12 : tenure); }}
                  className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${tenureUnit === 'months' ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-950' : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50'}`}
                >
                  Mo
                </button>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max={tenureUnit === 'years' ? 30 : 360}
              step="1"
              value={tenure}
              onChange={(e) => setTenure(parseInt(e.target.value))}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-zinc-100"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
              <span>1 {tenureUnit === 'years' ? 'Year' : 'Month'}</span>
              <span>{tenureUnit === 'years' ? '30 Years' : '360 Months'}</span>
            </div>
          </div>

          {/* Prepayment & Foreclosure Modeling Module */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Prepayment / Foreclosure Modeling
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  See how paying extra cuts years off your loan and saves interest.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enablePrepayment}
                  onChange={(e) => setEnablePrepayment(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {enablePrepayment && (
              <div className="mt-4 pt-3 border-t border-blue-100 dark:border-blue-900/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Monthly Prepayment ({getCurrency(currency).symbol})
                  </label>
                  <input
                    type="number"
                    value={monthlyPrepayment}
                    min="0"
                    step="500"
                    onChange={(e) => setMonthlyPrepayment(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
                  />
                  <span className="text-[10px] text-zinc-400">Added to principal every month</span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Annual Lump Sum ({getCurrency(currency).symbol})
                  </label>
                  <input
                    type="number"
                    value={annualPrepayment}
                    min="0"
                    step="5000"
                    onChange={(e) => setAnnualPrepayment(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
                  />
                  <span className="text-[10px] text-zinc-400">Paid once every 12 months (e.g. bonus)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
          <div className="space-y-5">
            <div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider">Monthly Repayment</p>
              <p className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50 mt-1">{formatCurrency(emi)}</p>
            </div>

            <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">Principal Amount</p>
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mt-0.5">{formatCurrency(loanAmount)}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-800 dark:bg-zinc-100" />
                  <span className="text-xs font-mono text-zinc-500">{principalPercentage.toFixed(1)}%</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">Interest Payable</p>
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mt-0.5">{formatCurrency(activeInterest)}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-zinc-500">{interestPercentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800" />

            <div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Total Cost of Loan</p>
              <p className="text-lg font-semibold text-zinc-950 dark:text-zinc-50 mt-0.5">{formatCurrency(activePayment)}</p>
            </div>

            {enablePrepayment && interestSaved > 0 && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  🎉 Prepayment Impact
                </span>
                <div className="mt-1 text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  Saves {formatCurrency(interestSaved)} in interest!
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                  Closes loan {Math.floor(monthsSaved / 12)} years {monthsSaved % 12} months earlier.
                </div>
              </div>
            )}
          </div>

          {/* Clean Handcrafted Circular Doughnut Chart using SVG */}
          <div className="flex justify-center items-center mt-6">
            <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
              <circle
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                stroke="#e4e4e7"
                strokeWidth="4"
                className="dark:stroke-zinc-800"
              />
              {/* Principal Segment */}
              <circle
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                stroke={isDark ? '#f4f4f5' : '#27272a'}
                strokeWidth="4"
                strokeDasharray={`${principalPercentage} ${100 - principalPercentage}`}
                strokeDashoffset="0"
              />
              {/* Interest Segment */}
              <circle
                cx="21"
                cy="21"
                r="15.91549430918954"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray={`${interestPercentage} ${100 - interestPercentage}`}
                strokeDashoffset={-principalPercentage}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Amortization Schedule section */}
      <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
        <button
          onClick={() => setShowAmortization(!showAmortization)}
          className="w-full flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 outline-none"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Amortization Schedule {enablePrepayment ? '(Prepayment Mode)' : '(Yearly)'}
            </h2>
            <span className="text-[10px] text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full font-medium">
              {activeSchedule.length} Years
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); handleExportCSV(); }}
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors font-medium mr-2"
            >
              <Download className="w-3 h-3" />
              CSV
            </button>
            {showAmortization ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </div>
        </button>

        {showAmortization && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="p-3 pl-4">Year</th>
                  <th className="p-3 text-right">Principal Paid</th>
                  <th className="p-3 text-right">Interest Paid</th>
                  <th className="p-3 text-right">Total Payment</th>
                  <th className="p-3 text-right pr-4">Balance Amount</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-zinc-100 dark:divide-zinc-800 font-mono">
                {activeSchedule.map((s) => (
                  <tr key={s.year} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 text-zinc-700 dark:text-zinc-300">
                    <td className="p-3 pl-4 font-sans font-medium text-zinc-900 dark:text-zinc-200">Year {s.year}</td>
                    <td className="p-3 text-right">{formatCurrency(s.principalPaid)}</td>
                    <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">{formatCurrency(s.interestPaid)}</td>
                    <td className="p-3 text-right font-semibold">{formatCurrency(s.totalPaid)}</td>
                    <td className="p-3 text-right pr-4 text-zinc-500 dark:text-zinc-400">{formatCurrency(s.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FAQ & Explanations */}
      <div className="bg-zinc-50 dark:bg-zinc-900/30 rounded-xl p-5 border border-zinc-100 dark:border-zinc-900 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-zinc-400" />
          How does the EMI Calculation work?
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          An EMI is calculated based on the reducing balance method. The formula applied is:
          <br />
          <code className="block bg-zinc-100 dark:bg-zinc-900 p-2 rounded my-1 text-center font-mono text-[10px]">
            EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
          </code>
          Where:
          <br />
          • <strong className="text-zinc-700 dark:text-zinc-300">P:</strong> Principal Loan Amount.
          <br />
          • <strong className="text-zinc-700 dark:text-zinc-300">R:</strong> Monthly Interest Rate (Annual Rate / 12 / 100).
          <br />
          • <strong className="text-zinc-700 dark:text-zinc-300">N:</strong> Number of Monthly Installments.
          <br />
          This calculator assumes the interest rate remains constant throughout the tenure. Check your amortization schedule to see how more of your payments go toward principal as the loan matures.
        </p>
      </div>
    </div>
  );
}
