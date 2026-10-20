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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppLocale, Currency, ExpenseCategory, ExpenseItem } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { getTranslations } from '../utils/i18n';

interface AddExpenseModalProps {
  visible: boolean;
  currency: Currency;
  locale: AppLocale;
  colors: ThemeColors;
  onClose: () => void;
  onSave: (expense: Omit<ExpenseItem, 'id' | 'createdAt'>) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  visible,
  currency,
  locale,
  colors,
  onClose,
  onSave,
}) => {
  const t = getTranslations(locale);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('fixed');
  const [dueDate, setDueDate] = useState('10');
  const [notes, setNotes] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState('');

  const categories: Array<{
    id: ExpenseCategory;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
  }> = [
    {
      id: 'fixed',
      label: locale === 'es' ? 'Fijo (Luz, Alquiler)' : 'Fixed Bill',
      icon: 'flash-outline',
      color: colors.primary,
    },
    {
      id: 'subscription',
      label: locale === 'es' ? 'Suscripción' : 'Subscription',
      icon: 'repeat-outline',
      color: colors.purple,
    },
    {
      id: 'leisure',
      label: locale === 'es' ? 'Salida / Ocio' : 'Leisure / Outing',
      icon: 'restaurant-outline',
      color: colors.success,
    },
  ];

  const handleSave = () => {
    if (!title.trim()) {
      setError(locale === 'es' ? 'Ingresá un concepto (ej. Alquiler, Luz, Gym)' : 'Please enter a title');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError(locale === 'es' ? 'Ingresá un monto válido' : 'Please enter a valid amount');
      return;
    }
    const parsedDay = parseInt(dueDate, 10) || 1;
    const clampedDay = Math.min(Math.max(parsedDay, 1), 31);
    const activeCat = categories.find((c) => c.id === category);

    onSave({
      title: title.trim(),
      amount: parsedAmount,
      category,
      dueDate: clampedDay,
      notes: notes.trim(),
      isPaid,
      iconName: activeCat ? activeCat.icon : 'cash-outline',
      color: activeCat ? activeCat.color : colors.primary,
    });

    setTitle('');
    setAmount('');
    setCategory('fixed');
    setDueDate('10');
    setNotes('');
    setIsPaid(false);
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderTopWidth: 1,
            borderTopColor: colors.cardBorder,
            padding: 22,
            maxHeight: '85%',
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
            <Text style={{ fontSize: 18, fontWeight: '900', color: colors.text }}>
              {t.newExpense}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.cardLight,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 14 }}>
            {error ? (
              <View
                style={{
                  padding: 10,
                  marginBottom: 12,
                  borderRadius: 12,
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

            {/* Category Selector */}
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: colors.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                marginBottom: 8,
              }}
            >
              {t.categoryLabel}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
              {categories.map((opt) => {
                const isSelected = category === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setCategory(opt.id)}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      padding: 10,
                      borderRadius: 12,
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: isSelected ? colors.primary : colors.cardLight,
                      borderWidth: 1,
                      borderColor: isSelected ? colors.primary : colors.cardBorder,
                    }}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={18}
                      color={isSelected ? '#FFFFFF' : colors.textMuted}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 10,
                        fontWeight: '800',
                        color: isSelected ? '#FFFFFF' : colors.text,
                      }}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Title Input */}
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
              {t.titleLabel}
            </Text>
            <TextInput
              value={title}
              onChangeText={(txt) => {
                setTitle(txt);
                setError('');
              }}
              placeholder={locale === 'es' ? 'ej. Alquiler, Luz, Internet, Spotify' : 'e.g. Electric bill, Netflix, Dinner'}
              placeholderTextColor={colors.textDim}
              style={{
                padding: 12,
                borderRadius: 12,
                backgroundColor: colors.inputBg,
                borderWidth: 1,
                borderColor: colors.inputBorder,
                color: colors.text,
                fontSize: 14,
                fontWeight: '600',
                marginBottom: 14,
              }}
            />

            {/* Amount & Due Date */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
              <View style={{ flex: 1 }}>
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
                  {t.amountLabel} ({currency})
                </Text>
                <TextInput
                  value={amount}
                  onChangeText={(amt) => {
                    setAmount(amt);
                    setError('');
                  }}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={colors.textDim}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: colors.inputBg,
                    borderWidth: 1,
                    borderColor: colors.inputBorder,
                    color: colors.text,
                    fontSize: 15,
                    fontWeight: '800',
                  }}
                />
              </View>

              <View style={{ width: 110 }}>
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
                  {locale === 'es' ? 'Día (1-31)' : 'Due Day'}
                </Text>
                <TextInput
                  value={dueDate}
                  onChangeText={setDueDate}
                  keyboardType="numeric"
                  placeholder="10"
                  placeholderTextColor={colors.textDim}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: colors.inputBg,
                    borderWidth: 1,
                    borderColor: colors.inputBorder,
                    color: colors.text,
                    fontSize: 15,
                    fontWeight: '800',
                    textAlign: 'center',
                  }}
                />
              </View>
            </View>

            {/* Notes */}
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
              {locale === 'es' ? 'Notas (Opcional)' : 'Notes (Optional)'}
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder={locale === 'es' ? 'ej. Débito automático en cuenta' : 'e.g. Card payment, split with friends'}
              placeholderTextColor={colors.textDim}
              style={{
                padding: 12,
                borderRadius: 12,
                backgroundColor: colors.inputBg,
                borderWidth: 1,
                borderColor: colors.inputBorder,
                color: colors.text,
                fontSize: 13,
                marginBottom: 14,
              }}
            />

            {/* Paid status toggle */}
            <TouchableOpacity
              onPress={() => setIsPaid(!isPaid)}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 12,
                borderRadius: 12,
                backgroundColor: colors.cardLight,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                marginBottom: 14,
              }}
            >
              <View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
                  {t.isPaidLabel}
                </Text>
                <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                  {isPaid ? t.paid : t.pending}
                </Text>
              </View>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isPaid ? colors.success : 'transparent',
                  borderWidth: 1,
                  borderColor: isPaid ? colors.success : colors.cardBorder,
                }}
              >
                {isPaid ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: colors.borderSubtle,
            }}
          >
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
                {t.save}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
