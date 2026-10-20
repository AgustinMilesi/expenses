import React from 'react';
import { View, Text } from 'react-native';
import { AppLocale, Currency } from '../types/expense';
import { ExpenseTotals, formatCurrency } from '../utils/formatters';
import { ThemeColors } from '../utils/theme';
import { getTranslations } from '../utils/i18n';

interface SpendingBreakdownProps {
  totals: ExpenseTotals;
  currency: Currency;
  locale: AppLocale;
  colors: ThemeColors;
}

export const SpendingBreakdown: React.FC<SpendingBreakdownProps> = ({
  totals,
  currency,
  locale,
  colors,
}) => {
  const t = getTranslations(locale);
  const total = totals.total || 0;
  const fixedPercent = total > 0 ? Math.round((totals.fixedTotal / total) * 100) : 0;
  const subPercent = total > 0 ? Math.round((totals.subTotal / total) * 100) : 0;
  const leisurePercent = total > 0 ? Math.round((totals.leisureTotal / total) * 100) : 0;

  return (
    <View
      style={{
        marginHorizontal: 20,
        marginBottom: 14,
        padding: 16,
        borderRadius: 20,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: '800',
            color: colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}
        >
          {t.allocationTitle}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: '800', color: colors.text }}>
          {formatCurrency(totals.total, currency)}
        </Text>
      </View>

      {/* Multi-segment stacked bar (OneCargo capsules style) */}
      <View
        style={{
          width: '100%',
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.cardLight,
          flexDirection: 'row',
          overflow: 'hidden',
          marginVertical: 4,
          gap: 2,
        }}
      >
        {total === 0 ? (
          <View style={{ flex: 1, backgroundColor: colors.borderSubtle, borderRadius: 4 }} />
        ) : (
          <>
            {fixedPercent > 0 && (
              <View
                style={{
                  width: `${fixedPercent}%`,
                  height: '100%',
                  backgroundColor: colors.primary,
                  borderRadius: 4,
                }}
              />
            )}
            {subPercent > 0 && (
              <View
                style={{
                  width: `${subPercent}%`,
                  height: '100%',
                  backgroundColor: colors.purple,
                  borderRadius: 4,
                }}
              />
            )}
            {leisurePercent > 0 && (
              <View
                style={{
                  width: `${leisurePercent}%`,
                  height: '100%',
                  backgroundColor: colors.success,
                  borderRadius: 4,
                }}
              />
            )}
          </>
        )}
      </View>

      {/* Legend & Stats */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 10,
        }}
      >
        {/* Fixed */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.primary,
            }}
          />
          <View>
            <Text style={{ fontSize: 10, fontWeight: '700', color: colors.textMuted }}>
              {locale === 'es' ? 'Fijos' : 'Fixed'} ({fixedPercent}%)
            </Text>
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.text }}>
              {formatCurrency(totals.fixedTotal, currency)}
            </Text>
          </View>
        </View>

        {/* Subscriptions */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.purple,
            }}
          />
          <View>
            <Text style={{ fontSize: 10, fontWeight: '700', color: colors.textMuted }}>
              {locale === 'es' ? 'Subs' : 'Subs'} ({subPercent}%)
            </Text>
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.text }}>
              {formatCurrency(totals.subTotal, currency)}
            </Text>
          </View>
        </View>

        {/* Leisure */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.success,
            }}
          />
          <View>
            <Text style={{ fontSize: 10, fontWeight: '700', color: colors.textMuted }}>
              {locale === 'es' ? 'Ocio' : 'Leisure'} ({leisurePercent}%)
            </Text>
            <Text style={{ fontSize: 11, fontWeight: '800', color: colors.text }}>
              {formatCurrency(totals.leisureTotal, currency)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
