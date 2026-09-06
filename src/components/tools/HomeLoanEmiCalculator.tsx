import React, { useState, useMemo } from 'react';
import { Home, RefreshCw, Share2, Download, ChevronDown, ChevronUp, Info, ShieldCheck, Sparkles } from 'lucide-react';
import CurrencySelector from '@/src/components/CurrencySelector';
import { formatCurrency as formatCurr, getCurrency } from '@/src/lib/currency';

interface HomeLoanEmiCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

const BANK_BENCHMARKS = [
  { name: 'SBI Home Loan', rate: 8.50 },
  { name: 'HDFC Bank', rate: 8.70 },
  { name: 'ICICI Bank', rate: 8.75 },
  { name: 'Axis Bank', rate: 8.75 },
  { name: 'Bank of Baroda', rate: 8.40 },
  { name: 'LIC HFL', rate: 8.50 },
  { name: 'US 30Y Fixed', rate: 6.85 },
];

export default function HomeLoanEmiCalculator({ onCopy, onShare }: HomeLoanEmiCalculatorProps) {
  const [currency, setCurrency] = useState<string>('USD');
  const [propertyPrice, setPropertyPrice] = useState<number>(5000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [taxSlab, setTaxSlab] = useState<number>(30); // 30% tax bracket
  const [showAmortization, setShowAmortization] = useState<boolean>(true);

  // Prepayment Scenarios
  const [enablePrepayment, setEnablePrepayment] = useState<boolean>(false);
  const [monthlyPrepayment, setMonthlyPrepayment] = useState<number>(10000);
  const [annualPrepayment, setAnnualPrepayment] = useState<number>(100000);

  const currObj = getCurrency(currency);
  const fmt = (val: number) => formatCurr(val, currency);

  const calculations = useMemo(() => {
    const downPayment = (propertyPrice * downPaymentPercent) / 100;
    const loanAmount = Math.max(0, propertyPrice - downPayment);
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;

    if (loanAmount <= 0 || interestRate <= 0 || tenureYears <= 0) {
      return {
        downPayment: 0,
        loanAmount: 0,
        emi: 0,
        totalInterest: 0,
        totalPayment: 0,
        annualTaxSaving: 0,
        schedule: [],
        prepaidTotalInterest: 0,
        prepaidTotalPayment: 0,
        interestSaved: 0,
        monthsSaved: 0,
        prepaidSchedule: [],
      };
    }

    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanAmount;

    // Generate Standard Amortization Schedule
    const schedule = [];
    let remainingPrincipal = loanAmount;

    for (let yr = 1; yr <= tenureYears; yr++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;

      for (let m = 0; m < 12; m++) {
        const monthlyInt = remainingPrincipal * r;
        const monthlyPrinc = emi - monthlyInt;
        yearlyInterest += monthlyInt;
        yearlyPrincipal += monthlyPrinc;
        remainingPrincipal -= monthlyPrinc;
      }

      const sec24Deduction = Math.min(200000, yearlyInterest);
      const sec80cDeduction = Math.min(150000, yearlyPrincipal);
      const yearlyTaxSaving = (sec24Deduction + sec80cDeduction) * (taxSlab / 100);

      schedule.push({
        year: yr,
        principalPaid: Math.max(0, yearlyPrincipal),
        interestPaid: Math.max(0, yearlyInterest),
        totalPaid: Math.max(0, yearlyPrincipal + yearlyInterest),
        taxSaving: yearlyTaxSaving,
        balance: Math.max(0, remainingPrincipal),
      });
    }

    // Prepayment simulation
    let prepayRemaining = loanAmount;
    let prepayTotalInterest = 0;
    let prepayTotalPaid = 0;
    let prepayMonths = 0;
    const prepaidSchedule: Array<{
      year: number;
      principalPaid: number;
      interestPaid: number;
      totalPaid: number;
      taxSaving: number;
      balance: number;
    }> = [];

    if (enablePrepayment && (monthlyPrepayment > 0 || annualPrepayment > 0)) {
      let currYearInterest = 0;
      let currYearPrincipal = 0;
      let currYearTotal = 0;

      while (prepayRemaining > 0.01 && prepayMonths < n) {
        prepayMonths++;
        const monthlyInt = prepayRemaining * r;
        const monthlyPrinc = emi - monthlyInt;
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
          const sec24Deduction = Math.min(200000, currYearInterest);
          const sec80cDeduction = Math.min(150000, currYearPrincipal);
          const yearlyTaxSaving = (sec24Deduction + sec80cDeduction) * (taxSlab / 100);

          prepaidSchedule.push({
            year: Math.ceil(prepayMonths / 12),
            principalPaid: currYearPrincipal,
            interestPaid: currYearInterest,
            totalPaid: currYearTotal,
            taxSaving: yearlyTaxSaving,
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

    const avgYearlyInterest = Math.min(200000, totalInterest / tenureYears);
    const avgYearlyPrincipal = Math.min(150000, loanAmount / tenureYears);
    const annualTaxSaving = (avgYearlyInterest + avgYearlyPrincipal) * (taxSlab / 100);

    return {
      downPayment,
      loanAmount,
      emi,
      totalInterest,
      totalPayment,
      annualTaxSaving,
      schedule,
      prepaidTotalInterest,
      prepaidTotalPayment: prepayTotalPaid,
      interestSaved,
      monthsSaved,
      prepaidSchedule: prepaidSchedule.length > 0 ? prepaidSchedule : schedule,
    };
  }, [propertyPrice, downPaymentPercent, interestRate, tenureYears, taxSlab, enablePrepayment, monthlyPrepayment, annualPrepayment]);

  const {
    downPayment,
    loanAmount,
    emi,
    totalInterest,
    totalPayment,
    annualTaxSaving,
    schedule,
    prepaidTotalInterest,
    prepaidTotalPayment,
    interestSaved,
    monthsSaved,
    prepaidSchedule,
  } = calculations;

  const activeSchedule = enablePrepayment ? prepaidSchedule : schedule;
  const activeInterest = enablePrepayment ? prepaidTotalInterest : totalInterest;
  const activePayment = enablePrepayment ? prepaidTotalPayment : totalPayment;

  const handleReset = () => {
    setPropertyPrice(5000000);
    setDownPaymentPercent(20);
    setInterestRate(8.5);
    setTenureYears(20);
    setTaxSlab(30);
    setEnablePrepayment(false);
    setMonthlyPrepayment(10000);
    setAnnualPrepayment(100000);
  };

  const handleExportCSV = () => {
    const headers = 'Year,Principal Paid,Interest Paid,Total Payment,Est Tax Benefit,Ending Balance\n';
    const rows = activeSchedule
      .map(
        (s) =>
          `${s.year},${s.principalPaid.toFixed(2)},${s.interestPaid.toFixed(2)},${s.totalPaid.toFixed(2)},${s.taxSaving.toFixed(2)},${s.balance.toFixed(2)}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Home_Loan_Amortization_${enablePrepayment ? 'Prepaid_' : ''}${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const text = `Home Loan EMI Summary:\nProperty Value: ${fmt(propertyPrice)}\nDown Payment (${downPaymentPercent}%): ${fmt(downPayment)}\nLoan Amount: ${fmt(loanAmount)}\nInterest Rate: ${interestRate}%\nTenure: ${tenureYears} Years\nMonthly EMI: ${fmt(emi)}\nTotal Interest: ${fmt(activeInterest)}\nTotal Cost: ${fmt(activePayment)}${enablePrepayment ? `\nPrepayment Interest Saved: ${fmt(interestSaved)} (${Math.floor(monthsSaved / 12)} yrs ${monthsSaved % 12} mos)` : ''}`;
    onCopy(text);
  };

  const principalRatio = activePayment > 0 ? (loanAmount / activePayment) * 100 : 50;
  const interestRatio = activePayment > 0 ? (activeInterest / activePayment) * 100 : 50;

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
            Home Loan EMI Calculator
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Calculate your monthly home loan installment, compare bank interest benchmarks, and model prepayment savings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Copy
          </button>
          <button
            onClick={() => onShare('Home Loan EMI Calculator', 'home-loan-emi-calculator')}
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

          {/* Property Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Property Cost</label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-400 font-bold">{currObj.symbol}</span>
                <input
                  type="number"
                  value={propertyPrice}
                  step="50000"
                  onChange={(e) => setPropertyPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-36 text-right px-2 py-1 text-sm font-semibold rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
            <input
              type="range"
              min="500000"
              max="50000000"
              step="100000"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(parseInt(e.target.value))}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Down Payment Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Down Payment</label>
                <span className="text-xs text-blue-600 dark:text-cyan-400 font-mono font-semibold">({downPaymentPercent}%)</span>
              </div>
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                {fmt(downPayment)}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              step="1"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
              <span>Loan Amount: {fmt(loanAmount)}</span>
              <span>80% Max</span>
            </div>
          </div>

          {/* Interest Rate & Benchmarks */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.05"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                className="w-24 text-right px-2 py-1 text-sm font-semibold rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <input
              type="range"
              min="1"
              max="18"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-zinc-100"
            />
            
            {/* Bank Rates Benchmarks */}
            <div className="pt-2">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1.5">
                Current Bank Benchmarks (Click to apply):
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

          {/* Tenure Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Loan Tenure</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={tenureYears}
                  min="1"
                  max="35"
                  onChange={(e) => setTenureYears(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-right px-2 py-0.5 text-sm font-semibold text-zinc-950 dark:text-zinc-50 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
                />
                <span className="text-xs text-zinc-500">Years</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(parseInt(e.target.value))}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-zinc-100"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
              <span>1 Year</span>
              <span>30 Years (360 Months)</span>
            </div>
          </div>

          {/* Prepayment & Foreclosure Modeling */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Prepayment / Foreclosure Modeling
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Simulate partial prepayments to cut years and save thousands in interest.
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
                    Monthly Prepayment ({currObj.symbol})
                  </label>
                  <input
                    type="number"
                    value={monthlyPrepayment}
                    min="0"
                    step="1000"
                    onChange={(e) => setMonthlyPrepayment(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
                  />
                  <span className="text-[10px] text-zinc-400">Added to principal every month</span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Annual Lump Sum ({currObj.symbol})
                  </label>
                  <input
                    type="number"
                    value={annualPrepayment}
                    min="0"
                    step="10000"
                    onChange={(e) => setAnnualPrepayment(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
                  />
                  <span className="text-[10px] text-zinc-400">Paid once a year (e.g. bonus)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
          <div className="space-y-5">
            <div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider">
                Monthly Home Loan Installment
              </p>
              <p className="text-4xl font-display font-extrabold text-zinc-900 dark:text-zinc-50 mt-1">
                {fmt(emi)}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Loan: {fmt(loanAmount)} • Down Payment: {fmt(downPayment)}
              </p>
            </div>

            <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800" />

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-800/80">
                <span className="text-zinc-400 text-[11px] block">Total Interest</span>
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-mono">{fmt(activeInterest)}</span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">{interestRatio.toFixed(1)}% of total</span>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-800/80">
                <span className="text-zinc-400 text-[11px] block">Total Repayment</span>
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-mono">{fmt(activePayment)}</span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">{principalRatio.toFixed(1)}% principal</span>
              </div>
            </div>

            {/* Income Tax Savings (Sec 24 + 80C) */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/25">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Tax Deductions (Sec 24b & 80C)
                </span>
                <select
                  value={taxSlab}
                  onChange={(e) => setTaxSlab(parseInt(e.target.value))}
                  className="text-xs font-medium bg-white dark:bg-zinc-800 border border-emerald-300 dark:border-emerald-700 rounded px-1.5 py-0.5 text-emerald-900 dark:text-emerald-200 outline-none"
                >
                  <option value={30}>30% Slab</option>
                  <option value={20}>20% Slab</option>
                  <option value={10}>10% Slab</option>
                </select>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-display font-bold text-emerald-950 dark:text-emerald-100">
                  ~{fmt(annualTaxSaving)}
                </span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400">/ year estimated</span>
              </div>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-1 leading-tight">
                Includes up to ₹2 Lakh interest deduction (Sec 24b) and ₹1.5 Lakh principal (Sec 80C).
              </p>
            </div>

            {/* Prepayment Impact Callout */}
            {enablePrepayment && interestSaved > 0 && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/90 p-4 dark:border-blue-900/60 dark:bg-blue-950/40">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1">
                  🎉 Prepayment Reward
                </span>
                <div className="mt-1 text-base font-bold text-blue-950 dark:text-blue-100">
                  Saves {fmt(interestSaved)} in interest!
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                  Loan closes {Math.floor(monthsSaved / 12)} years {monthsSaved % 12} months ahead of schedule.
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full mt-6 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Copy Calculation Summary
          </button>
        </div>
      </div>

      {/* Full Amortization Schedule */}
      <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
        <div
          onClick={() => setShowAmortization(!showAmortization)}
          className="w-full flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 outline-none cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Home Loan Amortization Schedule {enablePrepayment ? '(Prepayment Mode)' : '(Yearly)'}
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
        </div>

        {showAmortization && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="p-3 pl-4">Year</th>
                  <th className="p-3 text-right">Principal Repaid</th>
                  <th className="p-3 text-right">Interest Paid</th>
                  <th className="p-3 text-right">Total Installments</th>
                  <th className="p-3 text-right text-emerald-600 dark:text-emerald-400">Est. Tax Benefit</th>
                  <th className="p-3 text-right pr-4">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-zinc-100 dark:divide-zinc-800 font-mono">
                {activeSchedule.map((s) => (
                  <tr key={s.year} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 text-zinc-700 dark:text-zinc-300">
                    <td className="p-3 pl-4 font-sans font-medium text-zinc-900 dark:text-zinc-200">Year {s.year}</td>
                    <td className="p-3 text-right">{fmt(s.principalPaid)}</td>
                    <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">{fmt(s.interestPaid)}</td>
                    <td className="p-3 text-right font-semibold">{fmt(s.totalPaid)}</td>
                    <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-sans font-medium">~{fmt(s.taxSaving)}</td>
                    <td className="p-3 text-right pr-4 text-zinc-500 dark:text-zinc-400">{fmt(s.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statutory Guidance */}
      <div className="bg-zinc-50 dark:bg-zinc-900/30 rounded-xl p-5 border border-zinc-100 dark:border-zinc-900 space-y-3">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-zinc-400" />
          Tax Provisions & RBI Guidelines
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          • <strong className="text-zinc-700 dark:text-zinc-300">Section 24(b):</strong> Allows deduction up to ₹2,00,000 per financial year against home loan interest paid for a self-occupied property.
          <br />
          • <strong className="text-zinc-700 dark:text-zinc-300">Section 80C:</strong> Allows deduction up to ₹1,50,000 for principal repayment (subject to overall Section 80C limit).
          <br />
          • <strong className="text-zinc-700 dark:text-zinc-300">RBI Floating Rate Norm:</strong> As per RBI circulars, banks and HFCs cannot levy prepayment foreclosure penalties on floating-rate individual home loans.
        </p>
      </div>
    </div>
  );
}
