import './global.css';
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CategoryFilter, Currency, ExpenseItem, MonthlyBudget } from './src/types/expense';
import { calculateTotals } from './src/utils/formatters';
import {
  loadBudget,
  loadExpenses,
  resetToDemoData,
  saveBudget,
  saveExpenses,
} from './src/utils/storage';
import { Header } from './src/components/Header';
import { BudgetSummaryCard } from './src/components/BudgetSummaryCard';
import { CategoryPills } from './src/components/CategoryPills';
import { SpendingBreakdown } from './src/components/SpendingBreakdown';
import { ExpenseCard } from './src/components/ExpenseCard';
import { AddExpenseModal } from './src/components/AddExpenseModal';
import { EditIncomeModal } from './src/components/EditIncomeModal';
import { DEFAULT_BUDGET } from './src/data/mockExpenses';

export default function App() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [budget, setBudget] = useState<MonthlyBudget>(DEFAULT_BUDGET);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  // Initialize storage
  useEffect(() => {
    async function init() {
      try {
        const [loadedExpenses, loadedBudget] = await Promise.all([
          loadExpenses(),
          loadBudget(),
        ]);
        setExpenses(loadedExpenses);
        setBudget(loadedBudget);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Totals calculations
  const totals = useMemo(() => calculateTotals(expenses), [expenses]);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [expenses, selectedCategory, searchQuery]);

  // Toggle paid status
  const handleTogglePaid = async (id: string) => {
    const updated = expenses.map((item) =>
      item.id === id ? { ...item, isPaid: !item.isPaid } : item
    );
    setExpenses(updated);
    await saveExpenses(updated);
  };

  // Delete expense
  const handleDeleteExpense = (id: string) => {
    const confirmDelete = async () => {
      const updated = expenses.filter((item) => item.id !== id);
      setExpenses(updated);
      await saveExpenses(updated);
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this expense?')) {
        confirmDelete();
      }
    } else {
      Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete },
      ]);
    }
  };

  // Add new expense
  const handleAddExpense = async (
    itemData: Omit<ExpenseItem, 'id' | 'createdAt'>
  ) => {
    const newExpense: ExpenseItem = {
      ...itemData,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    await saveExpenses(updated);
  };

  // Cycle currency (USD -> ARS -> EUR -> USD)
  const handleToggleCurrency = async () => {
    const currencies: Currency[] = ['USD', 'ARS', 'EUR'];
    const nextIdx = (currencies.indexOf(budget.currency) + 1) % currencies.length;
    const nextCurrency = currencies[nextIdx];
    const updated = { ...budget, currency: nextCurrency };
    setBudget(updated);
    await saveBudget(updated);
  };

  // Update monthly income
  const handleSaveIncome = async (newIncome: number) => {
    const updated = { ...budget, monthlyIncome: newIncome };
    setBudget(updated);
    await saveBudget(updated);
  };

  // Reset to initial demo data
  const handleResetDemo = () => {
    const performReset = async () => {
      const { expenses: resExpenses, budget: resBudget } = await resetToDemoData();
      setExpenses(resExpenses);
      setBudget(resBudget);
      setSelectedCategory('all');
      setSearchQuery('');
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Reset all expenses back to default demo state?')) {
        performReset();
      }
    } else {
      Alert.alert(
        'Reset Demo Data',
        'Reload the full sample dataset of fixed bills, subscriptions, and leisure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reset', style: 'destructive', onPress: performReset },
        ]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />

      {/* Header with quick controls */}
      <Header
        currentCurrency={budget.currency}
        onToggleCurrency={handleToggleCurrency}
        onResetDemo={handleResetDemo}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="text-xs text-slate-400 mt-2 font-medium">Loading budget...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Main Financial Summary Card */}
          <BudgetSummaryCard
            budget={budget}
            totals={totals}
            currency={budget.currency}
            onEditIncome={() => setIsIncomeModalOpen(true)}
          />

          {/* Category Distribution / Proportions */}
          <SpendingBreakdown totals={totals} currency={budget.currency} />

          {/* Filter Pills */}
          <CategoryPills
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            totals={totals}
          />

          {/* Search & Counter Bar */}
          <View className="mx-5 mb-3 flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center px-3 py-2 rounded-xl bg-card border border-white/5 mr-3">
              <Ionicons name="search-outline" size={15} color="#94A3B8" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search bills, subscriptions, outings..."
                placeholderTextColor="#64748B"
                className="flex-1 ml-2 text-xs text-white"
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={15} color="#94A3B8" />
                </TouchableOpacity>
              ) : null}
            </View>

            <Text className="text-xs font-bold text-slate-400">
              {filteredExpenses.length} {filteredExpenses.length === 1 ? 'item' : 'items'}
            </Text>
          </View>

          {/* Expenses List */}
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((item) => (
              <ExpenseCard
                key={item.id}
                item={item}
                currency={budget.currency}
                onTogglePaid={handleTogglePaid}
                onDelete={handleDeleteExpense}
              />
            ))
          ) : (
            <View className="mx-5 my-8 p-8 rounded-2xl bg-card border border-dashed border-white/10 items-center justify-center">
              <Ionicons name="wallet-outline" size={36} color="#64748B" />
              <Text className="text-sm font-bold text-slate-300 mt-2">
                No expenses found
              </Text>
              <Text className="text-xs text-slate-500 text-center mt-1">
                {searchQuery
                  ? 'No results matched your search query.'
                  : 'No expenses logged in this category yet.'}
              </Text>
              <TouchableOpacity
                onPress={() => setIsAddModalOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-primary"
              >
                <Text className="text-xs font-bold text-white uppercase">Add First Expense</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* Add Expense Modal */}
      <AddExpenseModal
        visible={isAddModalOpen}
        currency={budget.currency}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddExpense}
      />

      {/* Edit Income Modal */}
      <EditIncomeModal
        visible={isIncomeModalOpen}
        currentIncome={budget.monthlyIncome}
        currency={budget.currency}
        onClose={() => setIsIncomeModalOpen(false)}
        onSave={handleSaveIncome}
      />
    </SafeAreaView>
  );
}
