import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Currency, ExpenseItem, MonthlyBudget } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { calculateTotals, formatCurrency } from '../utils/formatters';
import { getTranslations } from '../utils/i18n';

interface SubscriptionsScreenProps {
  budget: MonthlyBudget;
  expenses: ExpenseItem[];
  currency: Currency;
  colors: ThemeColors;
  locale: any;
  onBack: () => void;
  onOpenNotifications: () => void;
  onNavigateToAddExpense: () => void;
  onTogglePaid: (id: string) => void;
  onAddSubscription: () => void;
  onMarkAllPaid: () => void;
  onOpenEditIncome: () => void;
  onDeleteExpense: (id: string) => void;
}

export const SubscriptionsScreen: React.FC<SubscriptionsScreenProps> = ({
  budget,
  expenses,
  currency,
  colors,
  locale,
  onBack,
  onOpenNotifications,
  onNavigateToAddExpense,
  onTogglePaid,
  onAddSubscription,
  onMarkAllPaid,
  onOpenEditIncome,
  onDeleteExpense,
}) => {
  const t = getTranslations(locale);
  const totals = calculateTotals(expenses, budget.monthlyIncome);

  const subs = expenses.filter((e) => e.category === 'subscription');
  const fixed = expenses.filter((e) => e.category === 'fixed');
  const totalRecurring = totals.subTotal + totals.fixedTotal;

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t.subsScreenTitle}
        </Text>

        <TouchableOpacity
          onPress={onOpenNotifications}
          style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <Ionicons name="notifications-outline" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Main Recurring Commitments Cyber Lime Card */}
        <View style={[styles.cardContainer, { backgroundColor: colors.lime }]}>
          <View style={styles.cardHoloGlow} />

          <View style={styles.cardTopRow}>
            <View>
              <Text style={[styles.cardLabel, { color: colors.limeText }]}>
                {t.activeSubsTitle}
              </Text>
              <Text style={[styles.cardSubCount, { color: 'rgba(12, 16, 8, 0.7)' }]}>
                {subs.length} suscripciones • {fixed.length} gastos fijos
              </Text>
            </View>
            <Ionicons name="repeat" size={24} color={colors.limeText} />
          </View>

          <View style={styles.cardBottomRow}>
            <View>
              <Text style={[styles.cardTotalLabel, { color: 'rgba(12, 16, 8, 0.65)' }]}>
                {t.monthlyRecurringTotal}
              </Text>
              <Text style={[styles.cardTotalAmount, { color: colors.limeText }]}>
                {formatCurrency(totalRecurring, currency)}
              </Text>
            </View>

            <View style={[styles.badgePill, { backgroundColor: colors.card }]}>
              <Text style={[styles.badgePillText, { color: colors.lime }]}>
                {totals.pendingCount} pendientes
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Grid (2x4) */}
        <View style={styles.actionsSection}>
          <Text style={[styles.actionsTitle, { color: colors.text }]}>
            {t.quickActions}
          </Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity
              onPress={onNavigateToAddExpense}
              style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.cardLight }]}>
                <Ionicons name="add" size={22} color={colors.lime} />
              </View>
              <Text style={[styles.actionTileText, { color: colors.lime }]} numberOfLines={1}>
                {t.addExpenseAction}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onAddSubscription}
              style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.cardLight }]}>
                <Ionicons name="repeat-outline" size={20} color={colors.lime} />
              </View>
              <Text style={[styles.actionTileText, { color: colors.lime }]} numberOfLines={1}>
                + Sub
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onMarkAllPaid}
              style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.cardLight }]}>
                <Ionicons name="checkmark-done-outline" size={20} color={colors.lime} />
              </View>
              <Text style={[styles.actionTileText, { color: colors.lime }]} numberOfLines={1}>
                {t.markAllPaid}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onOpenEditIncome}
              style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.cardLight }]}>
                <Ionicons name="wallet-outline" size={20} color={colors.lime} />
              </View>
              <Text style={[styles.actionTileText, { color: colors.lime }]} numberOfLines={1}>
                {t.editIncomeAction}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Subscriptions List */}
        <View style={styles.listSection}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            {t.subscription} ({subs.length})
          </Text>

          {subs.map((sub) => (
            <View
              key={sub.id}
              style={[
                styles.subItem,
                {
                  backgroundColor: colors.card,
                  borderColor: sub.isPaid ? colors.cardBorder : colors.danger,
                },
              ]}
            >
              <View style={styles.subLeft}>
                <View style={[styles.subIcon, { backgroundColor: colors.cardLight }]}>
                  <Ionicons name="film-outline" size={18} color={colors.lime} />
                </View>
                <View>
                  <Text style={[styles.subTitle, { color: colors.text }]}>{sub.title}</Text>
                  <Text style={[styles.subInfo, { color: colors.textDim }]}>
                    {t.dueDay(sub.dueDate)} • {sub.notes || 'Suscripción mensual'}
                  </Text>
                </View>
              </View>

              <View style={styles.subRight}>
                <Text style={[styles.subAmount, { color: colors.text }]}>
                  {formatCurrency(sub.amount, currency)}
                </Text>
                <TouchableOpacity
                  onPress={() => onTogglePaid(sub.id)}
                  style={[
                    styles.toggleBtn,
                    {
                      backgroundColor: sub.isPaid ? colors.lime : colors.cardLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.toggleBtnText,
                      { color: sub.isPaid ? colors.limeText : colors.textMuted },
                    ]}
                  >
                    {sub.isPaid ? t.paid : t.pending}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Fixed Bills List */}
        <View style={styles.listSection}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            {t.fixed} ({fixed.length})
          </Text>

          {fixed.map((fix) => (
            <View
              key={fix.id}
              style={[
                styles.subItem,
                {
                  backgroundColor: colors.card,
                  borderColor: fix.isPaid ? colors.cardBorder : colors.danger,
                },
              ]}
            >
              <View style={styles.subLeft}>
                <View style={[styles.subIcon, { backgroundColor: colors.cardLight }]}>
                  <Ionicons name="flash-outline" size={18} color="#3B82F6" />
                </View>
                <View>
                  <Text style={[styles.subTitle, { color: colors.text }]}>{fix.title}</Text>
                  <Text style={[styles.subInfo, { color: colors.textDim }]}>
                    {t.dueDay(fix.dueDate)} • {fix.notes || 'Gasto fijo'}
                  </Text>
                </View>
              </View>

              <View style={styles.subRight}>
                <Text style={[styles.subAmount, { color: colors.text }]}>
                  {formatCurrency(fix.amount, currency)}
                </Text>
                <TouchableOpacity
                  onPress={() => onTogglePaid(fix.id)}
                  style={[
                    styles.toggleBtn,
                    {
                      backgroundColor: fix.isPaid ? colors.lime : colors.cardLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.toggleBtnText,
                      { color: fix.isPaid ? colors.limeText : colors.textMuted },
                    ]}
                  >
                    {fix.isPaid ? t.paid : t.pending}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Add Subscription Button */}
        <TouchableOpacity
          onPress={onAddSubscription}
          style={[styles.addBtn, { backgroundColor: colors.lime }]}
          activeOpacity={0.85}
        >
          <Text style={[styles.addBtnText, { color: colors.limeText }]}>
            {t.addSubscriptionBtn}
          </Text>
        </TouchableOpacity>
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
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  cardContainer: {
    borderRadius: 28,
    padding: 22,
    height: 190,
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  cardHoloGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLabel: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  cardSubCount: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardTotalLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTotalAmount: {
    fontSize: 28,
    fontWeight: '900',
  },
  badgePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgePillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionTile: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  actionIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionTileText: {
    fontSize: 10,
    fontWeight: '800',
  },
  listSection: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  subItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  subLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  subIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  subInfo: {
    fontSize: 11,
    fontWeight: '600',
  },
  subRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  subAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  addBtn: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: '900',
  },
});
