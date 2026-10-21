import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  CategoryFilter,
  Currency,
  ExpenseCategory,
  ExpenseItem,
  MonthlyBudget,
} from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { calculateTotals, formatCurrency } from '../utils/formatters';
import { getTranslations } from '../utils/i18n';

interface HomeScreenProps {
  budget: MonthlyBudget;
  expenses: ExpenseItem[];
  currency: Currency;
  colors: ThemeColors;
  locale: any;
  onOpenPreferences: () => void;
  onOpenNotifications: () => void;
  onOpenEditIncome: () => void;
  onNavigateToAddExpense: (prefilledCategory?: ExpenseCategory) => void;
  onNavigateToSubs: () => void;
  onTogglePaid: (expenseId: string) => void;
  onDeleteExpense: (expenseId: string) => void;
  onAddSubscription: () => void;
  onCheckUpdates: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  budget,
  expenses,
  currency,
  colors,
  locale,
  onOpenPreferences,
  onOpenNotifications,
  onOpenEditIncome,
  onNavigateToAddExpense,
  onNavigateToSubs,
  onTogglePaid,
  onDeleteExpense,
  onAddSubscription,
  onCheckUpdates,
}) => {
  const t = getTranslations(locale);
  const totals = calculateTotals(expenses, budget.monthlyIncome);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<CategoryFilter>('all');

  // Subscriptions list for the horizontal carousel
  const subscriptions = expenses.filter((e) => e.category === 'subscription');

  // Filtered expenses list
  const filteredExpenses = expenses.filter((e) => {
    if (activeCategoryFilter === 'all') return true;
    return e.category === activeCategoryFilter;
  });

  const getCategoryIcon = (category: ExpenseCategory) => {
    switch (category) {
      case 'micro':
        return 'cafe-outline';
      case 'subscription':
        return 'repeat-outline';
      case 'fixed':
        return 'home-outline';
      case 'leisure':
        return 'beer-outline';
      default:
        return 'receipt-outline';
    }
  };

  const getCategoryColor = (category: ExpenseCategory) => {
    switch (category) {
      case 'micro':
        return colors.lime;
      case 'subscription':
        return '#8B5CF6';
      case 'fixed':
        return '#3B82F6';
      case 'leisure':
        return '#F43F5E';
      default:
        return colors.textMuted;
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={onOpenPreferences}
          style={styles.profileButton}
          activeOpacity={0.8}
        >
          <View style={[styles.profileAvatar, { backgroundColor: colors.card, borderColor: colors.lime }]}>
            <Ionicons name="person" size={20} color={colors.lime} />
          </View>
          <View>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {t.appName}
            </Text>
            <Text style={[styles.profileTagline, { color: colors.textMuted }]}>
              {t.appTagline}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            onPress={onCheckUpdates}
            style={[styles.headerIconBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            activeOpacity={0.8}
          >
            <Ionicons name="cloud-download-outline" size={18} color={colors.lime} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onOpenPreferences}
            style={[styles.headerIconBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            activeOpacity={0.8}
          >
            <Ionicons name="options-outline" size={18} color={colors.lime} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onOpenNotifications}
            style={[styles.headerIconBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            activeOpacity={0.8}
          >
            <Ionicons name="notifications-outline" size={18} color={colors.lime} />
            <View style={[styles.notificationDot, { backgroundColor: colors.danger }]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Main Hero Disposable Balance Neon Lime Card */}
        <View style={[styles.heroCard, { backgroundColor: colors.lime }]}>
          {/* Card Top Row */}
          <View style={styles.heroTopRow}>
            <Text style={[styles.heroLabel, { color: colors.limeText }]}>
              {t.remainingBalance}
            </Text>
            <TouchableOpacity
              onPress={onOpenEditIncome}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="ellipsis-horizontal" size={22} color={colors.limeText} />
            </TouchableOpacity>
          </View>

          {/* Amount and Trend Badge */}
          <View style={styles.heroAmountRow}>
            <Text style={[styles.heroAmountText, { color: colors.limeText }]}>
              {formatCurrency(totals.remainingBalance, currency)}
            </Text>
            <View style={[styles.healthBadge, { backgroundColor: colors.card }]}>
              <Ionicons
                name={totals.percentageUsed > 85 ? 'warning-outline' : 'shield-checkmark-outline'}
                size={13}
                color={totals.percentageUsed > 85 ? colors.danger : colors.lime}
              />
              <Text style={[styles.healthBadgeText, { color: colors.lime }]}>
                {100 - totals.percentageUsed}% {t.safeToSpend}
              </Text>
            </View>
          </View>

          {/* Subtitle with Income & Committed Breakdown */}
          <TouchableOpacity
            onPress={onOpenEditIncome}
            activeOpacity={0.7}
          >
            <Text style={[styles.heroBreakdownText, { color: 'rgba(12, 16, 8, 0.75)' }]}>
              {budget.monthlyIncome === 0
                ? (locale === 'es'
                    ? '⚡ Tocá acá para definir tu ingreso mensual'
                    : '⚡ Tap here to define your monthly income')
                : `${t.monthlyIncome}: ${formatCurrency(budget.monthlyIncome, currency)} • ${t.totalCommitted}: ${formatCurrency(totals.total, currency)}`}
            </Text>
          </TouchableOpacity>

          {/* 4 Action Buttons inside Lime Card */}
          <View style={styles.heroActionsRow}>
            {/* 1. + Gasto / Microgasto */}
            <View style={styles.heroActionItem}>
              <TouchableOpacity
                onPress={() => onNavigateToAddExpense()}
                style={[styles.heroActionCircle, { backgroundColor: colors.card }]}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={24} color={colors.lime} />
              </TouchableOpacity>
              <Text style={[styles.heroActionLabel, { color: colors.limeText }]}>
                {t.addExpenseAction}
              </Text>
            </View>

            {/* 2. Suscripciones */}
            <View style={styles.heroActionItem}>
              <TouchableOpacity
                onPress={onNavigateToSubs}
                style={[styles.heroActionCircle, { backgroundColor: colors.card }]}
                activeOpacity={0.8}
              >
                <Ionicons name="repeat-outline" size={20} color={colors.lime} />
              </TouchableOpacity>
              <Text style={[styles.heroActionLabel, { color: colors.limeText }]}>
                {t.subsAction}
              </Text>
            </View>

            {/* 3. Fijos */}
            <View style={styles.heroActionItem}>
              <TouchableOpacity
                onPress={() => setActiveCategoryFilter('fixed')}
                style={[styles.heroActionCircle, { backgroundColor: colors.card }]}
                activeOpacity={0.8}
              >
                <Ionicons name="home-outline" size={20} color={colors.lime} />
              </TouchableOpacity>
              <Text style={[styles.heroActionLabel, { color: colors.limeText }]}>
                {t.fixedAction}
              </Text>
            </View>

            {/* 4. Editar Ingreso */}
            <View style={styles.heroActionItem}>
              <TouchableOpacity
                onPress={onOpenEditIncome}
                style={[styles.heroActionCircle, { backgroundColor: colors.card }]}
                activeOpacity={0.8}
              >
                <Ionicons name="wallet-outline" size={20} color={colors.lime} />
              </TouchableOpacity>
              <Text style={[styles.heroActionLabel, { color: colors.limeText }]}>
                {t.editIncomeAction}
              </Text>
            </View>
          </View>

          {/* Bottom Pull Tab */}
          <View style={styles.pullNotchContainer}>
            <View style={[styles.pullNotch, { backgroundColor: colors.lime }]}>
              <Ionicons name="chevron-down" size={14} color={colors.limeText} />
            </View>
          </View>
        </View>

        {/* Shake & OTA Quick Info Banner */}
        <TouchableOpacity
          onPress={onCheckUpdates}
          activeOpacity={0.8}
          style={[
            styles.shakeTipBanner,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <View style={[styles.shakeTipIconWrap, { backgroundColor: 'rgba(198, 248, 39, 0.15)' }]}>
            <Ionicons name="phone-portrait-outline" size={15} color={colors.lime} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.shakeTipTitle, { color: colors.text }]}>
              {locale === 'es' ? '💡 Agitá el celular para actualizar' : '💡 Shake phone to update'}
            </Text>
            <Text style={[styles.shakeTipSubtitle, { color: colors.textMuted }]}>
              {locale === 'es'
                ? 'Comprueba e instala nuevas versiones al instante'
                : 'Instantly check for and install new releases'}
            </Text>
          </View>
          <Ionicons name="refresh" size={15} color={colors.lime} />
        </TouchableOpacity>

        {/* Section: Subscriptions & Upcoming Due Dates (The horizontal cards) */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t.upcomingSubs} ({subscriptions.length})
            </Text>
            <TouchableOpacity onPress={onNavigateToSubs}>
              <Text style={[styles.viewAllText, { color: colors.textMuted }]}>
                {t.viewAll}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subsScroll}>
            {/* Add Sub Button */}
            <TouchableOpacity
              onPress={onAddSubscription}
              style={[styles.addSubCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <Ionicons name="add" size={22} color={colors.lime} />
            </TouchableOpacity>

            {subscriptions.length === 0 ? (
              <TouchableOpacity
                onPress={onAddSubscription}
                activeOpacity={0.8}
                style={[
                  styles.emptySubPill,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                ]}
              >
                <Ionicons name="repeat-outline" size={16} color={colors.lime} />
                <Text style={[styles.emptySubText, { color: colors.textMuted }]}>
                  {locale === 'es'
                    ? 'Sin suscripciones aún. Tocá (+) para agregar.'
                    : 'No subscriptions yet. Tap (+) to add.'}
                </Text>
              </TouchableOpacity>
            ) : (
              subscriptions.map((sub) => (
              <TouchableOpacity
                key={sub.id}
                onPress={() => onTogglePaid(sub.id)}
                style={[
                  styles.subCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: sub.isPaid ? colors.lime : colors.cardBorder,
                  },
                ]}
              >
                <View style={[styles.subIconCircle, { backgroundColor: colors.cardLight }]}>
                  <Ionicons name="film-outline" size={16} color={colors.lime} />
                </View>
                <View>
                  <Text style={[styles.subNameText, { color: colors.text }]} numberOfLines={1}>
                    {sub.title}
                  </Text>
                  <Text style={[styles.subDetailText, { color: colors.textDim }]}>
                    {t.dueDay(sub.dueDate)} • {formatCurrency(sub.amount, currency)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.paidBadge,
                    { backgroundColor: sub.isPaid ? 'rgba(198, 248, 39, 0.15)' : 'rgba(239, 68, 68, 0.15)' },
                  ]}
                >
                  <Ionicons
                    name={sub.isPaid ? 'checkmark-circle' : 'time-outline'}
                    size={14}
                    color={sub.isPaid ? colors.lime : colors.danger}
                  />
                </View>
              </TouchableOpacity>
            )))}
          </ScrollView>
        </View>

        {/* Section: Gastos & Microgastos (Recent Expenses list) */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t.recentExpenses} ({filteredExpenses.length})
            </Text>
            <TouchableOpacity onPress={() => onNavigateToAddExpense()}>
              <Text style={[styles.viewAllText, { color: colors.lime }]}>
                + {t.addExpenseAction}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Category Filter Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsRow}>
            {(['all', 'micro', 'subscription', 'fixed', 'leisure'] as CategoryFilter[]).map((cat) => {
              const isActive = activeCategoryFilter === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCategoryFilter(cat)}
                  style={[
                    styles.filterPill,
                    {
                      backgroundColor: isActive ? colors.lime : colors.card,
                      borderColor: isActive ? colors.lime : colors.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      { color: isActive ? colors.limeText : colors.textMuted },
                    ]}
                  >
                    {t[cat] || cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Expenses List */}
          {filteredExpenses.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Ionicons name="wallet-outline" size={32} color={colors.textDim} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{t.noExpensesTitle}</Text>
              <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>{t.noExpensesDesc}</Text>
            </View>
          ) : (
            filteredExpenses.map((expense) => {
              const catIcon = getCategoryIcon(expense.category);
              const catColor = getCategoryColor(expense.category);

              return (
                <View
                  key={expense.id}
                  style={[styles.expenseItem, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                >
                  <TouchableOpacity
                    onPress={() => onTogglePaid(expense.id)}
                    style={styles.expenseLeft}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.expenseIconCircle, { backgroundColor: colors.cardLight }]}>
                      <Ionicons name={catIcon as any} size={18} color={catColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.expenseTitle, { color: colors.text }]}>
                        {expense.title}
                      </Text>
                      <Text style={[styles.expenseSub, { color: colors.textDim }]}>
                        {expense.notes || t[expense.category] || expense.category} • {t.dueDay(expense.dueDate)}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.expenseRight}>
                    <Text style={[styles.expenseAmount, { color: colors.text }]}>
                      -{formatCurrency(expense.amount, currency)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => onTogglePaid(expense.id)}
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor: expense.isPaid ? 'rgba(198, 248, 39, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: expense.isPaid ? colors.lime : colors.danger },
                        ]}
                      >
                        {expense.isPaid ? t.paid : t.pending}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  profileTagline: {
    fontSize: 11,
    fontWeight: '600',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 9,
    right: 10,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  heroCard: {
    borderRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 22,
    paddingBottom: 18,
    marginTop: 4,
    marginBottom: 26,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroAmountRow: {
    marginBottom: 6,
  },
  heroAmountText: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  healthBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6,
  },
  healthBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  heroBreakdownText: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 20,
  },
  heroActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroActionItem: {
    alignItems: 'center',
    gap: 6,
  },
  heroActionCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroActionLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  pullNotchContainer: {
    position: 'absolute',
    bottom: -12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pullNotch: {
    width: 36,
    height: 14,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  addSubCard: {
    width: 54,
    height: 60,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySubPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  emptySubText: {
    fontSize: 12,
  },
  subCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
  },
  subIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subNameText: {
    fontSize: 13,
    fontWeight: '700',
  },
  subDetailText: {
    fontSize: 10,
    fontWeight: '600',
  },
  paidBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  expenseIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  expenseSub: {
    fontSize: 11,
    fontWeight: '600',
  },
  expenseRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  emptyBox: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 6,
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: 'center',
  },
  shakeTipBanner: {
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shakeTipIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shakeTipTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  shakeTipSubtitle: {
    fontSize: 10,
    marginTop: 1,
  },
});
