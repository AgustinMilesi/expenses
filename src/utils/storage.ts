import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Currency,
  ExpenseItem,
  MonthlyBudget,
  UserPreferences,
} from '../types/expense';

const PREFS_STORAGE_KEY = '@pocket_preferences_v4';
const BUDGET_STORAGE_KEY = '@pocket_budget_v4';
const EXPENSES_STORAGE_KEY = '@pocket_expenses_v4';

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  accent: 'lime',
  locale: 'es',
  currency: 'USD',
  shakeToUpdate: true,
};

export const DEFAULT_BUDGET: MonthlyBudget = {
  month: '2026-10',
  monthlyIncome: 2500,
  currency: 'USD',
  savingsGoal: 500,
};

// Initial realistic expenses representing subscriptions, fixed bills, and microgastos
export const INITIAL_EXPENSES: ExpenseItem[] = [
  // Suscripciones
  {
    id: 'sub-1',
    title: 'Netflix 4K',
    amount: 19.99,
    category: 'subscription',
    dueDate: 8,
    isPaid: true,
    notes: 'Streaming familiar',
    iconName: 'film-outline',
    color: '#E50914',
    createdAt: '2026-10-01',
  },
  {
    id: 'sub-2',
    title: 'Spotify Premium',
    amount: 11.99,
    category: 'subscription',
    dueDate: 14,
    isPaid: true,
    notes: 'Música sin anuncios',
    iconName: 'musical-notes-outline',
    color: '#1DB954',
    createdAt: '2026-10-02',
  },
  {
    id: 'sub-3',
    title: 'Gimnasio & Crossfit',
    amount: 45.0,
    category: 'subscription',
    dueDate: 10,
    isPaid: true,
    notes: 'Membresía pase libre',
    iconName: 'barbell-outline',
    color: '#10B981',
    createdAt: '2026-10-02',
  },
  {
    id: 'sub-4',
    title: 'iCloud / Google One',
    amount: 9.99,
    category: 'subscription',
    dueDate: 20,
    isPaid: false,
    notes: 'Almacenamiento 2TB',
    iconName: 'cloud-outline',
    color: '#6366F1',
    createdAt: '2026-10-03',
  },

  // Fijos
  {
    id: 'fix-1',
    title: 'Alquiler Departamento',
    amount: 650.0,
    category: 'fixed',
    dueDate: 5,
    isPaid: true,
    notes: 'Transferencia mensual',
    iconName: 'home-outline',
    color: '#3B82F6',
    createdAt: '2026-10-01',
  },
  {
    id: 'fix-2',
    title: 'Internet Fibra 500MB',
    amount: 35.0,
    category: 'fixed',
    dueDate: 15,
    isPaid: false,
    notes: 'Conexión simétrica',
    iconName: 'wifi-outline',
    color: '#06B6D4',
    createdAt: '2026-10-02',
  },
  {
    id: 'fix-3',
    title: 'Luz y Electricidad',
    amount: 42.0,
    category: 'fixed',
    dueDate: 22,
    isPaid: false,
    notes: 'Factura mensual',
    iconName: 'flash-outline',
    color: '#F59E0B',
    createdAt: '2026-10-04',
  },

  // Microgastos
  {
    id: 'mic-1',
    title: 'Café de Especialidad',
    amount: 4.5,
    category: 'micro',
    dueDate: 20,
    isPaid: true,
    notes: 'Cafetería de paso',
    iconName: 'cafe-outline',
    color: '#C6F827',
    createdAt: '2026-10-20',
  },
  {
    id: 'mic-2',
    title: 'Kiosco / Snacks',
    amount: 3.2,
    category: 'micro',
    dueDate: 20,
    isPaid: true,
    notes: 'Golosinas y agua',
    iconName: 'fast-food-outline',
    color: '#F43F5E',
    createdAt: '2026-10-20',
  },
  {
    id: 'mic-3',
    title: 'Taxi / Uber Corto',
    amount: 8.5,
    category: 'micro',
    dueDate: 19,
    isPaid: true,
    notes: 'Regreso a casa',
    iconName: 'car-outline',
    color: '#06B6D4',
    createdAt: '2026-10-19',
  },
];

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
    const raw = await AsyncStorage.getItem(BUDGET_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
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
    const raw = await AsyncStorage.getItem(EXPENSES_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error loading expenses:', err);
  }
  return INITIAL_EXPENSES;
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
