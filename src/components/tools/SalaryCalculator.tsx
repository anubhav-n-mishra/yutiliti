import React, { useState, useMemo } from 'react';
import { RefreshCw, Share2, Coins, Info, HelpCircle } from 'lucide-react';

interface SalaryCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function SalaryCalculator({ onCopy, onShare }: SalaryCalculatorProps) {
  const [annualCtc, setAnnualCtc] = useState<number>(1200000);
  const [basicPercentage, setBasicPercentage] = useState<number>(50);
  const [annualBonus, setAnnualBonus] = useState<number>(100000);
  const [includePF, setIncludePF] = useState<boolean>(true);
  const [customMonthlyDeductions, setCustomMonthlyDeductions] = useState<number>(0);

  // Perform Indian Salary Calculation
  const calculations = useMemo(() => {
    const CTC = annualCtc;
    const basicSalary = (CTC * (basicPercentage / 100));
    
    // PF Calculation
    // Employer & Employee contribute 12% of Basic.
    // Employer contribution is usually a part of CTC. Employee contribution is deducted from Gross.
    const employerPF = includePF ? Math.min(basicSalary * 0.12, 1800 * 12) : 0; // limit to standard 1800/mo if capped, or keep exact 12%
    const employeePF = includePF ? Math.min(basicSalary * 0.12, 1800 * 12) : 0;

    // Professional Tax (Standard is ₹2500 per annum - usually ₹200/mo and ₹300 in Feb, let's say flat ₹200/mo)
    const professionalTax = CTC > 150000 ? 2500 : 0;

    // Gross Salary = CTC - Employer PF - Annual Bonus
    const annualGross = Math.max(0, CTC - employerPF);
    const monthlyGross = annualGross / 12;

    // Estimate Tax under FY 2025-26 New Regime
    // Standard Deduction: ₹75,000
    const standardDeduction = 75000;
    const taxableIncome = Math.max(0, annualGross - annualBonus - employeePF - professionalTax - standardDeduction);

    let annualTax = 0;
    if (taxableIncome > 700000) {
      // Calculate slab-wise tax
      // Slab 1: Up to 3L - 0%
      // Slab 2: 3L to 7L - 5% (₹20,000 max)
      // Slab 3: 7L to 10L - 10% (₹30,000 max)
      // Slab 4: 10L to 12L - 15% (₹30,000 max)
      // Slab 5: 12L to 15L - 20% (₹60,000 max)
      // Slab 6: Above 15L - 30%
      let remainingIncome = taxableIncome;

      // Slab 2: 3L to 7L (diff 4L)
      if (remainingIncome > 300000) {
        const taxableAmt = Math.min(remainingIncome - 300000, 400000);
        annualTax += taxableAmt * 0.05;
      }
      // Slab 3: 7L to 10L (diff 3L)
      if (remainingIncome > 700000) {
        const taxableAmt = Math.min(remainingIncome - 700000, 300000);
        annualTax += taxableAmt * 0.10;
      }
      // Slab 4: 10L to 12L (diff 2L)
      if (remainingIncome > 1000000) {
        const taxableAmt = Math.min(remainingIncome - 1000000, 200000);
        annualTax += taxableAmt * 0.15;
      }
      // Slab 5: 12L to 15L (diff 3L)
      if (remainingIncome > 1200000) {
        const taxableAmt = Math.min(remainingIncome - 1200000, 300000);
        annualTax += taxableAmt * 0.20;
      }
      // Slab 6: Above 15L
      if (remainingIncome > 1500000) {
        const taxableAmt = remainingIncome - 1500000;
        annualTax += taxableAmt * 0.30;
      }

      // Add 4% Health and Education Cess
      annualTax = annualTax * 1.04;
    } else {
      // Rebate under 87A makes tax ₹0 for income <= 7 Lakhs (New regime)
      annualTax = 0;
    }

    const monthlyTax = annualTax / 12;
    const monthlyEmployeePF = employeePF / 12;
    const monthlyPTax = professionalTax / 12;

    // Monthly In-Hand = Monthly Gross - Monthly Employee PF - Monthly PTax - Monthly Tax - Custom Deductions - Monthly Bonus share (if bonus is paid annually)
    // Let's assume Bonus is paid separately or accrued monthly (if paid annually, we remove monthly bonus component from standard monthly take-home)
    const monthlyBonusShare = annualBonus / 12;
    const monthlyInHand = Math.max(0, monthlyGross - monthlyEmployeePF - monthlyPTax - monthlyTax - monthlyBonusShare - customMonthlyDeductions);
    const annualInHand = monthlyInHand * 12;

    return {
      monthlyGross,
      monthlyInHand,
      annualInHand,
      monthlyEmployeePF,
      monthlyPTax,
      monthlyTax,
      monthlyBonusShare,
      annualTax,
      taxableIncome,
      standardDeduction,
      employerPF
    };
  }, [annualCtc, basicPercentage, annualBonus, includePF, customMonthlyDeductions]);

  const {
    monthlyGross,
    monthlyInHand,
    annualInHand,
    monthlyEmployeePF,
    monthlyPTax,
    monthlyTax,
    monthlyBonusShare
  } = calculations;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleCopyResults = () => {
    const text = `Salary Breakdown Forecast (India):\nAnnual CTC: ${formatCurrency(annualCtc)}\nEstimated Monthly Take-Home: ${formatCurrency(monthlyInHand)}\nEstimated Monthly Gross: ${formatCurrency(monthlyGross)}\nPF Deduction: ${formatCurrency(monthlyEmployeePF)}/mo\nIncome Tax estimate: ${formatCurrency(monthlyTax)}/mo`;
    onCopy(text);
  };

  const handleReset = () => {
    setAnnualCtc(1200000);
    setBasicPercentage(50);
    setAnnualBonus(100000);
    setIncludePF(true);
    setCustomMonthlyDeductions(0);
  };

  // Pie chart segments calculation
  const totalDeductions = monthlyEmployeePF + monthlyPTax + monthlyTax + monthlyBonusShare + customMonthlyDeductions;
  const inHandPercentage = monthlyGross > 0 ? (monthlyInHand / monthlyGross) * 100 : 70;
  const pfPercentage = monthlyGross > 0 ? (monthlyEmployeePF / monthlyGross) * 100 : 10;
  const taxPercentage = monthlyGross > 0 ? (monthlyTax / monthlyGross) * 100 : 10;
  const otherPercentage = monthlyGross > 0 ? ((monthlyBonusShare + customMonthlyDeductions + monthlyPTax) / monthlyGross) * 100 : 10;

  return (
    <div className="space-y-8">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Salary In-Hand Calculator (India)</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Estimate take-home earnings with EPF, Professional Tax, and Income Tax estimates.</p>
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
            onClick={handleCopyResults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Copy
          </button>
          <button
            onClick={() => onShare("Salary In-Hand Calculator", "#/salary-calculator")}
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
          {/* Annual CTC */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Annual Cost to Company (CTC)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">₹</span>
                <input
                  type="number"
                  value={annualCtc}
                  onChange={(e) => setAnnualCtc(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-28 text-right px-2 py-1 text-sm font-semibold rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 outline-none focus:border-zinc-400 dark:focus:border-zinc-700 font-mono"
                />
              </div>
            </div>
            <input
              type="range"
              min="100000"
              max="5000000"
              step="50000"
              value={annualCtc}
              onChange={(e) => setAnnualCtc(parseInt(e.target.value))}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-zinc-100"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
              <span>₹1 Lakh</span>
              <span>₹50 Lakhs</span>
            </div>
          </div>

          {/* Slabs / Checklist controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 p-4 rounded-xl">
              <label className="text-xs font-semibold text-zinc-500 uppercase">Basic Salary (% of CTC)</label>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={basicPercentage}
                  onChange={(e) => setBasicPercentage(Math.max(10, Math.min(100, parseInt(e.target.value) || 10)))}
                  className="w-16 px-2 py-1 text-xs font-semibold rounded border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 text-center"
                />
                <span className="text-xs text-zinc-400">% (Normally 40% - 50%)</span>
              </div>
            </div>

            <div className="space-y-1 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 p-4 rounded-xl">
              <label className="text-xs font-semibold text-zinc-500 uppercase">Annual Performance Bonus</label>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-zinc-400">₹</span>
                <input
                  type="number"
                  value={annualBonus}
                  onChange={(e) => setAnnualBonus(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-2 py-1 text-xs font-semibold rounded border bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50"
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl p-5 space-y-4">
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Provident Fund & Deductions</p>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includePF}
                onChange={(e) => setIncludePF(e.target.checked)}
                className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-950 accent-zinc-900 dark:accent-zinc-100"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Include Employee Provident Fund (EPF)</span>
                <span className="text-[10px] text-zinc-400">Deducts standard 12% of basic salary towards retirement fund.</span>
              </div>
            </label>

            <div className="h-[1px] bg-zinc-200/50 dark:bg-zinc-800" />

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500">Other Custom Deductions (Monthly)</label>
              <input
                type="number"
                value={customMonthlyDeductions}
                onChange={(e) => setCustomMonthlyDeductions(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="e.g. medical insurance premium"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 outline-none text-zinc-950"
              />
            </div>
          </div>
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider">Estimated Monthly Take-Home</p>
              <p className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50 mt-1">{formatCurrency(monthlyInHand)}</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Annual Take-Home: {formatCurrency(annualInHand)}</p>
            </div>

            <div className="h-[1px] bg-zinc-200/50 dark:bg-zinc-800" />

            {/* Structured breakdown items */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Monthly Gross Salary:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-200 font-mono">{formatCurrency(monthlyGross)}</span>
              </div>
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span>Monthly EPF (Employee share):</span>
                <span className="font-semibold font-mono">-{formatCurrency(monthlyEmployeePF)}</span>
              </div>
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span>Monthly Professional Tax:</span>
                <span className="font-semibold font-mono">-{formatCurrency(monthlyPTax)}</span>
              </div>
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span>Monthly Income Tax estimate:</span>
                <span className="font-semibold font-mono">-{formatCurrency(monthlyTax)}</span>
              </div>
              {monthlyBonusShare > 0 && (
                <div className="flex justify-between text-zinc-500">
                  <span>Accrued Annual Bonus share (Paid separately):</span>
                  <span className="font-semibold font-mono">-{formatCurrency(monthlyBonusShare)}</span>
                </div>
              )}
            </div>

            <div className="h-[1px] bg-zinc-200/50 dark:bg-zinc-800" />
          </div>

          {/* SVG Pie Chart representing salary layout */}
          <div className="flex flex-col items-center mt-6">
            <svg width="120" height="120" viewBox="0 0 32 32" className="transform -rotate-90">
              {/* Take home segment */}
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray={`${inHandPercentage} ${100 - inHandPercentage}`}
                strokeDashoffset="0"
              />
              {/* PF segment */}
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="transparent"
                stroke="#ef4444"
                strokeWidth="4"
                strokeDasharray={`${pfPercentage} ${100 - pfPercentage}`}
                strokeDashoffset={-inHandPercentage}
              />
              {/* Tax segment */}
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="transparent"
                stroke="#f59e0b"
                strokeWidth="4"
                strokeDasharray={`${taxPercentage} ${100 - taxPercentage}`}
                strokeDashoffset={-(inHandPercentage + pfPercentage)}
              />
            </svg>

            {/* Small legends */}
            <div className="flex flex-wrap justify-center gap-3 mt-4 text-[10px] text-zinc-500 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Take-Home ({inHandPercentage.toFixed(0)}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                EPF ({pfPercentage.toFixed(0)}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Tax ({taxPercentage.toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tax slab notes */}
      <div className="bg-zinc-50 dark:bg-zinc-900/30 rounded-xl p-5 border border-zinc-100 dark:border-zinc-900 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-zinc-400" />
          FY 2025-26 Tax slab notes (New Tax Regime)
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          This calculator follows the standard tax structures of the New Tax Regime in India which includes a standard deduction of ₹75,000 for salaried employees. It applies the newest simplified slabs. Tax rebates under Section 87A are applied so that employees with total taxable income up to ₹7,000,000 pay no taxes.
        </p>
      </div>
    </div>
  );
}
