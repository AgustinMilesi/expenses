import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExpenseItem, MonthlyBudget } from '../types/expense';
import { DEFAULT_BUDGET, INITIAL_EXPENSES } from '../data/mockExpenses';

const EXPENSES_STORAGE_KEY = '@pocket_expenses_items_v1';
const BUDGET_STORAGE_KEY = '@pocket_expenses_budget_v1';

export async function loadExpenses(): Promise<ExpenseItem[]> {
  try {
    const json = await AsyncStorage.getItem(EXPENSES_STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Seed with initial mock data on first launch
    await saveExpenses(INITIAL_EXPENSES);
    return INITIAL_EXPENSES;
  } catch (error) {
    console.warn('Failed to load expenses from AsyncStorage, falling back to mock data:', error);
    return INITIAL_EXPENSES;
  }
}

export async function saveExpenses(items: ExpenseItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save expenses to AsyncStorage:', error);
  }
}

export async function loadBudget(): Promise<MonthlyBudget> {
  try {
    const json = await AsyncStorage.getItem(BUDGET_STORAGE_KEY);
    if (json) {
      return JSON.parse(json);
    }
    await saveBudget(DEFAULT_BUDGET);
    return DEFAULT_BUDGET;
  } catch (error) {
    console.warn('Failed to load budget from AsyncStorage:', error);
    return DEFAULT_BUDGET;
  }
}

export async function saveBudget(budget: MonthlyBudget): Promise<void> {
  try {
    await AsyncStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budget));
  } catch (error) {
    console.error('Failed to save budget to AsyncStorage:', error);
  }
}

export async function resetToDemoData(): Promise<{
  expenses: ExpenseItem[];
  budget: MonthlyBudget;
}> {
  try {
    await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(INITIAL_EXPENSES));
    await AsyncStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(DEFAULT_BUDGET));
  } catch (error) {
    console.error('Failed to reset demo data:', error);
  }
  return { expenses: INITIAL_EXPENSES, budget: DEFAULT_BUDGET };
}
