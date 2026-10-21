import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Currency,
  ExpenseCategory,
  ExpenseItem,
  MonthlyBudget,
  QuickCategoryItem,
} from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { calculateTotals, formatCurrency } from '../utils/formatters';
import { getTranslations } from '../utils/i18n';

interface AddExpenseScreenProps {
  budget: MonthlyBudget;
  expenses: ExpenseItem[];
  currency: Currency;
  colors: ThemeColors;
  locale: any;
  initialCategory?: ExpenseCategory;
  onBack: () => void;
  onOpenNotifications: () => void;
  onSaveExpense: (item: Omit<ExpenseItem, 'id' | 'createdAt'>) => void;
}

const QUICK_PRESETS: QuickCategoryItem[] = [
  { id: 'q1', title: 'Café de Especialidad', category: 'micro', defaultAmount: 4.5, iconName: 'cafe-outline' },
  { id: 'q2', title: 'Kiosco / Snacks', category: 'micro', defaultAmount: 3.2, iconName: 'fast-food-outline' },
  { id: 'q3', title: 'Taxi / Uber Corto', category: 'micro', defaultAmount: 8.5, iconName: 'car-outline' },
  { id: 'q4', title: 'Almuerzo / Comida', category: 'leisure', defaultAmount: 15.0, iconName: 'restaurant-outline' },
  { id: 'q5', title: 'Supermercado', category: 'fixed', defaultAmount: 45.0, iconName: 'cart-outline' },
  { id: 'q6', title: 'Farmacia / Salud', category: 'fixed', defaultAmount: 20.0, iconName: 'medkit-outline' },
];

export const AddExpenseScreen: React.FC<AddExpenseScreenProps> = ({
  budget,
  expenses,
  currency,
  colors,
  locale,
  initialCategory = 'micro',
  onBack,
  onOpenNotifications,
  onSaveExpense,
}) => {
  const t = getTranslations(locale);
  const totals = calculateTotals(expenses, budget.monthlyIncome);

  const [amountCents, setAmountCents] = useState<number>(0);
  const [title, setTitle] = useState<string>('Café / Microgasto');
  const [category, setCategory] = useState<ExpenseCategory>(initialCategory);
  const [isSaving, setIsSaving] = useState(false);

  const amountValue = amountCents / 100;
  const projectedBalance = Math.max(0, totals.remainingBalance - amountValue);
  const budgetUtilization = budget.monthlyIncome > 0 ? Math.min(100, (amountValue / budget.monthlyIncome) * 100) : 0;

  // Keypad Handlers
  const handleKeyPress = (val: string) => {
    if (val === 'backspace') {
      setAmountCents((prev) => Math.floor(prev / 10));
    } else if (val === 'enter') {
      handleConfirmSave();
    } else {
      const digit = parseInt(val, 10);
      if (!isNaN(digit)) {
        if (amountCents < 100000000) {
          setAmountCents((prev) => prev * 10 + digit);
        }
      }
    }
  };

  const handleSelectPreset = (preset: QuickCategoryItem) => {
    setTitle(preset.title);
    setCategory(preset.category);
    if (preset.defaultAmount) {
      setAmountCents(Math.round(preset.defaultAmount * 100));
    }
  };

  const handleConfirmSave = () => {
    if (amountValue <= 0) {
      Alert.alert(t.recordExpenseTitle, t.amountMustBeGreaterThanZero);
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onSaveExpense({
        title: title.trim() || 'Gasto',
        amount: amountValue,
        category,
        dueDate: new Date().getDate(),
        isPaid: true,
        iconName: category === 'micro' ? 'cafe-outline' : 'receipt-outline',
        color: category === 'micro' ? colors.lime : '#3B82F6',
        notes: `${t[category] || category} • Registrado con teclado rápido`,
      });
      setAmountCents(0);
    }, 400);
  };

  const handleSafeBack = () => {
    if (amountCents > 0) {
      Alert.alert(
        locale === 'es' ? '¿Cancelar acción?' : 'Discard expense?',
        locale === 'es'
          ? 'Tenés un monto ingresado sin registrar. ¿Estás seguro de que querés salir?'
          : 'You have entered an amount that is not saved yet. Are you sure you want to discard it?',
        [
          { text: locale === 'es' ? 'Continuar editando' : 'Keep editing', style: 'cancel' },
          {
            text: locale === 'es' ? 'Descartar' : 'Discard',
            style: 'destructive',
            onPress: () => {
              setAmountCents(0);
              onBack();
            },
          },
        ]
      );
    } else {
      onBack();
    }
  };

  useEffect(() => {
    const onBackPress = () => {
      handleSafeBack();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [amountCents, locale]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={handleSafeBack}
          style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t.recordExpenseTitle}
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
        {/* Budget Impact Hero Lime Card */}
        <View style={[styles.impactCard, { backgroundColor: colors.lime }]}>
          <View style={styles.impactCardHeader}>
            <Text style={[styles.impactLabel, { color: colors.limeText }]}>
              {t.budgetImpact}
            </Text>
            <View style={[styles.categoryBadge, { backgroundColor: colors.card }]}>
              <Text style={[styles.categoryBadgeText, { color: colors.lime }]}>
                {t[category] || category}
              </Text>
            </View>
          </View>

          <View style={styles.impactBody}>
            <View>
              <Text style={[styles.balanceAfterLabel, { color: 'rgba(12, 16, 8, 0.7)' }]}>
                {t.balanceAfterExpense}
              </Text>
              <Text style={[styles.projectedBalanceText, { color: colors.limeText }]}>
                {formatCurrency(projectedBalance, currency)}
              </Text>
            </View>

            <View style={[styles.currentBalancePill, { backgroundColor: colors.card }]}>
              <Ionicons name="wallet-outline" size={14} color={colors.lime} style={{ marginRight: 6 }} />
              <Text style={[styles.currentBalancePillText, { color: colors.lime }]}>
                {formatCurrency(totals.remainingBalance, currency)}
              </Text>
            </View>
          </View>
        </View>

        {/* Big Amount Display with Caret */}
        <View style={styles.amountDisplayContainer}>
          <View style={styles.amountRow}>
            <Text style={[styles.amountText, { color: colors.text }]}>
              {formatCurrency(amountValue, currency)}
            </Text>
            <View style={[styles.cursor, { backgroundColor: colors.primary }]} />
          </View>
        </View>

        {/* Title Input */}
        <View style={[styles.titleInputContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Ionicons name="pencil-outline" size={18} color={colors.lime} style={{ marginRight: 10 }} />
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Concepto del gasto (ej. Café, Taxi...)"
            placeholderTextColor={colors.textDim}
            style={[styles.titleInput, { color: colors.text }]}
          />
        </View>

        {/* Budget Impact Slider */}
        <View style={styles.limitsContainer}>
          <View style={styles.limitsHeader}>
            <Text style={[styles.limitsLabel, { color: colors.textDim }]}>
              {t.budgetUtilization}
            </Text>
            <Text style={[styles.limitsMax, { color: colors.textMuted }]}>
              {budgetUtilization.toFixed(1)}%
            </Text>
          </View>
          <View style={[styles.sliderTrack, { backgroundColor: colors.cardBorder }]}>
            <View
              style={[
                styles.sliderFill,
                {
                  width: `${Math.min(100, budgetUtilization)}%`,
                  backgroundColor: budgetUtilization > 25 ? colors.danger : colors.primary,
                },
              ]}
            />
            <View
              style={[
                styles.sliderThumb,
                {
                  left: `${Math.min(100, budgetUtilization)}%`,
                  backgroundColor: colors.primary,
                  borderColor: colors.bg,
                },
              ]}
            />
          </View>
        </View>

        {/* Quick Presets Row (The Quick Send row repurposed) */}
        <View style={styles.quickSendSection}>
          <Text style={[styles.quickSendTitle, { color: colors.text }]}>
            {t.quickPickLabel}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsRow}>
            {QUICK_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                onPress={() => handleSelectPreset(preset)}
                style={[
                  styles.presetCard,
                  {
                    backgroundColor: title === preset.title ? colors.cardLight : colors.card,
                    borderColor: title === preset.title ? colors.primary : colors.cardBorder,
                  },
                ]}
              >
                <View style={[styles.presetIconCircle, { backgroundColor: colors.cardLight }]}>
                  <Ionicons name={preset.iconName as any} size={18} color={colors.lime} />
                </View>
                <Text style={[styles.presetTitle, { color: colors.text }]} numberOfLines={1}>
                  {preset.title}
                </Text>
                <Text style={[styles.presetAmount, { color: colors.lime }]}>
                  {formatCurrency(preset.defaultAmount || 0, currency)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Custom Numeric Keypad (3x4) */}
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

        {/* Hold / Tap To Save Button */}
        <TouchableOpacity
          onPress={handleConfirmSave}
          disabled={isSaving}
          activeOpacity={0.85}
          style={[
            styles.holdToSaveBtn,
            { backgroundColor: colors.lime },
            isSaving && { opacity: 0.7 },
          ]}
        >
          <View style={[styles.holdDot, { backgroundColor: colors.limeText }]} />
          <Text style={[styles.holdToSaveText, { color: colors.limeText }]}>
            {isSaving ? 'Guardando...' : t.holdToSave}
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
  impactCard: {
    borderRadius: 26,
    padding: 18,
    marginTop: 6,
    marginBottom: 16,
  },
  impactCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  impactLabel: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  impactBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceAfterLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  projectedBalanceText: {
    fontSize: 22,
    fontWeight: '900',
  },
  currentBalancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  currentBalancePillText: {
    fontSize: 13,
    fontWeight: '800',
  },
  amountDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
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
  titleInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 14,
  },
  titleInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  limitsContainer: {
    marginBottom: 18,
  },
  limitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  limitsLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  limitsMax: {
    fontSize: 11,
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
    marginBottom: 18,
  },
  quickSendTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  presetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  presetCard: {
    width: 110,
    borderRadius: 18,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  presetIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  presetTitle: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  presetAmount: {
    fontSize: 12,
    fontWeight: '800',
  },
  keypadContainer: {
    gap: 10,
    marginBottom: 18,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  keypadBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadText: {
    fontSize: 22,
    fontWeight: '800',
  },
  holdToSaveBtn: {
    height: 56,
    borderRadius: 28,
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
  holdToSaveText: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
});
