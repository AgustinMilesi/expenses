import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppLocale, Currency, MonthlyBudget } from '../types/expense';
import { ExpenseTotals, formatCurrency } from '../utils/formatters';
import { ThemeColors } from '../utils/theme';
import { getTranslations } from '../utils/i18n';

interface BudgetSummaryCardProps {
  budget: MonthlyBudget;
  totals: ExpenseTotals;
  currency: Currency;
  locale: AppLocale;
  colors: ThemeColors;
  onEditIncome: () => void;
}

export const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({
  budget,
  totals,
  currency,
  locale,
  colors,
  onEditIncome,
}) => {
  const t = getTranslations(locale);
  const remainingDisposable = budget.monthlyIncome - totals.total;
  const percentSpent =
    budget.monthlyIncome > 0
      ? Math.min(Math.round((totals.total / budget.monthlyIncome) * 100), 100)
      : 0;

  const isPositive = remainingDisposable >= 0;

  return (
    <View
      style={{
        marginHorizontal: 20,
        marginVertical: 12,
        padding: 20,
        borderRadius: 20,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
      }}
    >
      {/* Top: Income & Edit Button */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderSubtle,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {t.monthlyIncome}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '900',
              color: colors.text,
              marginTop: 2,
            }}
          >
            {formatCurrency(budget.monthlyIncome, currency)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onEditIncome}
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 10,
            backgroundColor: colors.cardLight,
            borderWidth: 1,
            borderColor: colors.cardBorder,
          }}
        >
          <Ionicons name="pencil-outline" size={12} color={colors.primary} />
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.text }}>
            {t.setIncome}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Disposable / Remaining Balance */}
      <View style={{ marginVertical: 14 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: '700',
            color: colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {t.remainingBalance}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: 8,
            marginTop: 4,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: '900',
              color: isPositive ? colors.success : colors.danger,
              letterSpacing: -1,
            }}
          >
            {formatCurrency(remainingDisposable, currency)}
          </Text>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 6,
              backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: '900',
                color: isPositive ? colors.success : colors.danger,
              }}
            >
              {isPositive ? t.healthyBadge : t.warningBadge}
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Bar of Committed Expenses */}
      <View style={{ marginBottom: 14 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textMuted }}>
            {t.totalCommitted}: {t.itemsCount(totals.count)}
          </Text>
          <Text style={{ fontSize: 11, fontWeight: '800', color: colors.text }}>
            {percentSpent}% {t.expensesRatio}
          </Text>
        </View>

        <View
          style={{
            width: '100%',
            height: 7,
            borderRadius: 4,
            backgroundColor: colors.cardLight,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              borderRadius: 4,
              backgroundColor:
                percentSpent > 85 ? colors.danger : percentSpent > 60 ? colors.warning : colors.primary,
              width: `${percentSpent}%`,
            }}
          />
        </View>
      </View>

      {/* Bottom Stats: Paid vs Pending */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: colors.borderSubtle,
        }}
      >
        {/* Paid */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 10,
            borderRadius: 12,
            backgroundColor: colors.cardLight,
            borderWidth: 1,
            borderColor: colors.cardBorder,
          }}
        >
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="checkmark" size={15} color={colors.success} />
          </View>
          <View>
            <Text
              style={{
                fontSize: 10,
                fontWeight: '800',
                color: colors.success,
                textTransform: 'uppercase',
              }}
            >
              {t.paid} ({totals.paidCount})
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '800', color: colors.text, marginTop: 1 }}>
              {formatCurrency(totals.totalPaid, currency)}
            </Text>
          </View>
        </View>

        {/* Pending */}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            padding: 10,
            borderRadius: 12,
            backgroundColor: colors.cardLight,
            borderWidth: 1,
            borderColor: colors.cardBorder,
          }}
        >
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="time-outline" size={15} color={colors.warning} />
          </View>
          <View>
            <Text
              style={{
                fontSize: 10,
                fontWeight: '800',
                color: colors.warning,
                textTransform: 'uppercase',
              }}
            >
              {t.pending} ({totals.pendingCount})
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '800', color: colors.text, marginTop: 1 }}>
              {formatCurrency(totals.totalPending, currency)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
