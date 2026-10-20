import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AccentTheme,
  AppLocale,
  AppTheme,
  CardItem,
  ContactItem,
  Currency,
  TransactionItem,
  UserWallet,
} from '../types/expense';

const PREFS_STORAGE_KEY = '@wallet_preferences_v3';
const WALLET_STORAGE_KEY = '@wallet_user_data_v3';
const TRANSACTIONS_STORAGE_KEY = '@wallet_transactions_v3';
const CONTACTS_STORAGE_KEY = '@wallet_contacts_v3';
const CARDS_STORAGE_KEY = '@wallet_cards_v3';

export interface UserPreferences {
  theme: AppTheme;
  accent: AccentTheme;
  locale: AppLocale;
  currency: Currency;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  accent: 'lime',
  locale: 'es',
  currency: 'USD',
};

export const INITIAL_WALLET: UserWallet = {
  accountHolder: 'Janvis David',
  username: 'janvisd',
  accountNumber: '••••••5890',
  balance: 23590.73,
  transferLimit: 10000.0,
  currency: 'USD',
  weeklyGrowthPercentage: 24,
};

export const INITIAL_CONTACTS: ContactItem[] = [
  {
    id: 'c1',
    name: 'Alina',
    handle: '@alina',
    maskedAccount: '••••46',
    initials: 'AL',
  },
  {
    id: 'c2',
    name: 'Mark',
    handle: '@mark_k',
    maskedAccount: '••••37',
    initials: 'MK',
  },
  {
    id: 'c3',
    name: 'Rachel',
    handle: '@rachel',
    maskedAccount: '••••81',
    initials: 'RC',
  },
  {
    id: 'c4',
    name: 'Kuraishi',
    handle: '@kuraishi',
    maskedAccount: '••••19',
    initials: 'KH',
  },
];

export const INITIAL_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'tx-1',
    type: 'send',
    title: 'Send Money to Kuraishi H.',
    recipientOrSender: 'Kuraishi H.',
    amount: 450.0,
    trxId: 'CJ4901TUZ0',
    time: '05:29 PM',
    date: 'Today',
    category: 'transfer',
  },
  {
    id: 'tx-2',
    type: 'receive',
    title: 'Receive from Alina',
    recipientOrSender: 'Alina',
    amount: 1250.0,
    trxId: 'CJ790Z8UX4',
    time: '12:37 PM',
    date: 'Today',
    category: 'income',
  },
];

export const INITIAL_CARDS: CardItem[] = [
  {
    id: 'card-1',
    cardHolder: 'Janvis David',
    cardNumber: '7820 5500 0835 3501',
    expiry: '12/30',
    type: 'Credit',
    brand: 'VISA',
    isFrozen: false,
    dailyLimit: 5000,
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

// Wallet
export async function loadWallet(): Promise<UserWallet> {
  try {
    const raw = await AsyncStorage.getItem(WALLET_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error loading wallet:', err);
  }
  return INITIAL_WALLET;
}

export async function saveWallet(wallet: UserWallet): Promise<void> {
  try {
    await AsyncStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
  } catch (err) {
    console.error('Error saving wallet:', err);
  }
}

// Transactions
export async function loadTransactions(): Promise<TransactionItem[]> {
  try {
    const raw = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error loading transactions:', err);
  }
  return INITIAL_TRANSACTIONS;
}

export async function saveTransactions(transactions: TransactionItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error('Error saving transactions:', err);
  }
}

// Contacts
export async function loadContacts(): Promise<ContactItem[]> {
  try {
    const raw = await AsyncStorage.getItem(CONTACTS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error loading contacts:', err);
  }
  return INITIAL_CONTACTS;
}

export async function saveContacts(contacts: ContactItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
  } catch (err) {
    console.error('Error saving contacts:', err);
  }
}

// Cards
export async function loadCards(): Promise<CardItem[]> {
  try {
    const raw = await AsyncStorage.getItem(CARDS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error loading cards:', err);
  }
  return INITIAL_CARDS;
}

export async function saveCards(cards: CardItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
  } catch (err) {
    console.error('Error saving cards:', err);
  }
}
