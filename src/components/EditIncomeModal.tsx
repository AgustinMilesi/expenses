import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppLocale, Currency, IncomeType } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { getTranslations } from '../utils/i18n';

interface EditIncomeModalProps {
  visible: boolean;
  currentIncome: number;
  currentIncomeType?: IncomeType;
  currency: Currency;
  locale: AppLocale;
  colors: ThemeColors;
  onClose: () => void;
  onSave: (newIncome: number, incomeType: IncomeType) => void;
  onTriggerReconciliation?: () => void;
}

export const EditIncomeModal: React.FC<EditIncomeModalProps> = ({
  visible,
  currentIncome,
  currentIncomeType = 'fixed_salary',
  currency,
  locale,
  colors,
  onClose,
  onSave,
  onTriggerReconciliation,
}) => {
  const t = getTranslations(locale);
  const [incomeType, setIncomeType] = useState<IncomeType>(currentIncomeType);
  const [income, setIncome] = useState(currentIncome > 0 ? currentIncome.toString() : '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setIncome(currentIncome > 0 ? currentIncome.toString() : '');
      setIncomeType(currentIncomeType || 'fixed_salary');
      setError('');
    }
  }, [visible, currentIncome, currentIncomeType]);

  const handleSafeClose = () => {
    const originalIncomeStr = currentIncome > 0 ? currentIncome.toString() : '';
    const isDirty = income.trim() !== originalIncomeStr || incomeType !== (currentIncomeType || 'fixed_salary');
    if (isDirty && income.trim().length > 0) {
      Alert.alert(
        locale === 'es' ? '¿Cancelar acción?' : 'Discard changes?',
        locale === 'es'
          ? 'Tenés cambios sin guardar en tu ingreso. ¿Estás seguro de que querés salir?'
          : 'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: locale === 'es' ? 'Continuar editando' : 'Keep editing', style: 'cancel' },
          {
            text: locale === 'es' ? 'Descartar' : 'Discard',
            style: 'destructive',
            onPress: () => {
              setIncome(currentIncome > 0 ? currentIncome.toString() : '');
              setIncomeType(currentIncomeType || 'fixed_salary');
              setError('');
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    const parsed = parseFloat(income);
    if (isNaN(parsed) || parsed < 0) {
      setError(locale === 'es' ? 'Ingresá un monto válido' : 'Please enter a valid amount');
      return;
    }
    onSave(parsed, incomeType);
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={handleSafeClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 390,
            backgroundColor: colors.card,
            borderRadius: 24,
            padding: 22,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 18,
            elevation: 8,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 14,
              borderBottomWidth: 1,
              borderBottomColor: colors.borderSubtle,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: colors.limeGlow,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="wallet" size={17} color={colors.lime} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '900', color: colors.text }}>
                {t.saveIncome}
              </Text>
            </View>
            <TouchableOpacity onPress={handleSafeClose} style={{ padding: 4 }}>
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Dual Mode Switcher Tabs */}
          <View style={{ marginTop: 14, marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                color: colors.textMuted,
                marginBottom: 8,
              }}
            >
              {locale === 'es' ? 'Tipo de ingreso mensual' : 'Income Model'}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: colors.bg,
                borderRadius: 14,
                padding: 4,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                gap: 4,
              }}
            >
              {/* Option 1: Sueldo Fijo */}
              <TouchableOpacity
                onPress={() => setIncomeType('fixed_salary')}
                style={{
                  flex: 1,
                  paddingVertical: 9,
                  paddingHorizontal: 8,
                  borderRadius: 10,
                  backgroundColor: incomeType === 'fixed_salary' ? colors.lime : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 5,
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={incomeType === 'fixed_salary' ? colors.limeText : colors.textMuted}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '800',
                    color: incomeType === 'fixed_salary' ? colors.limeText : colors.textMuted,
                  }}
                >
                  {locale === 'es' ? 'Sueldo Fijo' : 'Fixed Salary'}
                </Text>
              </TouchableOpacity>

              {/* Option 2: Plata Inicial / Variable */}
              <TouchableOpacity
                onPress={() => setIncomeType('variable_start')}
                style={{
                  flex: 1,
                  paddingVertical: 9,
                  paddingHorizontal: 8,
                  borderRadius: 10,
                  backgroundColor: incomeType === 'variable_start' ? colors.lime : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 5,
                }}
              >
                <Ionicons
                  name="wallet-outline"
                  size={14}
                  color={incomeType === 'variable_start' ? colors.limeText : colors.textMuted}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '800',
                    color: incomeType === 'variable_start' ? colors.limeText : colors.textMuted,
                  }}
                >
                  {locale === 'es' ? 'Plata Inicial' : 'Starting Cash'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mode Description Tip */}
          <View
            style={{
              padding: 10,
              backgroundColor: colors.bg,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.cardBorder,
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 11, color: colors.textMuted, lineHeight: 16 }}>
              {incomeType === 'fixed_salary'
                ? (locale === 'es'
                    ? '💼 Sueldo Fijo: Cobrás todos los meses lo mismo. Se renueva automáticamente al iniciar cada mes.'
                    : '💼 Fixed Salary: You earn the same predictable amount every month. Auto-renews every month.')
                : (locale === 'es'
                    ? '⚡ Plata Inicial: Para ingresos variables o freelancers. Definí con cuánta plata en mano o banco arrancás este mes.'
                    : '⚡ Starting Cash: For freelancers or variable earners. Sets the initial liquid cash you start this month with.')}
            </Text>
          </View>

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

          {/* Amount Input */}
          <View style={{ marginBottom: 16 }}>
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
              {incomeType === 'fixed_salary'
                ? `${t.monthlyIncome} (${currency})`
                : `${locale === 'es' ? 'Plata de inicio' : 'Starting balance'} (${currency})`}
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
                backgroundColor: colors.bg,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                color: colors.lime,
                fontSize: 22,
                fontWeight: '900',
              }}
            />
          </View>

          {/* Trigger Reconciliation Shortcut (Optional) */}
          {onTriggerReconciliation && (
            <TouchableOpacity
              onPress={() => {
                onClose();
                onTriggerReconciliation();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                paddingVertical: 8,
                marginBottom: 14,
              }}
            >
              <Ionicons name="refresh-circle-outline" size={16} color={colors.lime} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.lime }}>
                {locale === 'es' ? 'Reconciliar saldo real con el banco' : 'Reconcile real balance with bank'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Footer Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={handleSafeClose}
              style={{
                flex: 1,
                paddingVertical: 13,
                borderRadius: 14,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
                flex: 1.5,
                paddingVertical: 13,
                borderRadius: 14,
                backgroundColor: colors.lime,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 6,
              }}
            >
              <Ionicons name="checkmark" size={18} color={colors.limeText} />
              <Text style={{ fontSize: 13, fontWeight: '900', color: colors.limeText }}>
                {locale === 'es' ? 'Guardar' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
