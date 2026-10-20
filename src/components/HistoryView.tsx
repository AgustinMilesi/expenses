import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Currency, TransactionItem } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { formatCurrency } from '../utils/formatters';
import { getTranslations } from '../utils/i18n';

interface HistoryViewProps {
  transactions: TransactionItem[];
  currency: Currency;
  colors: ThemeColors;
  locale: any;
  onOpenPreferences: () => void;
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  transactions,
  currency,
  colors,
  locale,
  onOpenPreferences,
  onClearHistory,
}) => {
  const t = getTranslations(locale);
  const [filter, setFilter] = useState<'all' | 'income' | 'outflow'>('all');

  const filtered = transactions.filter((t) => {
    if (filter === 'income') return t.type === 'receive' || t.type === 'deposit';
    if (filter === 'outflow') return t.type === 'send' || t.type === 'payment';
    return true;
  });

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={[styles.title, { color: colors.text }]}>{t.allTransactions}</Text>
        <TouchableOpacity
          onPress={onOpenPreferences}
          style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <Ionicons name="options-outline" size={18} color={colors.lime} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setFilter('all')}
          style={[
            styles.filterPill,
            { backgroundColor: filter === 'all' ? colors.lime : colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'all' ? colors.limeText : colors.textMuted },
            ]}
          >
            All ({transactions.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilter('income')}
          style={[
            styles.filterPill,
            { backgroundColor: filter === 'income' ? colors.lime : colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'income' ? colors.limeText : colors.textMuted },
            ]}
          >
            Inflow
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilter('outflow')}
          style={[
            styles.filterPill,
            { backgroundColor: filter === 'outflow' ? colors.lime : colors.card, borderColor: colors.cardBorder },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'outflow' ? colors.limeText : colors.textMuted },
            ]}
          >
            Outflow
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {filtered.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Ionicons name="receipt-outline" size={38} color={colors.textDim} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t.noTransactionsTitle}</Text>
            <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>{t.noTransactionsDesc}</Text>
          </View>
        ) : (
          filtered.map((trx) => {
            const isIncome = trx.type === 'receive' || trx.type === 'deposit';
            return (
              <View
                key={trx.id}
                style={[styles.trxCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              >
                <View style={styles.trxLeft}>
                  <View style={[styles.trxCircle, { backgroundColor: colors.cardLight }]}>
                    <Ionicons
                      name={isIncome ? 'arrow-down-outline' : 'arrow-up-outline'}
                      size={20}
                      color={isIncome ? colors.lime : colors.danger}
                      style={{ transform: [{ rotate: '45deg' }] }}
                    />
                  </View>
                  <View>
                    <Text style={[styles.trxTitle, { color: colors.text }]}>{trx.title}</Text>
                    <Text style={[styles.trxDate, { color: colors.textDim }]}>
                      {trx.date} • {trx.time}
                    </Text>
                    <Text style={[styles.trxId, { color: colors.textDim }]}>
                      TrxID: {trx.trxId}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.trxAmount,
                    { color: isIncome ? colors.lime : colors.danger },
                  ]}
                >
                  {isIncome ? '+' : '-'}
                  {formatCurrency(trx.amount, currency)}
                </Text>
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
  trxCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 10,
  },
  trxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  trxCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trxTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  trxDate: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  trxId: {
    fontSize: 10,
    fontWeight: '500',
  },
  trxAmount: {
    fontSize: 15,
    fontWeight: '900',
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
