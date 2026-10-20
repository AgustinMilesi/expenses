import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppLocale, CategoryFilter, ExpenseItem } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { getTranslations } from '../utils/i18n';

interface CategoryPillsProps {
  selectedCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  expenses: ExpenseItem[];
  locale: AppLocale;
  colors: ThemeColors;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  expenses,
  locale,
  colors,
}) => {
  const t = getTranslations(locale);

  const fixedCount = expenses.filter((e) => e.category === 'fixed').length;
  const subCount = expenses.filter((e) => e.category === 'subscription').length;
  const leisureCount = expenses.filter((e) => e.category === 'leisure').length;

  const tabs: Array<{
    id: CategoryFilter;
    label: string;
    count: number;
    icon: keyof typeof Ionicons.glyphMap;
  }> = [
    {
      id: 'all',
      label: t.all,
      count: expenses.length,
      icon: 'apps-outline',
    },
    {
      id: 'fixed',
      label: locale === 'es' ? 'Fijos' : 'Fixed',
      count: fixedCount,
      icon: 'flash-outline',
    },
    {
      id: 'subscription',
      label: locale === 'es' ? 'Suscripciones' : 'Subs',
      count: subCount,
      icon: 'repeat-outline',
    },
    {
      id: 'leisure',
      label: locale === 'es' ? 'Ocio' : 'Leisure',
      count: leisureCount,
      icon: 'wine-outline',
    },
  ];

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {tabs.map((tab) => {
          const isSelected = selectedCategory === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onSelectCategory(tab.id)}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 12,
                backgroundColor: isSelected ? colors.pillActiveBg : colors.card,
                borderWidth: 1,
                borderColor: isSelected ? colors.pillActiveBg : colors.cardBorder,
                shadowColor: isSelected ? colors.primary : '#000',
                shadowOpacity: isSelected ? 0.3 : 0.05,
                shadowRadius: 5,
                elevation: isSelected ? 3 : 1,
              }}
            >
              <Ionicons
                name={tab.icon}
                size={14}
                color={isSelected ? '#FFFFFF' : colors.textMuted}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: isSelected ? '#FFFFFF' : colors.text,
                }}
              >
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View
                  style={{
                    paddingHorizontal: 6,
                    paddingVertical: 1,
                    borderRadius: 10,
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : colors.cardLight,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '800',
                      color: isSelected ? '#FFFFFF' : colors.textMuted,
                    }}
                  >
                    {tab.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
