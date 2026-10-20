export type ExpenseCategory = 'fixed' | 'subscription' | 'leisure' | 'transfer' | 'income' | 'payment';

export type Currency = 'ARS' | 'USD' | 'EUR' | 'CNY' | 'BRL';

export type AppTheme = 'dark' | 'light';

export type AccentTheme = 'lime' | 'emerald' | 'indigo' | 'rose' | 'amber' | 'cyan' | 'violet';

export type AppLocale = 'es' | 'en' | 'pt' | 'zh';

export type ActiveTab = 'home' | 'cards' | 'history' | 'search';

export interface AccentOption {
  id: AccentTheme;
  name: string;
  hex: string;
  colorClass: string;
}

export interface ContactItem {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  maskedAccount: string;
  initials: string;
}

export interface CardItem {
  id: string;
  cardHolder: string;
  cardNumber: string; // e.g. "7820 5500 0835 3501"
  expiry: string; // e.g. "12/30"
  type: 'Credit' | 'Debit';
  brand: 'VISA' | 'MASTERCARD';
  isFrozen: boolean;
  dailyLimit: number;
}

export interface TransactionItem {
  id: string;
  type: 'send' | 'receive' | 'payment' | 'deposit';
  title: string;
  recipientOrSender: string;
  amount: number;
  trxId: string;
  time: string; // e.g. "05:29 PM"
  date: string; // e.g. "2026-10-20"
  category: ExpenseCategory;
  note?: string;
}

export interface UserWallet {
  accountHolder: string;
  username: string;
  avatarUrl?: string;
  accountNumber: string; // e.g. "••••••5890"
  balance: number;
  transferLimit: number;
  currency: Currency;
  weeklyGrowthPercentage: number;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  dueDate: number;
  isPaid: boolean;
  notes?: string;
  iconName: string;
  color: string;
  createdAt: string;
}

export interface MonthlyBudget {
  month: string;
  monthlyIncome: number;
  currency: Currency;
  savingsGoal: number;
}

export type CategoryFilter = 'all' | 'fixed' | 'subscription' | 'leisure';
