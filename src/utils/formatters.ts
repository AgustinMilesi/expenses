import { Currency, ExpenseCategory, ExpenseItem } from '../types/expense';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  ARS: 'ARS $',
  EUR: '€',
};

export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const formattedNumber = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (currency === 'EUR') {
    return `${formattedNumber} ${symbol}`;
  }
  return `${symbol}${formattedNumber}`;
}

export interface ExpenseTotals {
  total: number;
  totalPaid: number;
  totalPending: number;
  fixedTotal: number;
  subTotal: number;
  leisureTotal: number;
  count: number;
  paidCount: number;
  pendingCount: number;
}

export function calculateTotals(items: ExpenseItem[]): ExpenseTotals {
  return items.reduce(
    (acc, item) => {
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

      return acc;
    },
    {
      total: 0,
      totalPaid: 0,
      totalPending: 0,
      fixedTotal: 0,
      subTotal: 0,
      leisureTotal: 0,
      count: 0,
      paidCount: 0,
      pendingCount: 0,
    }
  );
}

export function getCategoryBadge(category: ExpenseCategory): {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
} {
  switch (category) {
    case 'fixed':
      return {
        label: 'Fixed Bill',
        bgColor: 'bg-blue-500/10',
        textColor: 'text-blue-400',
        borderColor: 'border-blue-500/20',
      };
    case 'subscription':
      return {
        label: 'Subscription',
        bgColor: 'bg-purple-500/10',
        textColor: 'text-purple-400',
        borderColor: 'border-purple-500/20',
      };
    case 'leisure':
      return {
        label: 'Leisure & Outing',
        bgColor: 'bg-rose-500/10',
        textColor: 'text-rose-400',
        borderColor: 'border-rose-500/20',
      };
  }
}
