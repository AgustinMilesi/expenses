import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Currency } from '../types/expense';

interface HeaderProps {
  currentCurrency: Currency;
  onToggleCurrency: () => void;
  onResetDemo: () => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  onToggleCurrency,
  onResetDemo,
  onOpenAddModal,
}) => {
  return (
    <View className="px-5 pt-3 pb-4 bg-background border-b border-white/5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2.5">
          <View className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 items-center justify-center">
            <Ionicons name="wallet-outline" size={20} color="#818CF8" />
          </View>
          <View>
            <Text className="text-xl font-black text-white tracking-tight">
              Pocket<Text className="text-primary">Expenses</Text>
            </Text>
            <Text className="text-xs text-slate-400 font-medium">
              October 2026 · Fixed & Subs
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          {/* Currency Switcher */}
          <TouchableOpacity
            onPress={onToggleCurrency}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 flex-row items-center gap-1 active:bg-white/10"
            accessibilityLabel={`Currency switcher, currently ${currentCurrency}`}
          >
            <Text className="text-xs font-bold text-slate-300">{currentCurrency}</Text>
            <Ionicons name="swap-horizontal" size={12} color="#94A3B8" />
          </TouchableOpacity>

          {/* Reset Demo Data Button */}
          <TouchableOpacity
            onPress={onResetDemo}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 items-center justify-center active:bg-white/10"
            accessibilityLabel="Reset to demo sample data"
          >
            <Ionicons name="refresh-outline" size={15} color="#94A3B8" />
          </TouchableOpacity>

          {/* Add New Expense Button */}
          <TouchableOpacity
            onPress={onOpenAddModal}
            className="px-3 py-1.5 rounded-lg bg-primary flex-row items-center gap-1 active:opacity-90 shadow-sm shadow-primary/40"
            accessibilityLabel="Add new expense"
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text className="text-xs font-bold text-white uppercase tracking-wider">New</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
