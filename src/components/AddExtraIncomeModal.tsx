import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppLocale, Currency, ExtraIncomeItem } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { formatCurrency } from '../utils/formatters';
import { getTranslations } from '../utils/i18n';

interface PresetExtra {
  id: string;
  name: string;
  icon: string;
}

const PRESET_EXTRAS: PresetExtra[] = [
  { id: 'bday', name: 'Regalo cumpleaños', icon: 'gift-outline' },
  { id: 'bonus', name: 'Bono / Aguinaldo', icon: 'sparkles-outline' },
  { id: 'freelance', name: 'Trabajo Freelance', icon: 'laptop-outline' },
  { id: 'sale', name: 'Venta usada', icon: 'pricetag-outline' },
  { id: 'refund', name: 'Devolución / Cobro', icon: 'cash-outline' },
];

interface AddExtraIncomeModalProps {
  visible: boolean;
  extraIncomes: ExtraIncomeItem[];
  currency: Currency;
  locale: AppLocale;
  colors: ThemeColors;
  onClose: () => void;
  onAddExtraIncome: (item: Omit<ExtraIncomeItem, 'id' | 'createdAt'>) => void;
  onDeleteExtraIncome: (id: string) => void;
}

export const AddExtraIncomeModal: React.FC<AddExtraIncomeModalProps> = ({
  visible,
  extraIncomes = [],
  currency,
  locale,
  colors,
  onClose,
  onAddExtraIncome,
  onDeleteExtraIncome,
}) => {
  const t = getTranslations(locale);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const totalExtra = extraIncomes.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const handleSelectPreset = (preset: PresetExtra) => {
    setSelectedPresetId(preset.id);
    setTitle(preset.name);
    setError('');
  };

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (!title.trim()) {
      setError(locale === 'es' ? 'Ingresá el motivo o concepto (ej. Regalo cumpleaños)' : 'Enter description');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError(locale === 'es' ? 'Ingresá un monto mayor a 0' : 'Enter a valid amount');
      return;
    }

    onAddExtraIncome({
      title: title.trim(),
      amount: parsedAmount,
    });

    setTitle('');
    setAmount('');
    setSelectedPresetId(null);
    setError('');
    onClose();
  };

  const handleSafeClose = () => {
    const isDirty = title.trim().length > 0 || amount.trim().length > 0;
    if (isDirty) {
      Alert.alert(
        locale === 'es' ? '¿Cancelar acción?' : 'Discard changes?',
        locale === 'es'
          ? 'Tenés datos ingresados sin guardar. ¿Estás seguro de que querés salir?'
          : 'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: locale === 'es' ? 'Continuar editando' : 'Keep editing', style: 'cancel' },
          {
            text: locale === 'es' ? 'Descartar' : 'Discard',
            style: 'destructive',
            onPress: () => {
              setTitle('');
              setAmount('');
              setSelectedPresetId(null);
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

  const confirmDelete = (item: ExtraIncomeItem) => {
    Alert.alert(
      locale === 'es' ? 'Eliminar ingreso extra' : 'Delete extra income',
      locale === 'es' ? `¿Deseás eliminar "${item.title}"?` : `Delete "${item.title}"?`,
      [
        { text: t.cancel, style: 'cancel' },
        { text: t.deleteAction, style: 'destructive', onPress: () => onDeleteExtraIncome(item.id) },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleSafeClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        }}
      >
        <View
          style={{
            maxHeight: '90%',
            backgroundColor: colors.bg,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            paddingTop: 16,
            paddingHorizontal: 20,
            paddingBottom: Platform.OS === 'ios' ? 36 : 24,
          }}
        >
          {/* Top Notch Indicator */}
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <View style={{ width: 44, height: 4, borderRadius: 2, backgroundColor: colors.borderSubtle }} />
          </View>

          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 14,
              borderBottomWidth: 1,
              borderBottomColor: colors.borderSubtle,
            }}
          >
            <View>
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
                  <Ionicons name="gift" size={18} color={colors.lime} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '900', color: colors.text }}>
                  {locale === 'es' ? 'Ingreso Extra o Regalo' : 'Extra Income & Gifts'}
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                {locale === 'es'
                  ? 'Suma plata extra a tu saldo disponible del mes sin tocar tu sueldo base.'
                  : 'Add extra cash or gifts directly to this month\'s available balance.'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSafeClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="close" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 14 }}>
            {/* Quick Presets */}
            <Text
              style={{
                fontSize: 11,
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                color: colors.textMuted,
                marginBottom: 8,
              }}
            >
              {locale === 'es' ? 'Motivos habituales' : 'Common Inflows'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingBottom: 6 }}
            >
              {PRESET_EXTRAS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <TouchableOpacity
                    key={preset.id}
                    onPress={() => handleSelectPreset(preset)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 12,
                      backgroundColor: isSelected ? colors.lime : colors.card,
                      borderWidth: 1,
                      borderColor: isSelected ? colors.lime : colors.cardBorder,
                    }}
                  >
                    <Ionicons
                      name={preset.icon as any}
                      size={15}
                      color={isSelected ? colors.limeText : colors.lime}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: isSelected ? colors.limeText : colors.text,
                      }}
                    >
                      {preset.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Error Message */}
            {error ? (
              <View
                style={{
                  marginVertical: 10,
                  padding: 10,
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

            {/* Input Form */}
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 18,
                padding: 14,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                marginTop: 8,
                gap: 12,
              }}
            >
              <View>
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, marginBottom: 4 }}>
                  {locale === 'es' ? 'Concepto o detalle' : 'Description / Concept'}
                </Text>
                <TextInput
                  value={title}
                  onChangeText={(t) => {
                    setTitle(t);
                    setError('');
                  }}
                  placeholder={locale === 'es' ? 'Ej: 100 lucas regalo cumple' : 'e.g. Birthday gift'}
                  placeholderTextColor={colors.textDim}
                  style={{
                    backgroundColor: colors.bg,
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    color: colors.text,
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                />
              </View>

              <View>
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, marginBottom: 4 }}>
                  {locale === 'es' ? `Monto agregado (${currency})` : `Amount added (${currency})`}
                </Text>
                <TextInput
                  value={amount}
                  onChangeText={(t) => {
                    setAmount(t);
                    setError('');
                  }}
                  placeholder="0.00"
                  placeholderTextColor={colors.textDim}
                  keyboardType="numeric"
                  autoFocus
                  style={{
                    backgroundColor: colors.bg,
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    color: colors.lime,
                    fontSize: 20,
                    fontWeight: '900',
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={handleSave}
                activeOpacity={0.85}
                style={{
                  backgroundColor: colors.lime,
                  paddingVertical: 13,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 6,
                  marginTop: 4,
                }}
              >
                <Ionicons name="add-circle" size={18} color={colors.limeText} />
                <Text style={{ color: colors.limeText, fontSize: 14, fontWeight: '900' }}>
                  {locale === 'es' ? 'Agregar al Saldo Disponible' : 'Add to Available Balance'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Existing Extra Incomes List */}
            <View style={{ marginTop: 20, marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    color: colors.textMuted,
                  }}
                >
                  {locale === 'es'
                    ? `Ingresos extras de este mes (${extraIncomes.length})`
                    : `Extra Inflows this Month (${extraIncomes.length})`}
                </Text>
                <Text style={{ fontSize: 13, fontWeight: '900', color: colors.lime }}>
                  +{formatCurrency(totalExtra, currency)}
                </Text>
              </View>

              {extraIncomes.length === 0 ? (
                <View
                  style={{
                    padding: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.card,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                    borderStyle: 'dashed',
                  }}
                >
                  <Ionicons name="cash-outline" size={24} color={colors.textDim} style={{ marginBottom: 4 }} />
                  <Text style={{ color: colors.textMuted, fontSize: 12, textAlign: 'center' }}>
                    {locale === 'es'
                      ? 'No hay montos extras agregados en el mes en curso.'
                      : 'No extra cash logged yet this month.'}
                  </Text>
                </View>
              ) : (
                <View style={{ gap: 8 }}>
                  {extraIncomes.map((item) => (
                    <View
                      key={item.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 12,
                        backgroundColor: colors.card,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: colors.cardBorder,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            backgroundColor: colors.limeGlow,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Ionicons name="sparkles" size={16} color={colors.lime} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>
                            {item.title}
                          </Text>
                          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Text style={{ fontSize: 14, fontWeight: '900', color: colors.lime }}>
                          +{formatCurrency(item.amount, currency)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => confirmDelete(item)}
                          style={{ padding: 4 }}
                        >
                          <Ionicons name="trash-outline" size={16} color={colors.textDim} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
