import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Currency,
  ExpenseItem,
  MonthlyBudget,
  UserPreferences,
  VoutAccount,
} from '../types/expense';

const PREFS_STORAGE_KEY = '@pocket_preferences_v5';
const BUDGET_STORAGE_KEY = '@pocket_budget_v5_live';
const EXPENSES_STORAGE_KEY = '@pocket_expenses_v5_live';
const VOUT_ACCOUNT_STORAGE_KEY = '@vout_account_session_v1';

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  accent: 'lime',
  locale: 'es',
  currency: 'USD',
  shakeToUpdate: true,
  shakeSensitivity: 'firm',
};

// 100% clean operational initial budget: starts at 0 until user inputs their actual income
export const DEFAULT_BUDGET: MonthlyBudget = {
  month: new Date().toISOString().slice(0, 7),
  monthlyIncome: 0,
  currency: 'USD',
  savingsGoal: 0,
};

// 100% clean operational expenses list: zero mock, zero sample, zero dummy numbers
export const INITIAL_EXPENSES: ExpenseItem[] = [];

// Migration / Purge: remove any old mock or sample storage keys from previous builds
export async function purgeLegacyMockData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      '@pocket_expenses_v4',
      '@pocket_expenses_v3',
      '@pocket_budget_v4',
      '@pocket_wallet_state',
    ]);
  } catch (err) {
    // safe ignore
  }
}

// Preferences
export async function loadPreferences(): Promise<UserPreferences> {
  try {
    const raw = await AsyncStorage.getItem(PREFS_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn('Error loading preferences:', err);
  }
  return DEFAULT_PREFERENCES;
}

export async function savePreferences(prefs: UserPreferences): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.error('Error saving preferences:', err);
  }
}

// Budget
export async function loadBudget(): Promise<MonthlyBudget> {
  try {
    await purgeLegacyMockData();
    const raw = await AsyncStorage.getItem(BUDGET_STORAGE_KEY);
    if (raw) {
      const parsed: MonthlyBudget = JSON.parse(raw);
      // If user had the 2500 sample default, reset to clean 0
      if (parsed.monthlyIncome === 2500 && parsed.savingsGoal === 500) {
        return DEFAULT_BUDGET;
      }
      return parsed;
    }
  } catch (err) {
    console.warn('Error loading budget:', err);
  }
  return DEFAULT_BUDGET;
}

export async function saveBudget(budget: MonthlyBudget): Promise<void> {
  try {
    await AsyncStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budget));
  } catch (err) {
    console.error('Error saving budget:', err);
  }
}

// Expenses
export async function loadExpenses(): Promise<ExpenseItem[]> {
  try {
    await purgeLegacyMockData();
    const raw = await AsyncStorage.getItem(EXPENSES_STORAGE_KEY);
    if (raw) {
      const parsed: ExpenseItem[] = JSON.parse(raw);
      // Clean out any leftover dummy items that may have been stored in previous tests
      const cleaned = parsed.filter(
        (item) =>
          !['sub-1', 'sub-2', 'sub-3', 'sub-4', 'fix-1', 'fix-2', 'fix-3', 'mic-1', 'mic-2', 'mic-3'].includes(item.id)
      );
      if (cleaned.length !== parsed.length) {
        await saveExpenses(cleaned);
      }
      return cleaned;
    }
  } catch (err) {
    console.warn('Error loading expenses:', err);
  }
  return [];
}

export async function saveExpenses(expenses: ExpenseItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  } catch (err) {
    console.error('Error saving expenses:', err);
  }
}

export async function clearAllExpenses(): Promise<ExpenseItem[]> {
  try {
    await AsyncStorage.removeItem(EXPENSES_STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing expenses:', err);
  }
  return [];
}

// VOUT ID Unified Account Session
export async function loadVoutAccount(): Promise<VoutAccount | null> {
  try {
    const raw = await AsyncStorage.getItem(VOUT_ACCOUNT_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Error loading Vout account:', err);
  }
  return null;
}

export async function saveVoutAccount(account: VoutAccount | null): Promise<void> {
  try {
    if (!account) {
      await AsyncStorage.removeItem(VOUT_ACCOUNT_STORAGE_KEY);
    } else {
      await AsyncStorage.setItem(VOUT_ACCOUNT_STORAGE_KEY, JSON.stringify(account));
    }
  } catch (err) {
    console.warn('Error saving Vout account:', err);
  }
}
