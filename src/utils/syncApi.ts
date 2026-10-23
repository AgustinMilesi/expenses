import { VoutAccount, MonthlyBudget, ExpenseItem, ExtraIncomeItem, UserPreferences } from '../types/expense';
import { saveVoutAccount, saveBudget, saveExpenses, savePreferences } from './storage';

export const DEFAULT_VOUT_WEB_URL = 'https://vout-web.vercel.app';

export interface SyncResult {
  success: boolean;
  budget?: MonthlyBudget;
  expenses?: ExpenseItem[];
  extraIncomes?: ExtraIncomeItem[];
  preferences?: UserPreferences;
  error?: string;
}

export async function loginToVoutCloud(
  email: string,
  pass: string,
  apiUrl: string = DEFAULT_VOUT_WEB_URL
): Promise<{ account: VoutAccount | null; error?: string }> {
  try {
    const res = await fetch(`${apiUrl.replace(/\/+$/, '')}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password: pass }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { account: null, error: data.error || 'Credenciales inválidas' };
    }

    const account: VoutAccount = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      membershipTier: data.user.membershipTier || 'vip',
      memberSince: new Date().toISOString().split('T')[0],
      linkedEcosystemApps: ['pocket', 'retail', 'cargo', 'inbox'],
      lastSyncAt: new Date().toLocaleTimeString(),
      authToken: data.token,
      cloudApiUrl: apiUrl,
    };

    await saveVoutAccount(account);
    return { account };
  } catch (err: any) {
    return { account: null, error: 'No se pudo conectar con el servidor VOUT Web' };
  }
}

export async function registerToVoutCloud(
  name: string,
  email: string,
  pass: string,
  apiUrl: string = DEFAULT_VOUT_WEB_URL
): Promise<{ account: VoutAccount | null; error?: string }> {
  try {
    const res = await fetch(`${apiUrl.replace(/\/+$/, '')}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), password: pass }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { account: null, error: data.error || 'Error al registrar cuenta' };
    }

    const account: VoutAccount = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      membershipTier: 'founder',
      memberSince: new Date().toISOString().split('T')[0],
      linkedEcosystemApps: ['pocket', 'retail', 'cargo', 'inbox'],
      lastSyncAt: new Date().toLocaleTimeString(),
      authToken: data.token,
      cloudApiUrl: apiUrl,
    };

    await saveVoutAccount(account);
    return { account };
  } catch (err: any) {
    return { account: null, error: 'No se pudo conectar con el servidor VOUT Web' };
  }
}

export async function syncWithVoutCloud(
  account: VoutAccount,
  localBudget: MonthlyBudget,
  localExpenses: ExpenseItem[],
  localExtra: ExtraIncomeItem[] = [],
  localPrefs?: UserPreferences
): Promise<SyncResult> {
  if (!account.authToken) {
    return { success: false, error: 'Sesión no válida o expirada' };
  }

  const baseUrl = account.cloudApiUrl || DEFAULT_VOUT_WEB_URL;

  try {
    // Convert local expenses to cloud format
    const payload = {
      budget: {
        monthlyNetIncome: localBudget.monthlyIncome,
        incomeType: localBudget.incomeType || 'fixed',
        startingBalance: localBudget.startingBalance || 0,
        currency: localBudget.currency,
      },
      expenses: localExpenses.map((e) => ({
        id: e.id,
        title: e.title,
        amount: e.amount,
        category: e.category,
        dueDate: e.dueDate ?? null,
        isPaid: e.isPaid,
        notes: e.notes ?? null,
      })),
      extraIncomes: localExtra.map((x) => ({
        id: x.id,
        title: x.title,
        amount: x.amount,
        date: x.createdAt || new Date().toISOString(),
      })),
      preferences: localPrefs
        ? {
            currency: localPrefs.currency,
            theme: localPrefs.theme,
            accent: localPrefs.accent,
            locale: localPrefs.locale,
          }
        : undefined,
    };

    const res = await fetch(`${baseUrl.replace(/\/+$/, '')}/api/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${account.authToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || 'Error en respuesta de sincronización' };
    }

    const data = await res.json();

    // Map cloud result back to mobile format
    const updatedBudget: MonthlyBudget = {
      ...localBudget,
      monthlyIncome: data.budget?.monthlyNetIncome ?? localBudget.monthlyIncome,
      incomeType: data.budget?.incomeType ?? localBudget.incomeType,
      startingBalance: data.budget?.startingBalance ?? localBudget.startingBalance,
      currency: data.budget?.currency ?? localBudget.currency,
    };

    const updatedExpenses: ExpenseItem[] = (data.expenses || []).map((e: any) => ({
      id: e.id,
      title: e.title,
      amount: e.amount,
      category: e.category,
      dueDate: e.dueDate,
      isPaid: e.isPaid,
      notes: e.notes,
      createdAt: e.createdAt,
    }));

    const updatedExtras: ExtraIncomeItem[] = (data.extraIncomes || []).map((x: any) => ({
      id: x.id,
      title: x.title,
      amount: x.amount,
      createdAt: x.createdAt || x.date || new Date().toISOString(),
    }));

    // Update local storage
    await Promise.all([
      saveBudget(updatedBudget),
      saveExpenses(updatedExpenses),
      saveVoutAccount({
        ...account,
        lastSyncAt: new Date().toLocaleTimeString(),
      }),
    ]);

    return {
      success: true,
      budget: updatedBudget,
      expenses: updatedExpenses,
      extraIncomes: updatedExtras,
    };
  } catch (err: any) {
    return { success: false, error: 'Fallo de conexión durante la sincronización' };
  }
}
