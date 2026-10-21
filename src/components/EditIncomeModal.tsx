import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppLocale, Currency } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { getTranslations } from '../utils/i18n';

interface EditIncomeModalProps {
  visible: boolean;
  currentIncome: number;
  currency: Currency;
  locale: AppLocale;
  colors: ThemeColors;
  onClose: () => void;
  onSave: (newIncome: number) => void;
}

export const EditIncomeModal: React.FC<EditIncomeModalProps> = ({
  visible,
  currentIncome,
  currency,
  locale,
  colors,
  onClose,
  onSave,
}) => {
  const t = getTranslations(locale);
  const [income, setIncome] = useState(currentIncome > 0 ? currentIncome.toString() : '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setIncome(currentIncome > 0 ? currentIncome.toString() : '');
      setError('');
    }
  }, [visible, currentIncome]);

  const handleSave = () => {
    const parsed = parseFloat(income);
    if (isNaN(parsed) || parsed < 0) {
      setError(locale === 'es' ? 'Ingresá un monto válido' : 'Please enter a valid amount');
      return;
    }
    onSave(parsed);
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 380,
            backgroundColor: colors.card,
            borderRadius: 24,
            padding: 22,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 15,
            elevation: 8,
          }}
        >
          {/* Header */}
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
            <Text style={{ fontSize: 16, fontWeight: '900', color: colors.text }}>
              {t.saveIncome}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 12, color: colors.textMuted, marginVertical: 12 }}>
            {locale === 'es'
              ? 'Definí tu ingreso mensual neto estimado para calcular tu saldo restante en tiempo real.'
              : 'Set your estimated net monthly income to calculate remaining disposable balance.'}
          </Text>

          {error ? (
            <View
              style={{
                padding: 10,
                marginBottom: 12,
                borderRadius: 10,
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                borderWidth: 1,
                borderColor: 'rgba(239, 68, 68, 0.3)',
              }}
            >
              <Text style={{ fontSize: 12, color: colors.danger, fontWeight: '700' }}>
                {error}
              </Text>
            </View>
          ) : null}

          <View style={{ marginBottom: 18 }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: colors.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                marginBottom: 6,
              }}
            >
              {t.monthlyIncome} ({currency})
            </Text>
            <TextInput
              value={income}
              onChangeText={(t) => {
                setIncome(t);
                setError('');
              }}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.textDim}
              autoFocus
              style={{
                padding: 14,
                borderRadius: 14,
                backgroundColor: colors.inputBg,
                borderWidth: 1,
                borderColor: colors.inputBorder,
                color: colors.text,
                fontSize: 20,
                fontWeight: '900',
              }}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: colors.cardLight,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: colors.cardBorder,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textMuted }}>
                {t.cancel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: colors.primary,
                shadowOpacity: 0.35,
                shadowRadius: 6,
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '900', color: '#FFFFFF' }}>
                {locale === 'es' ? 'Guardar' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
