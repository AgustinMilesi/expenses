import { ExpenseItem, MonthlyBudget } from '../types/expense';

export const DEFAULT_BUDGET: MonthlyBudget = {
  month: '2026-10',
  monthlyIncome: 0,
  currency: 'ARS',
  savingsGoal: 0,
};

export const INITIAL_EXPENSES: ExpenseItem[] = [];
