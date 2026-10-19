import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Currency, MonthlyBudget } from '../types/expense';
import { ExpenseTotals, formatCurrency } from '../utils/formatters';

interface BudgetSummaryCardProps {
  budget: MonthlyBudget;
  totals: ExpenseTotals;
  currency: Currency;
  onEditIncome: () => void;
}

export const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({
  budget,
  totals,
  currency,
  onEditIncome,
}) => {
  const remainingDisposable = budget.monthlyIncome - totals.total;
  const percentSpent = budget.monthlyIncome > 0 
    ? Math.min(Math.round((totals.total / budget.monthlyIncome) * 100), 100) 
    : 0;

  const isPositive = remainingDisposable >= 0;

  return (
    <View className="mx-5 my-4 p-5 rounded-2xl bg-card border border-white/10 shadow-xl">
      {/* Top Section: Income and Edit Action */}
      <View className="flex-row items-center justify-between pb-3 border-b border-white/5">
        <View>
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Monthly Income
          </Text>
          <Text className="text-lg font-black text-white mt-0.5">
            {formatCurrency(budget.monthlyIncome, currency)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onEditIncome}
          className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 active:bg-white/10"
        >
          <Ionicons name="pencil-outline" size={12} color="#94A3B8" />
          <Text className="text-[11px] font-semibold text-slate-300">Set Income</Text>
        </TouchableOpacity>
      </View>

      {/* Middle Section: Big Disposable Balance */}
      <View className="my-4">
        <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Remaining Disposable Balance
        </Text>
        <View className="flex-row items-baseline gap-2 mt-1">
          <Text
            className={`text-3xl font-black tracking-tight ${
              isPositive ? 'text-emeraldCustom' : 'text-roseCustom'
            }`}
          >
            {formatCurrency(remainingDisposable, currency)}
          </Text>
          <View
            className={`px-2 py-0.5 rounded-md ${
              isPositive ? 'bg-emerald-500/15' : 'bg-rose-500/15'
            }`}
          >
            <Text
              className={`text-[10px] font-black ${
                isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPositive ? 'HEALTHY' : 'DEFICIT'}
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="mb-4">
        <View className="flex-row justify-between mb-1.5">
          <Text className="text-xs font-medium text-slate-400">Total Committed: {totals.count} expenses</Text>
          <Text className="text-xs font-bold text-slate-200">{percentSpent}% of income</Text>
        </View>
        <View className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <View
            className={`h-full rounded-full ${
              percentSpent > 85 ? 'bg-roseCustom' : percentSpent > 65 ? 'bg-amberCustom' : 'bg-primary'
            }`}
            style={{ width: `${percentSpent}%` }}
          />
        </View>
      </View>

      {/* Bottom Section: Paid vs Pending Pills */}
      <View className="flex-row items-center gap-3 pt-3 border-t border-white/5">
        {/* Paid */}
        <View className="flex-1 flex-row items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <View className="w-6 h-6 rounded-full bg-emerald-500/20 items-center justify-center">
            <Ionicons name="checkmark" size={14} color="#10B981" />
          </View>
          <View>
            <Text className="text-[10px] font-bold text-emerald-400 uppercase">Paid ({totals.paidCount})</Text>
            <Text className="text-xs font-bold text-white">
              {formatCurrency(totals.totalPaid, currency)}
            </Text>
          </View>
        </View>

        {/* Pending */}
        <View className="flex-1 flex-row items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <View className="w-6 h-6 rounded-full bg-amber-500/20 items-center justify-center">
            <Ionicons name="time-outline" size={14} color="#F59E0B" />
          </View>
          <View>
            <Text className="text-[10px] font-bold text-amber-400 uppercase">Pending ({totals.pendingCount})</Text>
            <Text className="text-xs font-bold text-white">
              {formatCurrency(totals.totalPending, currency)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
