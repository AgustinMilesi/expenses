import { Currency, ExpenseCategory, ExpenseItem, MonthlyBudget } from '../types/expense';

export const CURRENCY_INFO: Record<Currency, { symbol: string; label: string; flag: string }> = {
  ARS: { symbol: '$', label: 'ARS (Pesos Argentinos)', flag: '🇦🇷' },
  USD: { symbol: '$', label: 'USD (US Dollars)', flag: '🇺🇸' },
  EUR: { symbol: '€', label: 'EUR (Euros)', flag: '🇪🇺' },
  CNY: { symbol: '¥', label: 'CNY (Chinese Yuan)', flag: '🇨🇳' },
  BRL: { symbol: 'R$', label: 'BRL (Reais Brasileiros)', flag: '🇧🇷' },
};

export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  const info = CURRENCY_INFO[currency] || CURRENCY_INFO.USD;
  const locale =
    currency === 'ARS'
      ? 'es-AR'
      : currency === 'EUR'
      ? 'de-DE'
      : currency === 'CNY'
      ? 'zh-CN'
      : currency === 'BRL'
      ? 'pt-BR'
      : 'en-US';

  const formattedNumber = amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (currency === 'EUR') {
    return `${formattedNumber} €`;
  }
  return `${info.symbol}${formattedNumber}`;
}

export function formatCardNumber(num: string): string {
  const clean = num.replace(/\D/g, '');
  const chunks = clean.match(/.{1,4}/g);
  return chunks ? chunks.join(' ') : num;
}

export interface ExpenseTotals {
  total: number;
  totalPaid: number;
  totalPending: number;
  fixedTotal: number;
  subTotal: number;
  leisureTotal: number;
  microTotal: number;
  count: number;
  paidCount: number;
  pendingCount: number;
  remainingBalance: number;
  percentageUsed: number;
}

export function calculateTotals(items: ExpenseItem[], monthlyIncome: number = 0): ExpenseTotals {
  const initial = {
    total: 0,
    totalPaid: 0,
    totalPending: 0,
    fixedTotal: 0,
    subTotal: 0,
    leisureTotal: 0,
    microTotal: 0,
    count: 0,
    paidCount: 0,
    pendingCount: 0,
    remainingBalance: monthlyIncome,
    percentageUsed: 0,
  };

  const calculated = items.reduce((acc, item) => {
    acc.total += item.amount;
    acc.count += 1;

    if (item.isPaid) {
      acc.totalPaid += item.amount;
      acc.paidCount += 1;
    } else {
      acc.totalPending += item.amount;
      acc.pendingCount += 1;
    }

    if (item.category === 'fixed') acc.fixedTotal += item.amount;
    if (item.category === 'subscription') acc.subTotal += item.amount;
    if (item.category === 'leisure') acc.leisureTotal += item.amount;
    if (item.category === 'micro') acc.microTotal += item.amount;

    return acc;
  }, initial);

  calculated.remainingBalance = Math.max(0, monthlyIncome - calculated.total);
  calculated.percentageUsed = monthlyIncome > 0 ? Math.min(100, Math.round((calculated.total / monthlyIncome) * 100)) : 0;

  return calculated;
}
