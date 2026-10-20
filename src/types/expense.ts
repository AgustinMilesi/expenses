export type ExpenseCategory = 'fixed' | 'subscription' | 'leisure' | 'micro';

export type Currency = 'ARS' | 'USD' | 'EUR' | 'CNY' | 'BRL';

export type AppTheme = 'dark' | 'light';

export type AccentTheme = 'lime' | 'emerald' | 'indigo' | 'rose' | 'amber' | 'cyan' | 'violet';

export type AppLocale = 'es' | 'en' | 'pt' | 'zh';

export type ActiveTab = 'home' | 'subs' | 'history' | 'search';

export interface AccentOption {
  id: AccentTheme;
  name: string;
  hex: string;
  colorClass: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  dueDate: number; // Day of month (1-31)
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

export interface QuickCategoryItem {
  id: string;
  title: string;
  category: ExpenseCategory;
  defaultAmount?: number;
  iconName: string;
}

export interface UserPreferences {
  theme: AppTheme;
  accent: AccentTheme;
  locale: AppLocale;
  currency: Currency;
  shakeToUpdate?: boolean;
}

export type CategoryFilter = 'all' | 'fixed' | 'subscription' | 'leisure' | 'micro';
