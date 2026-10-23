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
  autoPaid?: boolean; // Automatically marked as paid when due date arrived
  lastPaidMonth?: string; // YYYY-MM when it was paid for
  notes?: string;
  iconName: string;
  color: string;
  createdAt: string;
}

export type IncomeType = 'fixed_salary' | 'variable_start';

export interface ExtraIncomeItem {
  id: string;
  title: string;
  amount: number;
  createdAt: string;
  notes?: string;
}

export interface MonthlyBudget {
  month: string;
  monthlyIncome: number;
  incomeType?: IncomeType;
  extraIncomes?: ExtraIncomeItem[];
  rolloverSurplus?: number;
  startingBalance?: number;
  reconciledForMonth?: string;
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

export type ShakeSensitivity = 'firm' | 'medium' | 'gentle';

export interface UserPreferences {
  theme: AppTheme;
  accent: AccentTheme;
  locale: AppLocale;
  currency: Currency;
  shakeToUpdate?: boolean;
  shakeSensitivity?: ShakeSensitivity;
}

export interface VoutAccount {
  id: string;
  email: string;
  name: string;
  membershipTier: 'standard' | 'vip' | 'founder';
  memberSince: string;
  linkedEcosystemApps: ('pocket' | 'retail' | 'cargo' | 'inbox')[];
  lastSyncAt: string;
  authToken?: string;
  cloudApiUrl?: string;
}

export type CategoryFilter = 'all' | 'fixed' | 'subscription' | 'leisure' | 'micro';
