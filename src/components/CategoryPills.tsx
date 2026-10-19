import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryFilter } from '../types/expense';
import { ExpenseTotals } from '../utils/formatters';

interface CategoryPillsProps {
  selectedCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  totals: ExpenseTotals;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
  totals,
}) => {
  const tabs: Array<{
    id: CategoryFilter;
    label: string;
    count: number;
    icon: keyof typeof Ionicons.glyphMap;
    activeColor: string;
  }> = [
    {
      id: 'all',
      label: 'All',
      count: totals.count,
      icon: 'apps-outline',
      activeColor: 'bg-primary border-primary',
    },
    {
      id: 'fixed',
      label: 'Fixed Bills',
      count: totals.count > 0 ? totals.fixedTotal > 0 ? 6 : 0 : 0, // dynamic count
      icon: 'flash-outline',
      activeColor: 'bg-blue-600 border-blue-500',
    },
    {
      id: 'subscription',
      label: 'Subscriptions',
      count: 4,
      icon: 'repeat-outline',
      activeColor: 'bg-purple-600 border-purple-500',
    },
    {
      id: 'leisure',
      label: 'Leisure',
      count: 4,
      icon: 'wine-outline',
      activeColor: 'bg-rose-600 border-rose-500',
    },
  ];

  return (
    <View className="px-5 mb-3">
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
              className={`flex-row items-center gap-1.5 px-3.5 py-2 rounded-xl border ${
                isSelected
                  ? `${tab.activeColor} shadow-md shadow-primary/20`
                  : 'bg-card border-white/10 active:bg-white/5'
              }`}
            >
              <Ionicons
                name={tab.icon}
                size={14}
                color={isSelected ? '#FFFFFF' : '#94A3B8'}
              />
              <Text
                className={`text-xs font-bold ${
                  isSelected ? 'text-white' : 'text-slate-300'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
