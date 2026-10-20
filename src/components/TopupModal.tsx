import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Currency, UserWallet } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { formatCurrency } from '../utils/formatters';
import { getTranslations } from '../utils/i18n';

interface TopupModalProps {
  visible: boolean;
  onClose: () => void;
  currency: Currency;
  colors: ThemeColors;
  locale: any;
  onConfirmTopup: (amount: number) => void;
}

export const TopupModal: React.FC<TopupModalProps> = ({
  visible,
  onClose,
  currency,
  colors,
  locale,
  onConfirmTopup,
}) => {
  const t = getTranslations(locale);
  const [amountStr, setAmountStr] = useState('');

  const quickAmounts = [100, 500, 1000, 2500];

  const handleConfirm = () => {
    const parsed = parseFloat(amountStr.replace(/,/g, '.'));
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert(t.topupTitle, t.amountMustBeGreaterThanZero);
      return;
    }
    onConfirmTopup(parsed);
    setAmountStr('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />

        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.cardLight }]}>
                <Ionicons name="add-circle-outline" size={20} color={colors.lime} />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>{t.topupTitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.cardLight }]}>
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.desc, { color: colors.textMuted }]}>{t.topupDesc}</Text>

          {/* Input */}
          <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
            <Text style={[styles.currencyPrefix, { color: colors.lime }]}>{currency}</Text>
            <TextInput
              value={amountStr}
              onChangeText={setAmountStr}
              placeholder="0.00"
              placeholderTextColor={colors.textDim}
              keyboardType="numeric"
              style={[styles.input, { color: colors.text }]}
              autoFocus
            />
          </View>

          {/* Quick Amounts */}
          <View style={styles.quickRow}>
            {quickAmounts.map((q) => (
              <TouchableOpacity
                key={q}
                onPress={() => setAmountStr(q.toString())}
                style={[styles.quickBtn, { backgroundColor: colors.cardLight, borderColor: colors.cardBorder }]}
              >
                <Text style={[styles.quickBtnText, { color: colors.text }]}>
                  +{formatCurrency(q, currency)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.cancelBtn, { backgroundColor: colors.cardLight }]}
            >
              <Text style={[styles.cancelBtnText, { color: colors.textMuted }]}>{t.cancel}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              style={[styles.confirmBtn, { backgroundColor: colors.lime }]}
            >
              <Text style={[styles.confirmBtnText, { color: colors.limeText }]}>{t.confirm}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 28,
    borderWidth: 1,
    padding: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desc: {
    fontSize: 13,
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 54,
    marginBottom: 14,
  },
  currencyPrefix: {
    fontSize: 15,
    fontWeight: '800',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  quickBtn: {
    flex: 1,
    minWidth: '22%',
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1.5,
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
