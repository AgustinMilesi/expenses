import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppLocale, AppTheme, Currency } from '../types/expense';
import { CURRENCY_INFO } from '../utils/formatters';
import { ThemeColors } from '../utils/theme';
import { getTranslations } from '../utils/i18n';

interface HeaderProps {
  currentCurrency: Currency;
  currentTheme: AppTheme;
  currentLocale: AppLocale;
  onOpenPreferences: () => void;
  onOpenAddModal: () => void;
  colors: ThemeColors;
}

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  currentTheme,
  currentLocale,
  onOpenPreferences,
  onOpenAddModal,
  colors,
}) => {
  const t = getTranslations(currentLocale);
  const isDark = currentTheme === 'dark';
  const currencyInfo = CURRENCY_INFO[currentCurrency] || CURRENCY_INFO.ARS;

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 14,
        backgroundColor: colors.bg,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand / Title */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: colors.primary,
              shadowOpacity: 0.35,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '900',
                color: colors.text,
                letterSpacing: -0.5,
              }}
            >
              Pocket<Text style={{ color: colors.primary }}>Expenses</Text>
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: colors.textMuted,
                marginTop: -1,
              }}
            >
              {t.appSubtitle}
            </Text>
          </View>
        </View>

        {/* Right Controls */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* Web-Style Preferences Pill Box */}
          <TouchableOpacity
            onPress={onOpenPreferences}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 10,
              paddingVertical: 7,
              borderRadius: 12,
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.cardBorder,
              shadowColor: '#000',
              shadowOpacity: isDark ? 0.2 : 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
            accessibilityLabel="Preferencias de tema, idioma y moneda"
          >
            {/* Sun / Moon Icon */}
            <Ionicons
              name={isDark ? 'moon-outline' : 'sunny-outline'}
              size={14}
              color={colors.primary}
            />

            {/* Language Code Tag */}
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'monospace',
                fontWeight: '800',
                color: colors.text,
              }}
            >
              {currentLocale.toUpperCase()}
            </Text>

            {/* Currency Tag */}
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: colors.textMuted,
              }}
            >
              {currentCurrency}
            </Text>

            {/* Down chevron */}
            <Ionicons name="chevron-down" size={12} color={colors.textDim} />
          </TouchableOpacity>

          {/* New Expense Plus Button */}
          <TouchableOpacity
            onPress={onOpenAddModal}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOpacity: 0.35,
              shadowRadius: 6,
              elevation: 3,
            }}
            accessibilityLabel="Agregar nuevo gasto"
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '800',
                color: '#FFFFFF',
                letterSpacing: 0.3,
              }}
            >
              {currentLocale === 'es' ? 'NUEVO' : 'NEW'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
