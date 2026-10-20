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
import { ContactItem, Currency, TransactionItem } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { formatCurrency } from '../utils/formatters';
import { getTranslations } from '../utils/i18n';

interface SearchViewProps {
  transactions: TransactionItem[];
  contacts: ContactItem[];
  currency: Currency;
  colors: ThemeColors;
  locale: any;
  onSelectContact: (contact: ContactItem) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  transactions,
  contacts,
  currency,
  colors,
  locale,
  onSelectContact,
}) => {
  const t = getTranslations(locale);
  const [query, setQuery] = useState('');

  const trimmed = query.trim().toLowerCase();

  const filteredTransactions = transactions.filter(
    (t) =>
      t.title.toLowerCase().includes(trimmed) ||
      t.recipientOrSender.toLowerCase().includes(trimmed) ||
      t.trxId.toLowerCase().includes(trimmed)
  );

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(trimmed) ||
      c.handle.toLowerCase().includes(trimmed) ||
      c.maskedAccount.toLowerCase().includes(trimmed)
  );

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
        {/* Matching Contacts */}
        {filteredContacts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textDim }]}>
              {t.favouriteContacts} ({filteredContacts.length})
            </Text>
            <View style={styles.contactsGrid}>
              {filteredContacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  onPress={() => onSelectContact(contact)}
                  style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                >
                  <View style={[styles.contactAvatar, { backgroundColor: colors.cardLight }]}>
                    <Text style={[styles.contactInitials, { color: colors.lime }]}>
                      {contact.initials}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.contactName, { color: colors.text }]}>{contact.name}</Text>
                    <Text style={[styles.contactHandle, { color: colors.textDim }]}>
                      {contact.handle} • {contact.maskedAccount}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Matching Transactions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textDim }]}>
            {t.transactions} ({filteredTransactions.length})
          </Text>
          {filteredTransactions.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Ionicons name="search-outline" size={32} color={colors.textDim} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No results found matching "{query}"
              </Text>
            </View>
          ) : (
            filteredTransactions.map((trx) => {
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
                        size={18}
                        color={isIncome ? colors.lime : colors.danger}
                        style={{ transform: [{ rotate: '45deg' }] }}
                      />
                    </View>
                    <View>
                      <Text style={[styles.trxTitle, { color: colors.text }]}>{trx.title}</Text>
                      <Text style={[styles.trxSub, { color: colors.textDim }]}>
                        {trx.date} • {trx.time} • TrxID: {trx.trxId}
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
  contactsGrid: {
    gap: 8,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  contactAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInitials: {
    fontSize: 13,
    fontWeight: '800',
  },
  contactName: {
    fontSize: 14,
    fontWeight: '700',
  },
  contactHandle: {
    fontSize: 11,
    fontWeight: '600',
  },
  trxCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  trxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  trxCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trxTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  trxSub: {
    fontSize: 10,
    fontWeight: '600',
  },
  trxAmount: {
    fontSize: 14,
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
