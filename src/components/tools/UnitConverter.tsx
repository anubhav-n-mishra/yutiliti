import React, { useState } from 'react';
import { ArrowRightLeft, Scale, Share2 } from 'lucide-react';

interface UnitConverterProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

type UnitCategory = 'Length' | 'Weight' | 'Temperature' | 'Data';

const CONVERSIONS: Record<UnitCategory, Record<string, number | ((val: number) => number)>> = {
  Length: {
    Meter: 1,
    Kilometer: 1000,
    Centimeter: 0.01,
    Millimeter: 0.001,
    Mile: 1609.34,
    Yard: 0.9144,
    Foot: 0.3048,
    Inch: 0.0254
  },
  Weight: {
    Kilogram: 1,
    Gram: 0.001,
    Milligram: 0.000001,
    MetricTon: 1000,
    Pound: 0.453592,
    Ounce: 0.0283495
  },
  Data: {
    Byte: 1,
    Kilobyte: 1024,
    Megabyte: 1048576,
    Gigabyte: 1073741824,
    Terabyte: 1099511627776
  },
  Temperature: {
    // We handle Temperature separately since it is not a simple multiplier
    Celsius: 1,
    Fahrenheit: 1,
    Kelvin: 1
  }
};

export default function UnitConverter({ onCopy, onShare }: UnitConverterProps) {
  const [category, setCategory] = useState<UnitCategory>('Length');
  const [fromUnit, setFromUnit] = useState<string>('Meter');
  const [toUnit, setToUnit] = useState<string>('Foot');
  const [inputValue, setInputValue] = useState<string>('1');

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const units = Object.keys(CONVERSIONS[cat]);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setInputValue('1');
  };

  const calculateResult = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '';

    if (category === 'Temperature') {
      if (fromUnit === toUnit) return val.toString();
      let c = val;
      // Convert to Celsius first
      if (fromUnit === 'Fahrenheit') c = (val - 32) * (5 / 9);
      if (fromUnit === 'Kelvin') c = val - 273.15;

      // Convert from Celsius to Target
      let target = c;
      if (toUnit === 'Fahrenheit') target = (c * (9 / 5)) + 32;
      if (toUnit === 'Kelvin') target = c + 273.15;
      
      return Number.isInteger(target) ? target.toString() : target.toFixed(4);
    }

    // Standard multiplier conversion
    const baseValue = val * (CONVERSIONS[category][fromUnit] as number);
    const result = baseValue / (CONVERSIONS[category][toUnit] as number);
    
    // Format to avoid long decimals but keep precision for very small numbers
    if (result === 0) return '0';
    if (result < 0.0001 || result > 1000000) return result.toExponential(4);
    return Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(6)).toString();
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setInputValue(calculateResult());
  };

  const result = calculateResult();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Universal Unit Converter</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Quickly convert between standard length, weight, data, and temperature units.</p>
        </div>
        <button
          onClick={() => onShare("Universal Unit Converter", "unit-converter")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Category Selector */}
        <div className="flex flex-wrap gap-2 p-2 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          {(Object.keys(CONVERSIONS) as UnitCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex-1 min-w-[100px] py-2.5 px-4 text-sm font-semibold rounded-xl transition-all ${
                category === cat 
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50' 
                  : 'text-zinc-500 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Converter Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-indigo-50 dark:bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
            
            {/* From */}
            <div className="w-full flex-1 space-y-3">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">From</label>
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-transparent px-5 py-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100 outline-none"
                  placeholder="0.00"
                />
                <div className="px-3 pb-3">
                  <select 
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/50 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer"
                  >
                    {Object.keys(CONVERSIONS[category]).map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex-shrink-0 flex items-center justify-center pt-6 md:pt-0">
              <button 
                onClick={handleSwap}
                className="p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-500/20 hover:scale-110 active:scale-95 transition-all shadow-sm"
                title="Swap units"
              >
                <ArrowRightLeft className="w-6 h-6" />
              </button>
            </div>

            {/* To */}
            <div className="w-full flex-1 space-y-3">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">To</label>
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                <input
                  type="text"
                  readOnly
                  value={result}
                  className="w-full bg-transparent px-5 py-4 text-2xl font-bold text-indigo-600 dark:text-indigo-400 outline-none"
                  placeholder="0.00"
                />
                <div className="px-3 pb-3">
                  <select 
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-4 py-2 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/50 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer"
                  >
                    {Object.keys(CONVERSIONS[category]).map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Info */}
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-full border border-zinc-200 dark:border-zinc-700">
              <Scale className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-mono font-medium text-zinc-600 dark:text-zinc-300">
                1 {fromUnit} = {calculateResult() === '0' || !inputValue ? '?' : (parseFloat(result) / (parseFloat(inputValue) || 1)).toPrecision(4)} {toUnit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
