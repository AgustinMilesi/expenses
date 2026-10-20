import { Currency, ExpenseCategory, ExpenseItem, TransactionItem } from '../types/expense';

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

export function generateTrxId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let res = 'CJ';
  for (let i = 0; i < 8; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

export function getCurrentTimeFormatted(): string {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strMinutes = minutes < 10 ? '0' + minutes : minutes;
  const strHours = hours < 10 ? '0' + hours : hours;
  return `${strHours}:${strMinutes} ${ampm}`;
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

export function calculateTransactionTotals(items: TransactionItem[]): {
  totalInflow: number;
  totalOutflow: number;
  netChange: number;
} {
  return items.reduce(
    (acc, item) => {
      if (item.type === 'receive' || item.type === 'deposit') {
        acc.totalInflow += item.amount;
        acc.netChange += item.amount;
      } else {
        acc.totalOutflow += item.amount;
        acc.netChange -= item.amount;
      }
      return acc;
    },
    { totalInflow: 0, totalOutflow: 0, netChange: 0 }
  );
}
