export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
  locale: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', label: 'USD ($)', locale: 'en-US' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)', locale: 'en-IN' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)', locale: 'en-IE' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)', locale: 'en-GB' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)', locale: 'en-AU' },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$)', locale: 'en-CA' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)', locale: 'ja-JP' },
  { code: 'AED', symbol: 'AED', label: 'AED (د.إ)', locale: 'en-AE' },
  { code: 'SGD', symbol: 'S$', label: 'SGD (S$)', locale: 'en-SG' },
];

export function getCurrency(code: string): CurrencyOption {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

export function formatCurrency(val: number, currencyCode = 'USD'): string {
  const curr = getCurrency(currencyCode);
  return new Intl.NumberFormat(curr.locale, {
    style: 'currency',
    currency: curr.code,
    maximumFractionDigits: 0,
  }).format(val);
}
