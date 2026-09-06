import React, { useState, useMemo } from 'react';
import { Download, RefreshCw, Share2, Info, ChevronDown, ChevronUp, TrendingUp, Sparkles } from 'lucide-react';

import CurrencySelector from '@/src/components/CurrencySelector';
import { formatCurrency as formatCurr, getCurrency } from '@/src/lib/currency';

interface SipCalculatorProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
  initialCurrency?: string;
  initialMonthlyInvestment?: number;
  initialExpectedReturn?: number;
  initialDuration?: number;
}

const RETURN_PRESETS = [
  { label: 'Debt / Hybrid', rate: 9 },
  { label: 'Nifty 50 / Large Cap', rate: 12 },
  { label: 'Flexi / Mid Cap', rate: 15 },
  { label: 'Aggressive Small Cap', rate: 18 },
];

export default function SipCalculator({
  onCopy,
  onShare,
  initialCurrency,
  initialMonthlyInvestment,
  initialExpectedReturn,
  initialDuration,
}: SipCalculatorProps) {
  const [currency, setCurrency] = useState<string>(initialCurrency || 'USD');
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(initialMonthlyInvestment ?? 10000);
  const [expectedReturn, setExpectedReturn] = useState<number>(initialExpectedReturn ?? 12);
  const [duration, setDuration] = useState<number>(initialDuration ?? 15);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(true);

  // Step-Up SIP State
  const [enableStepUp, setEnableStepUp] = useState<boolean>(false);
  const [stepUpPercent, setStepUpPercent] = useState<number>(10);

  // Inflation Adjustment State
  const [enableInflation, setEnableInflation] = useState<boolean>(false);
  const [inflationRate, setInflationRate] = useState<number>(6);

  // Perform SIP Calculation (Regular or Step-Up)
  const calculations = useMemo(() => {
    const P = monthlyInvestment;
    const r = expectedReturn / 100 / 12;
    const totalMonths = duration * 12;

    if (P <= 0 || expectedReturn <= 0 || duration <= 0) {
      return {
        totalInvested: 0,
        estimatedReturns: 0,
        maturityAmount: 0,
        realPurchasingPower: 0,
        yearlyData: [],
      };
    }

    let totalInvested = 0;
    let maturityAmount = 0;
    const yearlyData = [];

    // Calculate month by month compounding
    let currentMonthlyDeposit = P;
    let accumulatedValue = 0;
    let cumulativeInvested = 0;

    for (let yr = 1; yr <= duration; yr++) {
      if (enableStepUp && yr > 1) {
        currentMonthlyDeposit = Math.round(currentMonthlyDeposit * (1 + stepUpPercent / 100));
      }

      let yearlyDepositTotal = 0;
      for (let m = 1; m <= 12; m++) {
        yearlyDepositTotal += currentMonthlyDeposit;
        cumulativeInvested += currentMonthlyDeposit;
        // Each deposit compounds for the remaining time
        accumulatedValue = (accumulatedValue + currentMonthlyDeposit) * (1 + r);
      }

      const yearlyReturns = Math.max(0, accumulatedValue - cumulativeInvested);
      const inflationDiscountFactor = Math.pow(1 + inflationRate / 100, yr);
      const realValue = accumulatedValue / inflationDiscountFactor;

      yearlyData.push({
        year: yr,
        monthlyDeposit: currentMonthlyDeposit,
        invested: cumulativeInvested,
        returns: yearlyReturns,
        total: accumulatedValue,
        realValue: Math.round(realValue),
      });
    }

    totalInvested = cumulativeInvested;
    maturityAmount = accumulatedValue;
    const estimatedReturns = Math.max(0, maturityAmount - totalInvested);
    const totalDiscountFactor = Math.pow(1 + inflationRate / 100, duration);
    const realPurchasingPower = Math.round(maturityAmount / totalDiscountFactor);

    return {
      totalInvested,
      estimatedReturns: isNaN(estimatedReturns) ? 0 : estimatedReturns,
      maturityAmount: isNaN(maturityAmount) ? 0 : maturityAmount,
      realPurchasingPower: isNaN(realPurchasingPower) ? 0 : realPurchasingPower,
      yearlyData,
    };
  }, [monthlyInvestment, expectedReturn, duration, enableStepUp, stepUpPercent, enableInflation, inflationRate]);

  const { totalInvested, estimatedReturns, maturityAmount, realPurchasingPower, yearlyData } = calculations;

  const formatCurrency = (val: number) => formatCurr(val, currency);

  const handleReset = () => {
    setMonthlyInvestment(10000);
    setExpectedReturn(12);
    setDuration(15);
    setEnableStepUp(false);
    setStepUpPercent(10);
    setEnableInflation(false);
    setInflationRate(6);
  };

  const handleExportCSV = () => {
    const headers = 'Year,Monthly Deposit,Cumulative Invested,Estimated Gains,Maturity Value,Purchasing Power (Real Value)\n';
    const rows = yearlyData
      .map(
        (y) =>
          `${y.year},${y.monthlyDeposit.toFixed(2)},${y.invested.toFixed(2)},${y.returns.toFixed(2)},${y.total.toFixed(2)},${y.realValue.toFixed(2)}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIP_Growth_${enableStepUp ? 'StepUp_' : ''}${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCopyResults = () => {
    const text = `SIP Investment Forecast:\nMonthly Investment: ${formatCurrency(monthlyInvestment)}${enableStepUp ? ` (with ${stepUpPercent}% annual step-up)` : ''}\nDuration: ${duration} Years\nExpected Return Rate: ${expectedReturn}%\nTotal Invested: ${formatCurrency(totalInvested)}\nEstimated Gains: ${formatCurrency(estimatedReturns)}\nNominal Maturity: ${formatCurrency(maturityAmount)}${enableInflation ? `\nReal Purchasing Power (${inflationRate}% inflation): ${formatCurrency(realPurchasingPower)}` : ''}`;
    onCopy(text);
  };

  // SVG Chart points
  const chartMaxVal = maturityAmount || 1;
  const svgWidth = 400;
  const svgHeight = 150;

  const pointsInvested = useMemo(() => {
    if (yearlyData.length === 0) return '';
    return yearlyData
      .map((d, index) => {
        const x = (index / (yearlyData.length - 1)) * svgWidth;
        const y = svgHeight - (d.invested / chartMaxVal) * (svgHeight - 10);
        return `${x},${y}`;
      })
      .join(' ');
  }, [yearlyData, chartMaxVal]);

  const pointsTotal = useMemo(() => {
    if (yearlyData.length === 0) return '';
    return yearlyData
      .map((d, index) => {
        const x = (index / (yearlyData.length - 1)) * svgWidth;
        const y = svgHeight - (d.total / chartMaxVal) * (svgHeight - 10);
        return `${x},${y}`;
      })
      .join(' ');
  }, [yearlyData, chartMaxVal]);

  return (
    <div className="space-y-8">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            SIP Investment Calculator
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Calculate mutual fund SIP compounding, model annual Step-Up increments, and adjust for future inflation.
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
            onClick={handleCopyResults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Copy
          </button>
          <button
            onClick={() => onShare('SIP Calculator', 'sip-calculator')}
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

          {/* Monthly Contribution */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Monthly Investment</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-bold">{getCurrency(currency).symbol}</span>
                <input
                  type="number"
                  value={monthlyInvestment}
                  step="500"
                  onChange={(e) => setMonthlyInvestment(Math.max(100, parseFloat(e.target.value) || 0))}
                  className="w-32 text-right px-2 py-1 text-sm font-semibold rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
            <input
              type="range"
              min="500"
              max="500000"
              step="500"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(parseInt(e.target.value))}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
              <span>{formatCurrency(500)}</span>
              <span>{formatCurrency(500000)} / mo</span>
            </div>
          </div>

          {/* Expected Return Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Expected Annual Return (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-24 text-right px-2 py-1 text-sm font-semibold rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.1"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            {/* Asset Class Return Benchmarks */}
            <div className="pt-2">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 block mb-1.5">
                Benchmark Returns (Click to apply):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {RETURN_PRESETS.map((p) => {
                  const isSelected = Math.abs(expectedReturn - p.rate) < 0.01;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setExpectedReturn(p.rate)}
                      className={`px-2 py-1 text-xs rounded-lg border transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'border-zinc-200 bg-zinc-50/60 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400'
                      }`}
                    >
                      {p.label} <span className="font-mono font-medium opacity-80">({p.rate}%)</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Investment Duration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Investment Duration (Years)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-right px-2 py-1 text-sm font-semibold rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-zinc-100"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
              <span>1 Year</span>
              <span>40 Years</span>
            </div>
          </div>

          {/* Step-Up SIP Module */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Step-Up SIP (Annual Increment)
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Increase your monthly investment each year in line with salary growth.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableStepUp}
                  onChange={(e) => setEnableStepUp(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {enableStepUp && (
              <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-900/40 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Annual Increment Rate (% each year)
                  </label>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">{stepUpPercent}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="1"
                  value={stepUpPercent}
                  onChange={(e) => setStepUpPercent(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex gap-2 pt-1">
                  {[5, 10, 15, 20].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setStepUpPercent(val)}
                      className={`px-2 py-0.5 text-[11px] rounded border ${
                        stepUpPercent === val
                          ? 'border-emerald-500 bg-emerald-100 text-emerald-800 font-semibold dark:border-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-200'
                          : 'border-zinc-200 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      +{val}% / yr
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Inflation Adjustment Toggle */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Adjust for Inflation
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  See the future purchasing power of your portfolio in today's money.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableInflation}
                  onChange={(e) => setEnableInflation(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-800 dark:peer-checked:bg-zinc-200"></div>
              </label>
            </div>

            {enableInflation && (
              <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Assumed Inflation Rate</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={inflationRate}
                    min="1"
                    max="15"
                    step="0.5"
                    onChange={(e) => setInflationRate(parseFloat(e.target.value) || 6)}
                    className="w-16 text-right px-2 py-0.5 text-xs font-semibold rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
                  />
                  <span className="text-xs text-zinc-500">% p.a.</span>
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
                Estimated Wealth Maturity {enableStepUp && '(Step-Up)'}
              </p>
              <p className="text-3xl sm:text-4xl font-display font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                {formatCurrency(maturityAmount)}
              </p>
              {enableInflation && (
                <div className="mt-2 rounded-lg bg-amber-50 p-2.5 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    Real Purchasing Power ({inflationRate}% Inflation)
                  </span>
                  <div className="text-lg font-bold text-amber-900 dark:text-amber-200 font-mono">
                    ~{formatCurrency(realPurchasingPower)}
                  </div>
                  <span className="text-[11px] text-amber-700 dark:text-amber-400">In today&apos;s purchasing value</span>
                </div>
              )}
            </div>

            <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">Invested Principal</p>
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mt-0.5">{formatCurrency(totalInvested)}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-zinc-500" />
                  <span className="text-[10px] font-mono text-zinc-500">
                    {((totalInvested / (maturityAmount || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">Estimated Gains</p>
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mt-0.5">{formatCurrency(estimatedReturns)}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-mono text-zinc-500">
                    {((estimatedReturns / (maturityAmount || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800" />
          </div>

          {/* Compounding Chart */}
          <div className="mt-4">
            <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 text-center uppercase tracking-wider mb-2">
              Compounding Curve {enableStepUp && '(Accelerated by Step-Up)'}
            </p>
            <div className="relative w-full h-[120px] bg-zinc-100/30 dark:bg-zinc-900/10 rounded border border-zinc-100 dark:border-zinc-900 overflow-hidden px-1">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                <line
                  x1="0"
                  y1={svgHeight / 2}
                  x2={svgWidth}
                  y2={svgHeight / 2}
                  stroke="#e4e4e7"
                  strokeDasharray="3 3"
                  className="dark:stroke-zinc-800"
                />
                <polygon
                  points={`0,${svgHeight} ${pointsTotal} ${svgWidth},${svgHeight}`}
                  fill="url(#emerald-gradient)"
                  opacity="0.15"
                />
                <polyline fill="none" stroke="#10b981" strokeWidth="2.5" points={pointsTotal} />
                <polyline fill="none" stroke="#71717a" strokeWidth="1.5" strokeDasharray="4 3" points={pointsInvested} />
                <defs>
                  <linearGradient id="emerald-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex justify-between mt-1 px-1 text-[9px] font-mono text-zinc-400">
              <span>Year 1</span>
              <span>Year {Math.round(duration / 2)}</span>
              <span>Year {duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Growth breakdown section */}
      <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
        <div
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 outline-none cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              SIP Wealth Accumulation Table {enableStepUp ? '(Step-Up Applied)' : ''}
            </h2>
            <span className="text-[10px] text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full font-medium">
              {yearlyData.length} Years Breakdown
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
            {showBreakdown ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </div>
        </div>

        {showBreakdown && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-800 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="p-3 pl-4">Year</th>
                  {enableStepUp && <th className="p-3 text-right">Monthly Deposit</th>}
                  <th className="p-3 text-right">Cumulative Invested</th>
                  <th className="p-3 text-right">Estimated Gains</th>
                  <th className="p-3 text-right">Nominal Maturity</th>
                  {enableInflation && <th className="p-3 text-right text-amber-600 dark:text-amber-400 pr-4">Real Value (Today&apos;s Money)</th>}
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-zinc-100 dark:divide-zinc-800 font-mono">
                {yearlyData.map((d) => (
                  <tr key={d.year} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 text-zinc-700 dark:text-zinc-300">
                    <td className="p-3 pl-4 font-sans font-medium text-zinc-900 dark:text-zinc-200">Year {d.year}</td>
                    {enableStepUp && <td className="p-3 text-right">{formatCurrency(d.monthlyDeposit)}</td>}
                    <td className="p-3 text-right">{formatCurrency(d.invested)}</td>
                    <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">{formatCurrency(d.returns)}</td>
                    <td className="p-3 text-right font-semibold text-zinc-900 dark:text-zinc-50">{formatCurrency(d.total)}</td>
                    {enableInflation && <td className="p-3 text-right text-amber-600 dark:text-amber-400 pr-4">{formatCurrency(d.realValue)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statutory & Scientific Guidance */}
      <div className="bg-zinc-50 dark:bg-zinc-900/30 rounded-xl p-5 border border-zinc-100 dark:border-zinc-900 space-y-3">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-zinc-400" />
          The Mathematical Superiority of Step-Up SIP
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Standard SIP calculations assume you invest the exact same monthly contribution throughout a 15-20 year career.
          However, real-world salaries typically expand by 8-12% each year.
          By toggling a <strong className="text-zinc-700 dark:text-zinc-300">10% Annual Step-Up</strong>, an investor allocating ₹10,000/month accumulates over <strong>₹2.1 Crore</strong> across 15 years at 12% CAGR, compared to only ~₹50 Lakhs in a static SIP — quadrupling the terminal corpus with modest incremental contributions.
        </p>
      </div>
    </div>
  );
}
