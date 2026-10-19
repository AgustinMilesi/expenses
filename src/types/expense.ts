export type ExpenseCategory = 'fixed' | 'subscription' | 'leisure';

export type Currency = 'USD' | 'ARS' | 'EUR';

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  dueDate: number; // Day of the month (1-31)
  isPaid: boolean;
  notes?: string;
  iconName: string; // Ionicons / MaterialCommunityIcons name
  color: string;
  createdAt: string;
}

export interface MonthlyBudget {
  month: string; // e.g. "2026-10"
  monthlyIncome: number;
  currency: Currency;
  savingsGoal: number;
}

export type CategoryFilter = 'all' | ExpenseCategory;
