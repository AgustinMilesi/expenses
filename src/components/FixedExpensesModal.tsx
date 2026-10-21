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
import { Currency, ExpenseItem, AppLocale } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { formatCurrency } from '../utils/formatters';
import { getTranslations } from '../utils/i18n';

interface FixedPreset {
  id: string;
  name: string;
  iconName: string;
  defaultDay: number;
}

const FIXED_PRESETS: FixedPreset[] = [
  { id: 'rent', name: 'Alquiler', iconName: 'home-outline', defaultDay: 5 },
  { id: 'light', name: 'Luz / Electricidad', iconName: 'flash-outline', defaultDay: 10 },
  { id: 'water', name: 'Agua corriente', iconName: 'water-outline', defaultDay: 10 },
  { id: 'internet', name: 'Internet & Teléfono', iconName: 'wifi-outline', defaultDay: 12 },
  { id: 'gas', name: 'Gas natural', iconName: 'flame-outline', defaultDay: 15 },
  { id: 'expenses', name: 'Expensas edificio', iconName: 'business-outline', defaultDay: 10 },
  { id: 'insurance', name: 'Seguro', iconName: 'shield-checkmark-outline', defaultDay: 20 },
  { id: 'car', name: 'Cochera / Patente', iconName: 'car-outline', defaultDay: 10 },
  { id: 'loan', name: 'Tarjeta / Préstamo', iconName: 'card-outline', defaultDay: 10 },
];

interface FixedExpensesModalProps {
  visible: boolean;
  expenses: ExpenseItem[];
  currency: Currency;
  locale: AppLocale;
  colors: ThemeColors;
  onClose: () => void;
  onAddFixedExpense: (item: Omit<ExpenseItem, 'id' | 'createdAt'>) => void;
  onTogglePaid: (expenseId: string) => void;
  onDeleteExpense: (expenseId: string) => void;
}

export const FixedExpensesModal: React.FC<FixedExpensesModalProps> = ({
  visible,
  expenses,
  currency,
  locale,
  colors,
  onClose,
  onAddFixedExpense,
  onTogglePaid,
  onDeleteExpense,
}) => {
  const t = getTranslations(locale);
  const fixedList = expenses.filter((e) => e.category === 'fixed');
  const totalFixed = fixedList.reduce((acc, curr) => acc + curr.amount, 0);

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('10');
  const [selectedIcon, setSelectedIcon] = useState('home-outline');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSelectPreset = (preset: FixedPreset) => {
    setSelectedPresetId(preset.id);
    setTitle(preset.name);
    setSelectedIcon(preset.iconName);
    setDueDate(preset.defaultDay.toString());
    setError('');
  };

  const handleAdd = () => {
    const parsedAmount = parseFloat(amount);
    if (!title.trim()) {
      setError(locale === 'es' ? 'Ingresá el nombre del servicio o gasto fijo' : 'Enter expense title');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError(locale === 'es' ? 'Ingresá un monto mayor a 0' : 'Enter a valid amount');
      return;
    }
    const day = parseInt(dueDate, 10);
    if (isNaN(day) || day < 1 || day > 31) {
      setError(locale === 'es' ? 'El día de vencimiento debe ser entre 1 y 31' : 'Due day must be between 1 and 31');
      return;
    }

    const currentDay = new Date().getDate();
    const isAlreadyPastDue = day <= currentDay;

    onAddFixedExpense({
      title: title.trim(),
      amount: parsedAmount,
      category: 'fixed',
      dueDate: day,
      isPaid: isAlreadyPastDue,
      autoPaid: isAlreadyPastDue,
      iconName: selectedIcon,
      color: '#3B82F6',
    });

    // Reset Form
    setTitle('');
    setAmount('');
    setDueDate('10');
    setSelectedPresetId(null);
    setSelectedIcon('home-outline');
    setError('');
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

  const confirmDelete = (item: ExpenseItem) => {
    Alert.alert(
      locale === 'es' ? 'Eliminar gasto fijo' : 'Delete fixed expense',
      locale === 'es' ? `¿Deseás eliminar "${item.title}"?` : `Delete "${item.title}"?`,
      [
        { text: t.cancel, style: 'cancel' },
        { text: t.deleteAction, style: 'destructive', onPress: () => onDeleteExpense(item.id) },
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
                  <Ionicons name="home" size={18} color={colors.lime} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '900', color: colors.text }}>
                  {locale === 'es' ? 'Gastos Fijos' : 'Fixed Bills'}
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                {locale === 'es'
                  ? `Total fijos del mes: ${formatCurrency(totalFixed, currency)}`
                  : `Monthly fixed total: ${formatCurrency(totalFixed, currency)}`}
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
            {/* Quick Presets Carousel */}
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
              {locale === 'es' ? 'Presets rápidos de servicios' : 'Quick Presets'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingBottom: 6 }}
            >
              {FIXED_PRESETS.map((preset) => {
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
                      name={preset.iconName as any}
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

            {/* Input Card Form */}
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
                  {locale === 'es' ? 'Nombre o concepto (Alquiler, Luz, Agua...)' : 'Title / Service'}
                </Text>
                <TextInput
                  value={title}
                  onChangeText={(t) => {
                    setTitle(t);
                    setError('');
                  }}
                  placeholder={locale === 'es' ? 'Ej: Luz Edesur' : 'e.g. Electric bill'}
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

              <View style={{ flexDirection: 'row', gap: 10 }}>
                {/* Monto */}
                <View style={{ flex: 1.5 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, marginBottom: 4 }}>
                    {locale === 'es' ? `Monto (${currency})` : `Amount (${currency})`}
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
                    style={{
                      backgroundColor: colors.bg,
                      borderWidth: 1,
                      borderColor: colors.cardBorder,
                      borderRadius: 12,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      color: colors.text,
                      fontSize: 15,
                      fontWeight: '800',
                    }}
                  />
                </View>

                {/* Día de vencimiento */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, marginBottom: 4 }}>
                    {locale === 'es' ? 'Día Vence (1-31)' : 'Due Day (1-31)'}
                  </Text>
                  <TextInput
                    value={dueDate}
                    onChangeText={(t) => {
                      setDueDate(t);
                      setError('');
                    }}
                    placeholder="10"
                    placeholderTextColor={colors.textDim}
                    keyboardType="number-pad"
                    maxLength={2}
                    style={{
                      backgroundColor: colors.bg,
                      borderWidth: 1,
                      borderColor: colors.cardBorder,
                      borderRadius: 12,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      color: colors.text,
                      fontSize: 15,
                      fontWeight: '800',
                      textAlign: 'center',
                    }}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleAdd}
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
                  {locale === 'es' ? 'Guardar Gasto Fijo' : 'Save Fixed Expense'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* List of Current Fixed Expenses */}
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
                  {locale === 'es' ? `Tus Gastos Fijos (${fixedList.length})` : `Your Fixed Bills (${fixedList.length})`}
                </Text>
                <Text style={{ fontSize: 12, fontWeight: '800', color: colors.lime }}>
                  {formatCurrency(totalFixed, currency)}
                </Text>
              </View>

              {fixedList.length === 0 ? (
                <View
                  style={{
                    padding: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.card,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                    borderStyle: 'dashed',
                  }}
                >
                  <Ionicons name="home-outline" size={28} color={colors.textDim} style={{ marginBottom: 6 }} />
                  <Text style={{ color: colors.textMuted, fontSize: 12, textAlign: 'center' }}>
                    {locale === 'es'
                      ? 'Todavía no agregaste gastos fijos como alquiler, luz o agua.'
                      : 'No fixed expenses added yet. Tap a preset above to quickly create one.'}
                  </Text>
                </View>
              ) : (
                <View style={{ gap: 8 }}>
                  {fixedList.map((item) => (
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
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            backgroundColor: item.isPaid ? 'rgba(198, 248, 39, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Ionicons
                            name={(item.iconName || 'home-outline') as any}
                            size={18}
                            color={item.isPaid ? colors.lime : '#3B82F6'}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>
                            {item.title}
                          </Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                            <Text style={{ fontSize: 11, color: colors.textMuted }}>
                              {locale === 'es' ? `Vence día ${item.dueDate}` : `Due day ${item.dueDate}`}
                            </Text>
                            {item.autoPaid ? (
                              <View
                                style={{
                                  backgroundColor: 'rgba(198, 248, 39, 0.15)',
                                  paddingHorizontal: 5,
                                  paddingVertical: 1,
                                  borderRadius: 4,
                                }}
                              >
                                <Text style={{ fontSize: 9, fontWeight: '800', color: colors.lime }}>
                                  ⚡ AUTO
                                </Text>
                              </View>
                            ) : null}
                          </View>
                        </View>
                      </View>

                      <View style={{ alignItems: 'flex-end', gap: 6 }}>
                        <Text style={{ fontSize: 14, fontWeight: '900', color: colors.text }}>
                          {formatCurrency(item.amount, currency)}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <TouchableOpacity
                            onPress={() => onTogglePaid(item.id)}
                            style={{
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                              borderRadius: 6,
                              backgroundColor: item.isPaid ? colors.lime : 'rgba(255, 255, 255, 0.08)',
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 10,
                                fontWeight: '800',
                                color: item.isPaid ? colors.limeText : colors.textMuted,
                              }}
                            >
                              {item.isPaid ? t.paid : t.pending}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => confirmDelete(item)}
                            style={{ padding: 4 }}
                          >
                            <Ionicons name="trash-outline" size={15} color={colors.textDim} />
                          </TouchableOpacity>
                        </View>
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
