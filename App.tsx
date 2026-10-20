import './global.css';
import React, { useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  AccentTheme,
  ActiveTab,
  AppLocale,
  AppTheme,
  Currency,
  ExpenseCategory,
  ExpenseItem,
  MonthlyBudget,
} from './src/types/expense';
import {
  loadBudget,
  loadExpenses,
  loadPreferences,
  saveBudget,
  saveExpenses,
  savePreferences,
  DEFAULT_BUDGET,
} from './src/utils/storage';
import { getThemeColors } from './src/utils/theme';
import { getTranslations } from './src/utils/i18n';
import { calculateTotals } from './src/utils/formatters';

// Screen & Modal Components
import { HomeScreen } from './src/components/HomeScreen';
import { AddExpenseScreen } from './src/components/AddExpenseScreen';
import { SubscriptionsScreen } from './src/components/SubscriptionsScreen';
import { HistoryView } from './src/components/HistoryView';
import { SearchView } from './src/components/SearchView';
import { BottomNavBar } from './src/components/BottomNavBar';
import { PreferencesModal } from './src/components/PreferencesModal';
import { EditIncomeModal } from './src/components/EditIncomeModal';
import { AddExpenseModal } from './src/components/AddExpenseModal';
import { LegalModal } from './src/components/LegalModal';
import { UpdateBanner } from './src/components/UpdateBanner';
import { UpdateModal, UpdateTriggerType } from './src/components/UpdateModal';
import { useShakeToUpdate } from './src/hooks/useShakeToUpdate';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Core Data
  const [budget, setBudget] = useState<MonthlyBudget>(DEFAULT_BUDGET);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  // Preferences
  const [theme, setTheme] = useState<AppTheme>('dark');
  const [accent, setAccent] = useState<AccentTheme>('lime');
  const [locale, setLocale] = useState<AppLocale>('es');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [shakeToUpdate, setShakeToUpdate] = useState<boolean>(true);

  // Updates Modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateTriggerType, setUpdateTriggerType] = useState<UpdateTriggerType>('manual');

  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentScreen, setCurrentScreen] = useState<'main' | 'quickExpense'>('main');
  const [quickExpenseCategory, setQuickExpenseCategory] = useState<ExpenseCategory>('micro');

  // Modals
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isEditIncomeOpen, setIsEditIncomeOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | 'cookies' | null>(null);

  // Theme & Translations
  const colors = useMemo(() => getThemeColors(theme, accent), [theme, accent]);
  const t = useMemo(() => getTranslations(locale), [locale]);

  // Handle OTA update triggers (Shake or manual button)
  const handleTriggerUpdate = (type: UpdateTriggerType) => {
    setUpdateTriggerType(type);
    setIsUpdateModalOpen(true);
  };

  // Hardware accelerometer listener for vigorous shake gestures
  useShakeToUpdate(() => {
    handleTriggerUpdate('shake');
  }, { enabled: shakeToUpdate });

  // Load Persisted Data on Startup
  useEffect(() => {
    async function init() {
      try {
        const [loadedPrefs, loadedBudget, loadedExpenses] = await Promise.all([
          loadPreferences(),
          loadBudget(),
          loadExpenses(),
        ]);

        setTheme(loadedPrefs.theme);
        setAccent(loadedPrefs.accent || 'lime');
        setLocale(loadedPrefs.locale);
        setCurrency(loadedPrefs.currency);
        setShakeToUpdate(loadedPrefs.shakeToUpdate !== false);

        setBudget({
          ...loadedBudget,
          currency: loadedPrefs.currency || loadedBudget.currency,
        });
        setExpenses(loadedExpenses);
      } catch (err) {
        console.error('Error during initialization:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Preference Handlers
  const handleSelectTheme = async (newTheme: AppTheme) => {
    setTheme(newTheme);
    await savePreferences({ theme: newTheme, accent, locale, currency, shakeToUpdate });
  };

  const handleSelectAccent = async (newAccent: AccentTheme) => {
    setAccent(newAccent);
    await savePreferences({ theme, accent: newAccent, locale, currency, shakeToUpdate });
  };

  const handleSelectLocale = async (newLocale: AppLocale) => {
    setLocale(newLocale);
    await savePreferences({ theme, accent, locale: newLocale, currency, shakeToUpdate });
  };

  const handleSelectCurrency = async (newCurrency: Currency) => {
    setCurrency(newCurrency);
    const updatedBudget = { ...budget, currency: newCurrency };
    setBudget(updatedBudget);
    await Promise.all([
      savePreferences({ theme, accent, locale, currency: newCurrency, shakeToUpdate }),
      saveBudget(updatedBudget),
    ]);
  };

  const handleToggleShakeToUpdate = async (enabled: boolean) => {
    setShakeToUpdate(enabled);
    await savePreferences({ theme, accent, locale, currency, shakeToUpdate: enabled });
  };

  // Expense Handlers
  const handleSaveExpense = async (newItem: Omit<ExpenseItem, 'id' | 'createdAt'>) => {
    const created: ExpenseItem = {
      ...newItem,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [created, ...expenses];
    setExpenses(updated);
    await saveExpenses(updated);

    Alert.alert(
      t.expenseSavedTitle,
      t.expenseSavedMsg(`$${newItem.amount.toFixed(2)}`, newItem.title),
      [{ text: 'OK', onPress: () => setCurrentScreen('main') }]
    );
  };

  const handleTogglePaid = async (expenseId: string) => {
    const updated = expenses.map((e) =>
      e.id === expenseId ? { ...e, isPaid: !e.isPaid } : e
    );
    setExpenses(updated);
    await saveExpenses(updated);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    const updated = expenses.filter((e) => e.id !== expenseId);
    setExpenses(updated);
    await saveExpenses(updated);
  };

  const handleMarkAllPaid = async () => {
    const updated = expenses.map((e) => ({ ...e, isPaid: true }));
    setExpenses(updated);
    await saveExpenses(updated);
    Alert.alert('Suscripciones al día', 'Todas las suscripciones y gastos fijos se marcaron como pagados.');
  };

  const handleSaveIncome = async (newIncome: number) => {
    const updatedBudget = { ...budget, monthlyIncome: newIncome };
    setBudget(updatedBudget);
    await saveBudget(updatedBudget);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <UpdateBanner colors={colors} locale={locale} />

        {/* View Switcher: Quick Expense Screen vs Main Tab Navigation */}
        {currentScreen === 'quickExpense' ? (
          <AddExpenseScreen
            budget={budget}
            expenses={expenses}
            currency={currency}
            colors={colors}
            locale={locale}
            initialCategory={quickExpenseCategory}
            onBack={() => setCurrentScreen('main')}
            onOpenNotifications={() => Alert.alert(t.notifications, 'No hay alertas pendientes.')}
            onSaveExpense={handleSaveExpense}
          />
        ) : (
          <View style={styles.contentWrapper}>
            {/* 1. Dashboard (Home) */}
            {activeTab === 'home' && (
              <HomeScreen
                budget={budget}
                expenses={expenses}
                currency={currency}
                colors={colors}
                locale={locale}
                onOpenPreferences={() => setIsPreferencesOpen(true)}
                onOpenNotifications={() => Alert.alert(t.notifications, 'Gastos y suscripciones al día.')}
                onOpenEditIncome={() => setIsEditIncomeOpen(true)}
                onNavigateToAddExpense={(cat) => {
                  setQuickExpenseCategory(cat || 'micro');
                  setCurrentScreen('quickExpense');
                }}
                onNavigateToSubs={() => setActiveTab('subs')}
                onTogglePaid={handleTogglePaid}
                onDeleteExpense={handleDeleteExpense}
                onAddSubscription={() => {
                  setQuickExpenseCategory('subscription');
                  setIsAddExpenseModalOpen(true);
                }}
                onCheckUpdates={() => handleTriggerUpdate('manual')}
              />
            )}

            {/* 2. Subscriptions & Fixed Bills */}
            {activeTab === 'subs' && (
              <SubscriptionsScreen
                budget={budget}
                expenses={expenses}
                currency={currency}
                colors={colors}
                locale={locale}
                onBack={() => setActiveTab('home')}
                onOpenNotifications={() => Alert.alert(t.notifications, 'Sin alertas de vencimiento.')}
                onNavigateToAddExpense={() => {
                  setQuickExpenseCategory('subscription');
                  setCurrentScreen('quickExpense');
                }}
                onTogglePaid={handleTogglePaid}
                onAddSubscription={() => {
                  setQuickExpenseCategory('subscription');
                  setIsAddExpenseModalOpen(true);
                }}
                onMarkAllPaid={handleMarkAllPaid}
                onOpenEditIncome={() => setIsEditIncomeOpen(true)}
                onDeleteExpense={handleDeleteExpense}
              />
            )}

            {/* 3. History */}
            {activeTab === 'history' && (
              <HistoryView
                expenses={expenses}
                currency={currency}
                colors={colors}
                locale={locale}
                onOpenPreferences={() => setIsPreferencesOpen(true)}
                onTogglePaid={handleTogglePaid}
                onClearHistory={async () => {
                  setExpenses([]);
                  await saveExpenses([]);
                }}
              />
            )}

            {/* 4. Search */}
            {activeTab === 'search' && (
              <SearchView
                expenses={expenses}
                currency={currency}
                colors={colors}
                locale={locale}
                onTogglePaid={handleTogglePaid}
              />
            )}

            {/* Floating Cyber Lime Navigation Dock */}
            <BottomNavBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onOpenQuickExpense={() => {
                setQuickExpenseCategory('micro');
                setCurrentScreen('quickExpense');
              }}
              colors={colors}
              locale={locale}
            />
          </View>
        )}

        {/* 1. Cross-Project Preferences Block / Modal ("El cuadro de cambiar idioma, moneda y theme") */}
        <PreferencesModal
          visible={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
          currentAccent={accent}
          onSelectAccent={handleSelectAccent}
          currentLocale={locale}
          onSelectLocale={handleSelectLocale}
          currentCurrency={currency}
          onSelectCurrency={handleSelectCurrency}
          shakeToUpdate={shakeToUpdate}
          onToggleShakeToUpdate={handleToggleShakeToUpdate}
          onCheckUpdates={() => handleTriggerUpdate('manual')}
          onOpenLegal={(type) => {
            setIsPreferencesOpen(false);
            setLegalModalType(type);
          }}
          colors={colors}
        />

        {/* 2. Edit Monthly Income Modal */}
        <EditIncomeModal
          visible={isEditIncomeOpen}
          currentIncome={budget.monthlyIncome}
          currency={currency}
          locale={locale}
          colors={colors}
          onClose={() => setIsEditIncomeOpen(false)}
          onSave={handleSaveIncome}
        />

        {/* 3. Detailed Add Expense / Subscription Modal */}
        <AddExpenseModal
          visible={isAddExpenseModalOpen}
          currency={currency}
          locale={locale}
          colors={colors}
          onClose={() => setIsAddExpenseModalOpen(false)}
          onSave={handleSaveExpense}
        />

        {/* 4. In-App Legal & Compliance Modal */}
        <LegalModal
          visible={legalModalType !== null}
          onClose={() => setLegalModalType(null)}
          type={legalModalType}
          locale={locale}
          colors={colors}
        />

        {/* 5. Live Over-The-Air Update Modal (Manual or Shake Triggered) */}
        <UpdateModal
          visible={isUpdateModalOpen}
          triggerType={updateTriggerType}
          colors={colors}
          locale={locale}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
});
