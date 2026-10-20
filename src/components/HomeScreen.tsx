import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ContactItem,
  Currency,
  TransactionItem,
  UserWallet,
} from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { formatCurrency } from '../utils/formatters';
import { getTranslations } from '../utils/i18n';

interface HomeScreenProps {
  wallet: UserWallet;
  contacts: ContactItem[];
  transactions: TransactionItem[];
  currency: Currency;
  colors: ThemeColors;
  locale: any;
  onOpenPreferences: () => void;
  onOpenNotifications: () => void;
  onOpenAchievements: () => void;
  onNavigateToSend: () => void;
  onOpenRequest: () => void;
  onOpenPayment: () => void;
  onOpenWithdraw: () => void;
  onAddContact: () => void;
  onViewAllTransactions: () => void;
  onSelectContactToSend: (contact: ContactItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  wallet,
  contacts,
  transactions,
  currency,
  colors,
  locale,
  onOpenPreferences,
  onOpenNotifications,
  onOpenAchievements,
  onNavigateToSend,
  onOpenRequest,
  onOpenPayment,
  onOpenWithdraw,
  onAddContact,
  onViewAllTransactions,
  onSelectContactToSend,
}) => {
  const t = getTranslations(locale);

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* Top Profile Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={onOpenPreferences}
          style={styles.profileButton}
          activeOpacity={0.8}
        >
          <View style={[styles.profileAvatar, { backgroundColor: colors.card, borderColor: colors.primary }]}>
            <Ionicons name="person" size={20} color={colors.lime} />
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {wallet.accountHolder}
            </Text>
            <Text style={[styles.profileHandle, { color: colors.textMuted }]}>
              @{wallet.username}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            onPress={onOpenAchievements}
            style={[styles.headerIconBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          >
            <Ionicons name="trophy-outline" size={18} color={colors.lime} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onOpenNotifications}
            style={[styles.headerIconBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
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
        {/* Main Hero Total Balance Neon Lime Card */}
        <View style={[styles.heroCard, { backgroundColor: colors.lime }]}>
          {/* Card Top Row */}
          <View style={styles.heroTopRow}>
            <Text style={[styles.totalBalanceLabel, { color: colors.limeText }]}>
              {t.totalBalance}
            </Text>
            <TouchableOpacity
              onPress={onOpenPreferences}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="ellipsis-horizontal" size={22} color={colors.limeText} />
            </TouchableOpacity>
          </View>

          {/* Amount and Trend Badge */}
          <View style={styles.heroAmountRow}>
            <Text style={[styles.heroAmountText, { color: colors.limeText }]}>
              {formatCurrency(wallet.balance, currency)}
            </Text>
            <View style={[styles.trendBadge, { backgroundColor: colors.card }]}>
              <Ionicons name="arrow-up" size={12} color={colors.lime} />
              <Text style={[styles.trendBadgeText, { color: colors.lime }]}>
                {wallet.weeklyGrowthPercentage}% {t.lastWeekGrowth}
              </Text>
            </View>
          </View>

          {/* 4 Action Buttons inside Lime Card */}
          <View style={styles.heroActionsRow}>
            {/* Send */}
            <View style={styles.heroActionItem}>
              <TouchableOpacity
                onPress={onNavigateToSend}
                style={[styles.heroActionCircle, { backgroundColor: colors.card }]}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-up-outline" size={20} color={colors.lime} style={{ transform: [{ rotate: '45deg' }] }} />
              </TouchableOpacity>
              <Text style={[styles.heroActionLabel, { color: colors.limeText }]}>{t.send}</Text>
            </View>

            {/* Request */}
            <View style={styles.heroActionItem}>
              <TouchableOpacity
                onPress={onOpenRequest}
                style={[styles.heroActionCircle, { backgroundColor: colors.card }]}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-down-outline" size={20} color={colors.lime} style={{ transform: [{ rotate: '45deg' }] }} />
              </TouchableOpacity>
              <Text style={[styles.heroActionLabel, { color: colors.limeText }]}>{t.request}</Text>
            </View>

            {/* Payment */}
            <View style={styles.heroActionItem}>
              <TouchableOpacity
                onPress={onOpenPayment}
                style={[styles.heroActionCircle, { backgroundColor: colors.card }]}
                activeOpacity={0.8}
              >
                <Ionicons name="scan-outline" size={20} color={colors.lime} />
              </TouchableOpacity>
              <Text style={[styles.heroActionLabel, { color: colors.limeText }]}>{t.payment}</Text>
            </View>

            {/* Withdraw */}
            <View style={styles.heroActionItem}>
              <TouchableOpacity
                onPress={onOpenWithdraw}
                style={[styles.heroActionCircle, { backgroundColor: colors.card }]}
                activeOpacity={0.8}
              >
                <Ionicons name="file-tray-full-outline" size={20} color={colors.lime} />
              </TouchableOpacity>
              <Text style={[styles.heroActionLabel, { color: colors.limeText }]}>{t.withdraw}</Text>
            </View>
          </View>

          {/* Bottom Pull Notch */}
          <View style={styles.pullNotchContainer}>
            <View style={[styles.pullNotch, { backgroundColor: colors.lime }]}>
              <Ionicons name="chevron-down" size={14} color={colors.limeText} />
            </View>
          </View>
        </View>

        {/* Favourite Contacts Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t.favouriteContacts}
            </Text>
            <TouchableOpacity onPress={onAddContact}>
              <Text style={[styles.viewAllText, { color: colors.textMuted }]}>
                {t.viewAll}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contactsScroll}>
            {/* Add Contact Button */}
            <TouchableOpacity
              onPress={onAddContact}
              style={[styles.addContactCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <Ionicons name="add" size={22} color={colors.lime} />
            </TouchableOpacity>

            {/* Contact Pills */}
            {contacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                onPress={() => onSelectContactToSend(contact)}
                style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              >
                <View style={[styles.contactAvatarCircle, { backgroundColor: colors.cardLight }]}>
                  <Text style={[styles.contactInitialsText, { color: colors.lime }]}>
                    {contact.initials}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.contactNameText, { color: colors.text }]} numberOfLines={1}>
                    {contact.name}
                  </Text>
                  <Text style={[styles.contactMaskedText, { color: colors.textDim }]}>
                    {contact.maskedAccount}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Transactions Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t.transactions}
            </Text>
            <TouchableOpacity onPress={onViewAllTransactions}>
              <Text style={[styles.viewAllText, { color: colors.textMuted }]}>
                {t.viewAll}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.subDateHeader, { color: colors.textDim }]}>
            {t.today}
          </Text>

          {/* Transactions List */}
          {transactions.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Ionicons name="receipt-outline" size={32} color={colors.textDim} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{t.noTransactionsTitle}</Text>
              <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>{t.noTransactionsDesc}</Text>
            </View>
          ) : (
            transactions.slice(0, 5).map((trx) => {
              const isIncome = trx.type === 'receive' || trx.type === 'deposit';
              return (
                <View
                  key={trx.id}
                  style={[styles.trxItem, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                >
                  <View style={styles.trxLeft}>
                    <View style={[styles.trxIconCircle, { backgroundColor: colors.cardLight }]}>
                      <Ionicons
                        name={isIncome ? 'arrow-down-outline' : 'arrow-up-outline'}
                        size={18}
                        color={isIncome ? colors.lime : colors.danger}
                        style={{ transform: [{ rotate: '45deg' }] }}
                      />
                    </View>
                    <View>
                      <Text style={[styles.trxTitle, { color: colors.text }]}>{trx.title}</Text>
                      <Text style={[styles.trxId, { color: colors.textDim }]}>
                        TrxID: {trx.trxId}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.trxRight}>
                    <Text
                      style={[
                        styles.trxAmount,
                        { color: isIncome ? colors.lime : colors.danger },
                      ]}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(trx.amount, currency)}
                    </Text>
                    <Text style={[styles.trxTime, { color: colors.textDim }]}>
                      {trx.time}
                    </Text>
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
  profileTextContainer: {},
  profileName: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  profileHandle: {
    fontSize: 12,
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
    position: 'relative',
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
  totalBalanceLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  heroAmountRow: {
    marginBottom: 24,
  },
  heroAmountText: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  trendBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  trendBadgeText: {
    fontSize: 11,
    fontWeight: '800',
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
  contactsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  addContactCard: {
    width: 54,
    height: 60,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
  },
  contactAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInitialsText: {
    fontSize: 13,
    fontWeight: '800',
  },
  contactNameText: {
    fontSize: 13,
    fontWeight: '700',
  },
  contactMaskedText: {
    fontSize: 10,
    fontWeight: '600',
  },
  subDateHeader: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
  },
  trxItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
  },
  trxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trxIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trxTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  trxId: {
    fontSize: 11,
    fontWeight: '600',
  },
  trxRight: {
    alignItems: 'flex-end',
  },
  trxAmount: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  trxTime: {
    fontSize: 11,
    fontWeight: '600',
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
});
