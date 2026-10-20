import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppLocale, Currency, ExpenseItem } from '../types/expense';
import { formatCurrency } from '../utils/formatters';
import { ThemeColors } from '../utils/theme';
import { getTranslations } from '../utils/i18n';

interface ExpenseCardProps {
  item: ExpenseItem;
  currency: Currency;
  locale: AppLocale;
  colors: ThemeColors;
  onTogglePaid: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  item,
  currency,
  locale,
  colors,
  onTogglePaid,
  onDelete,
}) => {
  const t = getTranslations(locale);

  const categoryLabel =
    item.category === 'fixed'
      ? locale === 'es'
        ? 'Fijo'
        : 'Fixed'
      : item.category === 'subscription'
      ? locale === 'es'
        ? 'Suscripción'
        : 'Sub'
      : locale === 'es'
      ? 'Ocio'
      : 'Leisure';

  return (
    <View
      style={{
        marginHorizontal: 20,
        marginBottom: 10,
        padding: 14,
        borderRadius: 16,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Left Column: Icon and Info */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, paddingRight: 8 }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: `${item.color}20`,
            borderWidth: 1,
            borderColor: `${item.color}40`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name={item.iconName as keyof typeof Ionicons.glyphMap}
            size={20}
            color={item.color}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: item.isPaid ? colors.textDim : colors.text,
              textDecorationLine: item.isPaid ? 'line-through' : 'none',
            }}
          >
            {item.title}
          </Text>

          {item.notes ? (
            <Text
              numberOfLines={1}
              style={{
                fontSize: 11,
                color: colors.textMuted,
                marginTop: 2,
              }}
            >
              {item.notes}
            </Text>
          ) : null}

          {/* Badges: Category & Due Day */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 6,
                backgroundColor: colors.cardLight,
                borderWidth: 1,
                borderColor: colors.cardBorder,
              }}
            >
              <Text style={{ fontSize: 9, fontWeight: '800', color: colors.primary }}>
                {categoryLabel}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Ionicons name="calendar-outline" size={10} color={colors.textDim} />
              <Text style={{ fontSize: 10, fontWeight: '600', color: colors.textDim }}>
                {t.dayOfDue(item.dueDate)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Right Column: Amount & Actions */}
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '900',
            color: item.isPaid ? colors.textDim : colors.text,
          }}
        >
          {formatCurrency(item.amount, currency)}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {/* Paid / Pending Toggle */}
          <TouchableOpacity
            onPress={() => onTogglePaid(item.id)}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: item.isPaid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              borderWidth: 1,
              borderColor: item.isPaid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
            }}
          >
            <Ionicons
              name={item.isPaid ? 'checkmark-circle' : 'ellipse-outline'}
              size={12}
              color={item.isPaid ? colors.success : colors.warning}
            />
            <Text
              style={{
                fontSize: 10,
                fontWeight: '800',
                color: item.isPaid ? colors.success : colors.warning,
              }}
            >
              {item.isPaid ? t.paid.toUpperCase() : t.pending.toUpperCase()}
            </Text>
          </TouchableOpacity>

          {/* Delete Action */}
          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            activeOpacity={0.7}
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              backgroundColor: colors.cardLight,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}
            accessibilityLabel={`Delete ${item.title}`}
          >
            <Ionicons name="trash-outline" size={13} color={colors.textDim} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
