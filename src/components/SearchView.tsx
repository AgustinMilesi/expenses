import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Currency, ExpenseCategory, ExpenseItem } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { formatCurrency } from '../utils/formatters';
import { getTranslations } from '../utils/i18n';

interface SearchViewProps {
  expenses: ExpenseItem[];
  currency: Currency;
  colors: ThemeColors;
  locale: any;
  onTogglePaid: (id: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  expenses,
  currency,
  colors,
  locale,
  onTogglePaid,
}) => {
  const t = getTranslations(locale);
  const [query, setQuery] = useState('');

  const trimmed = query.trim().toLowerCase();

  const filteredExpenses = expenses.filter(
    (e) =>
      e.title.toLowerCase().includes(trimmed) ||
      (e.notes && e.notes.toLowerCase().includes(trimmed)) ||
      e.category.toLowerCase().includes(trimmed)
  );

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
      {/* Top Search Bar */}
      <View style={styles.topHeader}>
        <View style={[styles.searchInputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
          <Ionicons name="search" size={18} color={colors.textDim} style={{ marginRight: 8 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t.searchPlaceholder}
            placeholderTextColor={colors.textDim}
            style={[styles.input, { color: colors.text }]}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textDim} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textDim }]}>
            {t.recentExpenses} ({filteredExpenses.length})
          </Text>

          {filteredExpenses.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Ionicons name="search-outline" size={32} color={colors.textDim} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No se encontraron gastos con "{query}"
              </Text>
            </View>
          ) : (
            filteredExpenses.map((expense) => {
              const iconName = getCategoryIcon(expense.category);
              return (
                <View
                  key={expense.id}
                  style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                >
                  <TouchableOpacity
                    onPress={() => onTogglePaid(expense.id)}
                    style={styles.itemLeft}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconCircle, { backgroundColor: colors.cardLight }]}>
                      <Ionicons name={iconName as any} size={18} color={colors.lime} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.itemTitle, { color: colors.text }]}>{expense.title}</Text>
                      <Text style={[styles.itemSub, { color: colors.textDim }]}>
                        {t[expense.category] || expense.category} • {t.dueDay(expense.dueDate)}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.itemRight}>
                    <Text style={[styles.itemAmount, { color: colors.text }]}>
                      -{formatCurrency(expense.amount, currency)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => onTogglePaid(expense.id)}
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor: expense.isPaid ? colors.limeGlow : 'rgba(239, 68, 68, 0.15)',
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemSub: {
    fontSize: 11,
    fontWeight: '600',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  itemAmount: {
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
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
  },
});
