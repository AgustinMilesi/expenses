import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryFilter, Currency, ExpenseCategory, ExpenseItem } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { formatCurrency } from '../utils/formatters';
import { getTranslations } from '../utils/i18n';

interface HistoryViewProps {
  expenses: ExpenseItem[];
  currency: Currency;
  colors: ThemeColors;
  locale: any;
  onOpenPreferences: () => void;
  onTogglePaid: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  expenses,
  currency,
  colors,
  locale,
  onOpenPreferences,
  onTogglePaid,
  onClearHistory,
}) => {
  const t = getTranslations(locale);
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const filtered = expenses.filter((e) => {
    if (filter === 'all') return true;
    return e.category === filter;
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

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={[styles.title, { color: colors.text }]}>{t.historyTab}</Text>
        <TouchableOpacity
          onPress={onOpenPreferences}
          style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <Ionicons name="options-outline" size={18} color={colors.lime} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {(['all', 'micro', 'subscription', 'fixed', 'leisure'] as CategoryFilter[]).map((cat) => {
          const isActive = filter === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setFilter(cat)}
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
                  styles.filterText,
                  { color: isActive ? colors.limeText : colors.textMuted },
                ]}
              >
                {t[cat] || cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {filtered.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Ionicons name="receipt-outline" size={38} color={colors.textDim} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t.noExpensesTitle}</Text>
            <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>{t.noExpensesDesc}</Text>
          </View>
        ) : (
          filtered.map((item) => {
            const iconName = getCategoryIcon(item.category);
            return (
              <View
                key={item.id}
                style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              >
                <TouchableOpacity
                  onPress={() => onTogglePaid(item.id)}
                  style={styles.itemLeft}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconCircle, { backgroundColor: colors.cardLight }]}>
                    <Ionicons name={iconName as any} size={20} color={colors.lime} />
                  </View>
                  <View>
                    <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.itemDate, { color: colors.textDim }]}>
                      {t.dueDay(item.dueDate)} • {t[item.category] || item.category}
                    </Text>
                    {item.notes ? (
                      <Text style={[styles.itemNotes, { color: colors.textMuted }]}>
                        {item.notes}
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>

                <View style={styles.itemRight}>
                  <Text style={[styles.itemAmount, { color: colors.text }]}>
                    -{formatCurrency(item.amount, currency)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => onTogglePaid(item.id)}
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: item.isPaid ? colors.limeGlow : 'rgba(239, 68, 68, 0.15)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: item.isPaid ? colors.lime : colors.danger },
                      ]}
                    >
                      {item.isPaid ? t.paid : t.pending}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
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
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 10,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemNotes: {
    fontSize: 10,
    fontWeight: '500',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  itemAmount: {
    fontSize: 15,
    fontWeight: '900',
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
  emptyContainer: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: 'center',
  },
});
