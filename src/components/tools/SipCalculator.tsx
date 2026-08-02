import React, { useState, useMemo } from 'react';
import { Download, RefreshCw, Share2, Info, ChevronDown, ChevronUp } from 'lucide-react';

import CurrencySelector from '@/src/components/CurrencySelector';
import { formatCurrency as formatCurr } from '@/src/lib/currency';

interface SipCalculatorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function SipCalculator({ onCopy, onShare }: SipCalculatorProps) {
  const [currency, setCurrency] = useState<string>('USD');
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [duration, setDuration] = useState<number>(10);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(true);

  // Perform SIP Calculation
  const calculations = useMemo(() => {
    const P = monthlyInvestment;
    const r = expectedReturn / 100 / 12;
    const n = duration * 12;

    if (P <= 0 || expectedReturn <= 0 || duration <= 0) {
      return { totalInvested: 0, estimatedReturns: 0, maturityAmount: 0, yearlyData: [] };
    }

    // Formula: M = P * [ ( (1 + r)^n - 1 ) / r ] * (1 + r)
    const maturityAmount = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalInvested = P * n;
    const estimatedReturns = Math.max(0, maturityAmount - totalInvested);

    // Calculate yearly growth data for chart and schedule
    const yearlyData = [];
    for (let yr = 1; yr <= duration; yr++) {
      const months = yr * 12;
      const yearlyMaturity = P * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
      const yearlyInvested = P * months;
      const yearlyReturns = Math.max(0, yearlyMaturity - yearlyInvested);

      yearlyData.push({
        year: yr,
        invested: yearlyInvested,
        returns: yearlyReturns,
        total: yearlyMaturity
      });
    }

    return {
      totalInvested,
      estimatedReturns: isNaN(estimatedReturns) ? 0 : estimatedReturns,
      maturityAmount: isNaN(maturityAmount) ? 0 : maturityAmount,
      yearlyData
    };
  }, [monthlyInvestment, expectedReturn, duration]);

  const { totalInvested, estimatedReturns, maturityAmount, yearlyData } = calculations;

  const formatCurrency = (val: number) => formatCurr(val, currency);

  const handleReset = () => {
    setMonthlyInvestment(10000);
    setExpectedReturn(12);
    setDuration(10);
  };

  const handleExportCSV = () => {
    const headers = 'Year,Total Invested,Estimated Returns,Maturity Amount\n';
    const rows = yearlyData
      .map(
        (y) =>
          `${y.year},${y.invested.toFixed(2)},${y.returns.toFixed(2)},${y.total.toFixed(2)}`
      )
      .join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIP_Growth_Breakdown_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCopyResults = () => {
    const text = `SIP Investment Forecast:\nMonthly Investment: ${formatCurrency(monthlyInvestment)}\nDuration: ${duration} Years\nExpected Return Rate: ${expectedReturn}%\nTotal Invested: ${formatCurrency(totalInvested)}\nEstimated Returns: ${formatCurrency(estimatedReturns)}\nExpected Maturity: ${formatCurrency(maturityAmount)}`;
    onCopy(text);
  };

  // SVG Chart Height Points calculation
  const chartMaxVal = maturityAmount || 1;
  const svgWidth = 400;
  const svgHeight = 150;
  
  const pointsInvested = useMemo(() => {
    if (yearlyData.length === 0) return '';
    return yearlyData.map((d, index) => {
      const x = (index / (yearlyData.length - 1)) * svgWidth;
      const y = svgHeight - (d.invested / chartMaxVal) * (svgHeight - 10);
      return `${x},${y}`;
    }).join(' ');
  }, [yearlyData, chartMaxVal]);

  const pointsTotal = useMemo(() => {
    if (yearlyData.length === 0) return '';
    return yearlyData.map((d, index) => {
      const x = (index / (yearlyData.length - 1)) * svgWidth;
      const y = svgHeight - (d.total / chartMaxVal) * (svgHeight - 10);
      return `${x},${y}`;
    }).join(' ');
  }, [yearlyData, chartMaxVal]);

  return (
    <div className="space-y-8">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">SIP Investment Calculator</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Estimate the future wealth built through systematic mutual fund investments.</p>
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
            onClick={() => onShare("SIP Calculator", "#/sip-calculator")}
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

          {/* Monthly Investment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Monthly Contribution</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 dark:text-zinc-500">₹</span>
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Math.max(100, parseFloat(e.target.value) || 0))}
                  className="w-28 text-right px-2 py-1 text-sm font-semibold rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
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
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-zinc-100"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
              <span>₹500</span>
              <span>₹5 Lakhs / mo</span>
            </div>
          </div>

          {/* Expected Return Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Expected Annual Return (% p.a.)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-24 text-right px-2 py-1 text-sm font-semibold rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
                />
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.1"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-zinc-100"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Investment Duration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Investment Duration (Years)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 text-right px-2 py-1 text-sm font-semibold rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
                />
              </div>
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
            <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
              <span>1 Year</span>
              <span>40 Years</span>
            </div>
          </div>
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
          <div className="space-y-5">
            <div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider">Estimated Wealth Maturity</p>
              <p className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50 mt-1">{formatCurrency(maturityAmount)}</p>
            </div>

            <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">Invested Principal</p>
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mt-0.5">{formatCurrency(totalInvested)}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-zinc-500" />
                  <span className="text-[10px] font-mono text-zinc-500">{((totalInvested / (maturityAmount || 1)) * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">Estimated Gains</p>
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mt-0.5">{formatCurrency(estimatedReturns)}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-mono text-zinc-500">{((estimatedReturns / (maturityAmount || 1)) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800" />
          </div>

          {/* Custom Crafted Line/Area Chart using standard React SVG */}
          <div className="mt-4">
            <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 text-center uppercase tracking-wider mb-2">Compounding Curve</p>
            <div className="relative w-full h-[120px] bg-zinc-100/30 dark:bg-zinc-900/10 rounded border border-zinc-100 dark:border-zinc-900 overflow-hidden px-1">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                {/* Grids */}
                <line x1="0" y1={svgHeight/2} x2={svgWidth} y2={svgHeight/2} stroke="#e4e4e7" strokeDasharray="3 3" className="dark:stroke-zinc-800" />
                
                {/* Filled Area for Total Wealth */}
                <polygon
                  points={`0,${svgHeight} ${pointsTotal} ${svgWidth},${svgHeight}`}
                  fill="url(#emerald-gradient)"
                  opacity="0.15"
                />

                {/* Total Wealth Line */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  points={pointsTotal}
                />

                {/* Invested Principal Line */}
                <polyline
                  fill="none"
                  stroke="#71717a"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  points={pointsInvested}
                />

                {/* Definitions */}
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
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">SIP Wealth Accumulation Table</h2>
            <span className="text-[10px] text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full font-medium">Compound growth</span>
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
                  <th className="p-3 text-right">Total Invested</th>
                  <th className="p-3 text-right">Estimated Returns</th>
                  <th className="p-3 text-right pr-4">Maturity Value</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-zinc-100 dark:divide-zinc-800 font-mono">
                {yearlyData.map((d) => (
                  <tr key={d.year} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 text-zinc-700 dark:text-zinc-300">
                    <td className="p-3 pl-4 font-sans font-medium text-zinc-900 dark:text-zinc-200">Year {d.year}</td>
                    <td className="p-3 text-right">{formatCurrency(d.invested)}</td>
                    <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">{formatCurrency(d.returns)}</td>
                    <td className="p-3 text-right pr-4 font-semibold text-zinc-900 dark:text-zinc-50">{formatCurrency(d.total)}</td>
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
          The Power of Compounding in SIP
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Systematic Investment Plans (SIP) leverage the concept of <strong className="text-zinc-700 dark:text-zinc-300">Rupee Cost Averaging</strong> and compounding. Since you invest a fixed sum regularly, you buy more mutual fund units when prices are low and fewer units when prices are high, lowering your average cost per unit over time.
          <br /><br />
          The compounding works continuously because the returns generated in the early years earn further returns in subsequent years. This is why investing for longer tenures (e.g., 15-20 years) yields exponentially higher returns compared to shorter periods.
        </p>
      </div>
    </div>
  );
}
