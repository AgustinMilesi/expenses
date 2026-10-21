import './global.css';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet, BackHandler, ToastAndroid, Platform } from 'react-native';
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
  ExtraIncomeItem,
  IncomeType,
  MonthlyBudget,
  ShakeSensitivity,
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
import { FixedExpensesModal } from './src/components/FixedExpensesModal';
import { AddExtraIncomeModal } from './src/components/AddExtraIncomeModal';
import { MonthReconciliationModal } from './src/components/MonthReconciliationModal';
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
  const [shakeSensitivity, setShakeSensitivity] = useState<ShakeSensitivity>('firm');

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
  const [isFixedExpensesModalOpen, setIsFixedExpensesModalOpen] = useState(false);
  const [isAddExtraIncomeOpen, setIsAddExtraIncomeOpen] = useState(false);
  const [isReconciliationModalOpen, setIsReconciliationModalOpen] = useState(false);
  const [theoreticalLeftover, setTheoreticalLeftover] = useState(0);
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
  }, { enabled: shakeToUpdate, sensitivity: shakeSensitivity });

  // Android Native Back Button & Gesture Handler (Double Back to Exit & Single Back to Dashboard)
  const lastBackPressRef = useRef<number>(0);

  const isAnyModalOpen =
    isUpdateModalOpen ||
    legalModalType !== null ||
    isPreferencesOpen ||
    isEditIncomeOpen ||
    isAddExpenseModalOpen ||
    isFixedExpensesModalOpen ||
    isAddExtraIncomeOpen ||
    isReconciliationModalOpen;

  useEffect(() => {
    const handleHardwareBackPress = () => {
      // 1. If any modal is active, let the modal's onRequestClose manage safe exit
      if (isAnyModalOpen) {
        return false;
      }

      // 2. If inside quickExpense screen, let AddExpenseScreen handle it (with dirty prompt)
      if (currentScreen === 'quickExpense') {
        return false;
      }

      // 3. If on any tab other than Home (Subs, History, Search), 1 gesture returns to Dashboard
      if (activeTab !== 'home') {
        setActiveTab('home');
        return true;
      }

      // 4. If already on Home Dashboard: require double back gesture within 2s to exit app
      const now = Date.now();
      if (now - lastBackPressRef.current < 2000) {
        BackHandler.exitApp();
        return true;
      }

      lastBackPressRef.current = now;
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          locale === 'es' ? 'Presioná de nuevo para salir de VOUT' : 'Press back again to exit VOUT',
          ToastAndroid.SHORT
        );
      }
      return true;
    };

    const backSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleHardwareBackPress
    );

    return () => backSubscription.remove();
  }, [isAnyModalOpen, currentScreen, activeTab, locale]);

  // Load Persisted Data on Startup with Auto-Pay & Rollover Detection
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
        setShakeSensitivity(loadedPrefs.shakeSensitivity || 'firm');

        const currentMonth = new Date().toISOString().slice(0, 7);
        const todayDay = new Date().getDate();

        let initialBudget: MonthlyBudget = {
          ...loadedBudget,
          currency: loadedPrefs.currency || loadedBudget.currency,
        };

        let initialExpenses = [...loadedExpenses];

        // 1. Month Transition & Leftover Rollover check
        const isMonthTransition = Boolean(
          loadedBudget.month &&
          loadedBudget.month !== currentMonth &&
          loadedBudget.reconciledForMonth !== currentMonth
        );

        if (isMonthTransition) {
          const prevExtraTotal = (loadedBudget.extraIncomes || []).reduce(
            (sum, e) => sum + (e.amount || 0),
            0
          );
          const prevTotalLiquidity =
            (loadedBudget.monthlyIncome || 0) +
            (loadedBudget.rolloverSurplus || 0) +
            prevExtraTotal;
          const prevTotalSpent = loadedExpenses.reduce(
            (sum, e) => sum + (e.amount || 0),
            0
          );
          const surplus = Math.max(0, prevTotalLiquidity - prevTotalSpent);

          setTheoreticalLeftover(surplus);
          setIsReconciliationModalOpen(true);

          // Reset recurring expenses for new month: auto-pay if due date has already passed
          initialExpenses = initialExpenses.map((item) => {
            if (item.category === 'subscription' || item.category === 'fixed') {
              const isPastDue = item.dueDate <= todayDay;
              return {
                ...item,
                isPaid: isPastDue,
                autoPaid: isPastDue,
                lastPaidMonth: isPastDue ? currentMonth : undefined,
              };
            }
            return item;
          });
          await saveExpenses(initialExpenses);
        } else {
          // 2. Same month: evaluate auto-pay for subscriptions and fixed expenses
          let hasAutoPaidUpdates = false;
          initialExpenses = initialExpenses.map((item) => {
            if (
              (item.category === 'subscription' || item.category === 'fixed') &&
              item.dueDate <= todayDay &&
              !item.isPaid
            ) {
              hasAutoPaidUpdates = true;
              return {
                ...item,
                isPaid: true,
                autoPaid: true,
                lastPaidMonth: currentMonth,
              };
            }
            return item;
          });

          if (hasAutoPaidUpdates) {
            await saveExpenses(initialExpenses);
          }
        }

        setBudget(initialBudget);
        setExpenses(initialExpenses);
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
    await savePreferences({ theme: newTheme, accent, locale, currency, shakeToUpdate, shakeSensitivity });
  };

  const handleSelectAccent = async (newAccent: AccentTheme) => {
    setAccent(newAccent);
    await savePreferences({ theme, accent: newAccent, locale, currency, shakeToUpdate, shakeSensitivity });
  };

  const handleSelectLocale = async (newLocale: AppLocale) => {
    setLocale(newLocale);
    await savePreferences({ theme, accent, locale: newLocale, currency, shakeToUpdate, shakeSensitivity });
  };

  const handleSelectCurrency = async (newCurrency: Currency) => {
    setCurrency(newCurrency);
    const updatedBudget = { ...budget, currency: newCurrency };
    setBudget(updatedBudget);
    await Promise.all([
      savePreferences({ theme, accent, locale, currency: newCurrency, shakeToUpdate, shakeSensitivity }),
      saveBudget(updatedBudget),
    ]);
  };

  const handleToggleShakeToUpdate = async (enabled: boolean) => {
    setShakeToUpdate(enabled);
    await savePreferences({ theme, accent, locale, currency, shakeToUpdate: enabled, shakeSensitivity });
  };

  const handleSelectShakeSensitivity = async (newSens: ShakeSensitivity) => {
    setShakeSensitivity(newSens);
    await savePreferences({ theme, accent, locale, currency, shakeToUpdate, shakeSensitivity: newSens });
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

  const handleSaveIncome = async (newIncome: number, incomeType: IncomeType) => {
    const updatedBudget: MonthlyBudget = { ...budget, monthlyIncome: newIncome, incomeType };
    setBudget(updatedBudget);
    await saveBudget(updatedBudget);
  };

  const handleAddExtraIncome = async (newItem: Omit<ExtraIncomeItem, 'id' | 'createdAt'>) => {
    const created: ExtraIncomeItem = {
      ...newItem,
      id: `extra-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updatedExtras = [created, ...(budget.extraIncomes || [])];
    const updatedBudget: MonthlyBudget = {
      ...budget,
      extraIncomes: updatedExtras,
    };
    setBudget(updatedBudget);
    await saveBudget(updatedBudget);
    Alert.alert(
      locale === 'es' ? '¡Dinero extra añadido!' : 'Extra money added!',
      locale === 'es'
        ? `Se sumaron +$${newItem.amount.toFixed(2)} a tu saldo disponible.`
        : `+$${newItem.amount.toFixed(2)} added to available balance.`
    );
  };

  const handleDeleteExtraIncome = async (id: string) => {
    const updatedExtras = (budget.extraIncomes || []).filter((e) => e.id !== id);
    const updatedBudget: MonthlyBudget = { ...budget, extraIncomes: updatedExtras };
    setBudget(updatedBudget);
    await saveBudget(updatedBudget);
  };

  const handleAddFixedExpense = async (newItem: Omit<ExpenseItem, 'id' | 'createdAt'>) => {
    const created: ExpenseItem = {
      ...newItem,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [created, ...expenses];
    setExpenses(updated);
    await saveExpenses(updated);
    Alert.alert(
      locale === 'es' ? 'Gasto fijo guardado' : 'Fixed expense saved',
      locale === 'es'
        ? `Se agregó "${newItem.title}" por $${newItem.amount.toFixed(2)}.`
        : `"${newItem.title}" ($${newItem.amount.toFixed(2)}) added.`
    );
  };

  const handleConfirmReconciliationExact = async () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const updatedBudget: MonthlyBudget = {
      ...budget,
      month: currentMonth,
      rolloverSurplus: theoreticalLeftover,
      reconciledForMonth: currentMonth,
      extraIncomes: [],
    };
    setBudget(updatedBudget);
    await saveBudget(updatedBudget);
    setIsReconciliationModalOpen(false);
  };

  const handleAdjustRealLeftover = async (actualAmount: number) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const updatedBudget: MonthlyBudget = {
      ...budget,
      month: currentMonth,
      rolloverSurplus: actualAmount,
      reconciledForMonth: currentMonth,
      extraIncomes: [],
    };
    setBudget(updatedBudget);
    await saveBudget(updatedBudget);
    setIsReconciliationModalOpen(false);
  };

  const handleManualTriggerReconciliation = () => {
    const totals = calculateTotals(expenses, budget);
    setTheoreticalLeftover(totals.remainingBalance);
    setIsReconciliationModalOpen(true);
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
                onOpenFixedExpenses={() => setIsFixedExpensesModalOpen(true)}
                onOpenAddExtraIncome={() => setIsAddExtraIncomeOpen(true)}
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
          shakeSensitivity={shakeSensitivity}
          onSelectShakeSensitivity={handleSelectShakeSensitivity}
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
          currentIncomeType={budget.incomeType || 'fixed_salary'}
          currency={currency}
          locale={locale}
          colors={colors}
          onClose={() => setIsEditIncomeOpen(false)}
          onSave={handleSaveIncome}
          onTriggerReconciliation={handleManualTriggerReconciliation}
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

        {/* 4. Dedicated Fixed Expenses Sheet / Modal */}
        <FixedExpensesModal
          visible={isFixedExpensesModalOpen}
          expenses={expenses}
          currency={currency}
          locale={locale}
          colors={colors}
          onClose={() => setIsFixedExpensesModalOpen(false)}
          onAddFixedExpense={handleAddFixedExpense}
          onTogglePaid={handleTogglePaid}
          onDeleteExpense={handleDeleteExpense}
        />

        {/* 5. Add Extra Income / Gift Modal */}
        <AddExtraIncomeModal
          visible={isAddExtraIncomeOpen}
          extraIncomes={budget.extraIncomes || []}
          currency={currency}
          locale={locale}
          colors={colors}
          onClose={() => setIsAddExtraIncomeOpen(false)}
          onAddExtraIncome={handleAddExtraIncome}
          onDeleteExtraIncome={handleDeleteExtraIncome}
        />

        {/* 6. Month End Rollover & Reconciliation Modal */}
        <MonthReconciliationModal
          visible={isReconciliationModalOpen}
          theoreticalLeftover={theoreticalLeftover}
          currency={currency}
          locale={locale}
          colors={colors}
          onConfirmExact={handleConfirmReconciliationExact}
          onAdjustRealLeftover={handleAdjustRealLeftover}
          onClose={() => setIsReconciliationModalOpen(false)}
        />

        {/* 7. In-App Legal & Compliance Modal */}
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
