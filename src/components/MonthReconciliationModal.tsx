import React, { useState } from 'react';
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
import { formatCurrency } from '../utils/formatters';

interface MonthReconciliationModalProps {
  visible: boolean;
  theoreticalLeftover: number;
  currency: Currency;
  locale: AppLocale;
  colors: ThemeColors;
  onConfirmExact: () => void;
  onAdjustRealLeftover: (actualAmount: number) => void;
  onClose: () => void;
}

export const MonthReconciliationModal: React.FC<MonthReconciliationModalProps> = ({
  visible,
  theoreticalLeftover,
  currency,
  locale,
  colors,
  onConfirmExact,
  onAdjustRealLeftover,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [actualInput, setActualInput] = useState(
    theoreticalLeftover > 0 ? theoreticalLeftover.toString() : '0'
  );
  const [error, setError] = useState('');

  const handleSaveAdjusted = () => {
    const parsed = parseFloat(actualInput);
    if (isNaN(parsed) || parsed < 0) {
      setError(locale === 'es' ? 'Ingresá un monto válido (0 o mayor)' : 'Enter a valid amount (0 or greater)');
      return;
    }
    onAdjustRealLeftover(parsed);
    setIsEditing(false);
  };

  const parsedActual = parseFloat(actualInput) || 0;
  const difference = parsedActual - theoreticalLeftover;

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
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
            borderWidth: 1.5,
            borderColor: colors.lime,
            shadowColor: colors.lime,
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* Top Emblem */}
          <View style={{ alignItems: 'center', marginBottom: 14 }}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: colors.limeGlow,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1.5,
                borderColor: colors.lime,
              }}
            >
              <Ionicons name="sparkles" size={26} color={colors.lime} />
            </View>
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: '900',
              color: colors.text,
              textAlign: 'center',
              marginBottom: 4,
            }}
          >
            {locale === 'es' ? '¡Arrancó un nuevo mes! 🎉' : 'New Month Started! 🎉'}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: colors.textMuted,
              textAlign: 'center',
              marginBottom: 16,
              lineHeight: 18,
            }}
          >
            {locale === 'es'
              ? 'Según tus registros de VOUT, el mes anterior te sobró este saldo disponible:'
              : 'According to your VOUT records, this surplus remained from last month:'}
          </Text>

          {/* Theoretical Leftover Display */}
          <View
            style={{
              backgroundColor: colors.bg,
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.cardBorder,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' }}>
              {locale === 'es' ? 'Sobrante calculado' : 'Calculated Leftover'}
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '900',
                color: colors.lime,
                marginTop: 4,
              }}
            >
              {formatCurrency(theoreticalLeftover, currency)}
            </Text>
          </View>

          {!isEditing ? (
            /* Mode 1: Confirmation Question */
            <View style={{ gap: 10 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: colors.text,
                  textAlign: 'center',
                  marginBottom: 4,
                }}
              >
                {locale === 'es'
                  ? '¿Este es el monto verdadero que te quedó en mano o banco?'
                  : 'Is this the actual amount left in your hand or bank?'}
              </Text>

              {/* Yes, exact button */}
              <TouchableOpacity
                onPress={onConfirmExact}
                activeOpacity={0.85}
                style={{
                  backgroundColor: colors.lime,
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 8,
                }}
              >
                <Ionicons name="checkmark-circle" size={18} color={colors.limeText} />
                <Text style={{ color: colors.limeText, fontSize: 14, fontWeight: '900' }}>
                  {locale === 'es' ? 'Sí, es exacto' : 'Yes, that is exact'}
                </Text>
              </TouchableOpacity>

              {/* No, adjust button */}
              <TouchableOpacity
                onPress={() => {
                  setActualInput(theoreticalLeftover > 0 ? theoreticalLeftover.toString() : '0');
                  setIsEditing(true);
                }}
                activeOpacity={0.8}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  borderWidth: 1,
                  borderColor: colors.cardBorder,
                  paddingVertical: 13,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 8,
                }}
              >
                <Ionicons name="create-outline" size={18} color={colors.text} />
                <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700' }}>
                  {locale === 'es' ? 'No, me quedó otro monto' : 'No, I have a different amount'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Mode 2: Enter Real Leftover Amount */
            <View style={{ gap: 12 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  textAlign: 'center',
                }}
              >
                {locale === 'es'
                  ? 'Ingresá el monto real que te quedó para que VOUT lo traspase al nuevo mes:'
                  : 'Enter actual remaining cash to roll over into the new month:'}
              </Text>

              {error ? (
                <View
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    borderWidth: 1,
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <Text style={{ fontSize: 11, color: colors.danger, fontWeight: '700', textAlign: 'center' }}>
                    {error}
                  </Text>
                </View>
              ) : null}

              <TextInput
                value={actualInput}
                onChangeText={(t) => {
                  setActualInput(t);
                  setError('');
                }}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={colors.textDim}
                autoFocus
                style={{
                  backgroundColor: colors.bg,
                  borderWidth: 1,
                  borderColor: colors.lime,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  color: colors.lime,
                  fontSize: 22,
                  fontWeight: '900',
                  textAlign: 'center',
                }}
              />

              {/* Live difference calculation */}
              {Math.abs(difference) > 0.01 && (
                <Text
                  style={{
                    fontSize: 11,
                    color: difference < 0 ? colors.danger : colors.lime,
                    textAlign: 'center',
                    fontWeight: '700',
                  }}
                >
                  {difference < 0
                    ? `${locale === 'es' ? 'Ajuste por gastos no registrados' : 'Adjustment'}: -${formatCurrency(Math.abs(difference), currency)}`
                    : `${locale === 'es' ? 'Ajuste positivo' : 'Positive adjustment'}: +${formatCurrency(difference, currency)}`}
                </Text>
              )}

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                <TouchableOpacity
                  onPress={() => setIsEditing(false)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '700' }}>
                    {locale === 'es' ? 'Volver' : 'Back'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveAdjusted}
                  style={{
                    flex: 2,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: colors.lime,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: colors.limeText, fontSize: 13, fontWeight: '900' }}>
                    {locale === 'es' ? 'Guardar & Continuar' : 'Save & Continue'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
