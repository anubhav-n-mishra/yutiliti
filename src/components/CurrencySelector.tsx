import React from 'react';
import { CURRENCIES, CurrencyOption } from '@/src/lib/currency';
import { DollarSign } from 'lucide-react';

interface CurrencySelectorProps {
  value: string;
  onChange: (code: string) => void;
  label?: string;
}

export default function CurrencySelector({ value, onChange, label = 'Currency' }: CurrencySelectorProps) {
  return (
    <div>
      {label && <label htmlFor="currency-select-dropdown" className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">{label}</label>}
      <div className="relative">
        <select
          id="currency-select-dropdown"
          aria-label={label || 'Select currency'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
