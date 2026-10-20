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
import { ContactItem, Currency, UserWallet } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { formatCurrency } from '../utils/formatters';
import { getTranslations } from '../utils/i18n';

interface SendMoneyScreenProps {
  wallet: UserWallet;
  contacts: ContactItem[];
  currency: Currency;
  colors: ThemeColors;
  locale: any;
  onBack: () => void;
  onOpenNotifications: () => void;
  onAddContact: () => void;
  onSendSuccess: (amount: number, contactName: string) => void;
}

export const SendMoneyScreen: React.FC<SendMoneyScreenProps> = ({
  wallet,
  contacts,
  currency,
  colors,
  locale,
  onBack,
  onOpenNotifications,
  onAddContact,
  onSendSuccess,
}) => {
  const t = getTranslations(locale);

  // Dynamic input amount state (in cents: 150000 = 1,500.00)
  const [amountCents, setAmountCents] = useState<number>(0);
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(
    contacts.length > 0 ? contacts[0] : null
  );
  const [isSending, setIsSending] = useState(false);

  const amountValue = amountCents / 100;
  const transferLimit = wallet.transferLimit || 10000;
  const sliderPercentage = Math.min(100, Math.max(0, (amountValue / transferLimit) * 100));

  // Keypad Handlers
  const handleKeyPress = (val: string) => {
    if (val === 'backspace') {
      setAmountCents((prev) => Math.floor(prev / 10));
    } else if (val === 'enter') {
      handleConfirmSend();
    } else {
      const digit = parseInt(val, 10);
      if (!isNaN(digit)) {
        // Prevent overflow
        if (amountCents < 100000000) {
          setAmountCents((prev) => prev * 10 + digit);
        }
      }
    }
  };

  const handleConfirmSend = () => {
    if (amountValue <= 0) {
      Alert.alert(t.sendMoneyTitle, t.amountMustBeGreaterThanZero);
      return;
    }
    if (amountValue > wallet.balance) {
      Alert.alert(t.sendMoneyTitle, t.insufficientFunds);
      return;
    }

    const recipientName = selectedContact ? selectedContact.name : 'Recipient';
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      onSendSuccess(amountValue, recipientName);
      setAmountCents(0);
    }, 600);
  };

  const formattedAmount = formatCurrency(amountValue, currency);

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
          {t.sendMoneyTitle}
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
        {/* Transfer From Hero Lime Card */}
        <View style={[styles.transferCard, { backgroundColor: colors.lime }]}>
          <View style={styles.transferCardHeader}>
            <Text style={[styles.transferFromLabel, { color: colors.limeText }]}>
              {t.transferFrom}
            </Text>
            <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.limeText} />
            </TouchableOpacity>
          </View>

          <View style={styles.transferCardBody}>
            <View style={styles.accountInfoLeft}>
              <View style={[styles.accountAvatar, { backgroundColor: colors.bg }]}>
                <Ionicons name="person" size={18} color={colors.lime} />
              </View>
              <View>
                <Text style={[styles.accountTitle, { color: colors.limeText }]}>
                  {t.myAccount}
                </Text>
                <Text style={[styles.accountMasked, { color: 'rgba(12, 16, 8, 0.7)' }]}>
                  {wallet.accountNumber}
                </Text>
              </View>
            </View>

            {/* Balance Pill */}
            <View style={[styles.balancePill, { backgroundColor: colors.card }]}>
              <Text style={[styles.balancePillText, { color: colors.lime }]}>
                {formatCurrency(wallet.balance, currency)}
              </Text>
              <Ionicons name="card-outline" size={15} color={colors.lime} style={{ marginLeft: 6 }} />
            </View>
          </View>
        </View>

        {/* Amount Centered Display */}
        <View style={styles.amountDisplayContainer}>
          <View style={styles.amountRow}>
            <Text style={[styles.amountText, { color: colors.text }]}>
              {formattedAmount}
            </Text>
            {/* Glowing neon cursor */}
            <View style={[styles.cursor, { backgroundColor: colors.primary }]} />
          </View>
        </View>

        {/* Transfer Limits Slider */}
        <View style={styles.limitsContainer}>
          <View style={styles.limitsHeader}>
            <Text style={[styles.limitsLabel, { color: colors.textDim }]}>
              {t.transferLimits}
            </Text>
            <Text style={[styles.limitsMax, { color: colors.textMuted }]}>
              {formatCurrency(transferLimit, currency)}
            </Text>
          </View>
          <View style={[styles.sliderTrack, { backgroundColor: colors.cardBorder }]}>
            <View
              style={[
                styles.sliderFill,
                {
                  width: `${sliderPercentage}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
            <View
              style={[
                styles.sliderThumb,
                {
                  left: `${sliderPercentage}%`,
                  backgroundColor: colors.primary,
                  borderColor: colors.bg,
                },
              ]}
            />
          </View>
        </View>

        {/* Quick Send Section */}
        <View style={styles.quickSendSection}>
          <View style={styles.quickSendHeader}>
            <Text style={[styles.quickSendTitle, { color: colors.text }]}>
              {t.quickSend}
            </Text>
            <TouchableOpacity onPress={onAddContact}>
              <Text style={[styles.viewAllText, { color: colors.textMuted }]}>
                {t.viewAll}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contactsRow}>
            {/* Add Contact Button */}
            <TouchableOpacity
              onPress={onAddContact}
              style={[styles.addContactBtn, { borderColor: colors.cardBorder, backgroundColor: colors.card }]}
            >
              <Ionicons name="add" size={24} color={colors.primary} />
            </TouchableOpacity>

            {/* Contact Items */}
            {contacts.map((contact) => {
              const isSelected = selectedContact?.id === contact.id;
              return (
                <TouchableOpacity
                  key={contact.id}
                  onPress={() => setSelectedContact(contact)}
                  style={[
                    styles.contactItem,
                    isSelected && {
                      backgroundColor: colors.cardLight,
                      borderColor: colors.primary,
                    },
                    { borderColor: colors.cardBorder },
                  ]}
                >
                  <View
                    style={[
                      styles.contactAvatar,
                      { backgroundColor: isSelected ? colors.primary : colors.cardLight },
                    ]}
                  >
                    <Text
                      style={[
                        styles.contactInitials,
                        { color: isSelected ? colors.primaryText : colors.text },
                      ]}
                    >
                      {contact.initials}
                    </Text>
                  </View>
                  <Text style={[styles.contactName, { color: colors.text }]} numberOfLines={1}>
                    {contact.name}
                  </Text>
                  <Text style={[styles.contactMasked, { color: colors.textDim }]}>
                    {contact.maskedAccount}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Custom In-App Numeric Keypad */}
        <View style={styles.keypadContainer}>
          <View style={styles.keypadRow}>
            {['1', '2', '3'].map((num) => (
              <TouchableOpacity
                key={num}
                onPress={() => handleKeyPress(num)}
                style={[styles.keypadBtn, { backgroundColor: colors.keypadBg }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.keypadText, { color: colors.keypadText }]}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadRow}>
            {['4', '5', '6'].map((num) => (
              <TouchableOpacity
                key={num}
                onPress={() => handleKeyPress(num)}
                style={[styles.keypadBtn, { backgroundColor: colors.keypadBg }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.keypadText, { color: colors.keypadText }]}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadRow}>
            {['7', '8', '9'].map((num) => (
              <TouchableOpacity
                key={num}
                onPress={() => handleKeyPress(num)}
                style={[styles.keypadBtn, { backgroundColor: colors.keypadBg }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.keypadText, { color: colors.keypadText }]}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadRow}>
            <TouchableOpacity
              onPress={() => handleKeyPress('enter')}
              style={[styles.keypadBtn, { backgroundColor: colors.keypadBg }]}
              activeOpacity={0.7}
            >
              <Ionicons name="return-down-back-outline" size={24} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleKeyPress('0')}
              style={[styles.keypadBtn, { backgroundColor: colors.keypadBg }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.keypadText, { color: colors.keypadText }]}>0</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleKeyPress('backspace')}
              style={[styles.keypadBtn, { backgroundColor: colors.keypadBg }]}
              activeOpacity={0.7}
            >
              <Ionicons name="backspace-outline" size={24} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hold / Slide To Send Button */}
        <TouchableOpacity
          onPress={handleConfirmSend}
          disabled={isSending}
          activeOpacity={0.85}
          style={[
            styles.holdToSendBtn,
            { backgroundColor: colors.lime },
            isSending && { opacity: 0.7 },
          ]}
        >
          <View style={[styles.holdDot, { backgroundColor: colors.limeText }]} />
          <Text style={[styles.holdToSendText, { color: colors.limeText }]}>
            {isSending ? 'Sending...' : t.holdToSend}
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
    paddingBottom: 40,
  },
  transferCard: {
    borderRadius: 26,
    padding: 18,
    marginTop: 6,
    marginBottom: 20,
  },
  transferCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transferFromLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  transferCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  accountMasked: {
    fontSize: 12,
    fontWeight: '600',
  },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  balancePillText: {
    fontSize: 14,
    fontWeight: '800',
  },
  amountDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1,
  },
  cursor: {
    width: 3,
    height: 42,
    borderRadius: 1.5,
    marginLeft: 4,
  },
  limitsContainer: {
    marginTop: 6,
    marginBottom: 20,
  },
  limitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  limitsLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  limitsMax: {
    fontSize: 12,
    fontWeight: '700',
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    height: 6,
    borderRadius: 3,
  },
  sliderThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    position: 'absolute',
    top: -5,
    marginLeft: -8,
  },
  quickSendSection: {
    marginBottom: 20,
  },
  quickSendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickSendTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contactsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  addContactBtn: {
    width: 64,
    height: 72,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactItem: {
    width: 72,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactInitials: {
    fontSize: 13,
    fontWeight: '800',
  },
  contactName: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  contactMasked: {
    fontSize: 10,
    fontWeight: '600',
  },
  keypadContainer: {
    gap: 10,
    marginBottom: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  keypadBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadText: {
    fontSize: 22,
    fontWeight: '800',
  },
  holdToSendBtn: {
    height: 58,
    borderRadius: 29,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  holdDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  holdToSendText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
});
