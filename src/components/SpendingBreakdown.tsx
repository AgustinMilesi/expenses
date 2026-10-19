import React from 'react';
import { View, Text } from 'react-native';
import { Currency } from '../types/expense';
import { ExpenseTotals, formatCurrency } from '../utils/formatters';

interface SpendingBreakdownProps {
  totals: ExpenseTotals;
  currency: Currency;
}

export const SpendingBreakdown: React.FC<SpendingBreakdownProps> = ({ totals, currency }) => {
  const total = totals.total || 1;
  const fixedPercent = Math.round((totals.fixedTotal / total) * 100);
  const subPercent = Math.round((totals.subTotal / total) * 100);
  const leisurePercent = Math.round((totals.leisureTotal / total) * 100);

  return (
    <View className="mx-5 mb-4 p-4 rounded-2xl bg-card border border-white/10">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Category Distribution
        </Text>
        <Text className="text-xs font-semibold text-slate-400">
          Total: {formatCurrency(totals.total, currency)}
        </Text>
      </View>

      {/* Multi-segment stacked bar */}
      <View className="w-full h-2.5 rounded-full bg-slate-800 flex-row overflow-hidden my-2">
        <View style={{ width: `${fixedPercent}%` }} className="h-full bg-blue-500" />
        <View style={{ width: `${subPercent}%` }} className="h-full bg-purple-500" />
        <View style={{ width: `${leisurePercent}%` }} className="h-full bg-rose-500" />
      </View>

      {/* Legend & Stats */}
      <View className="flex-row justify-between pt-2">
        {/* Fixed */}
        <View className="flex-row items-center gap-1.5">
          <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <View>
            <Text className="text-[10px] text-slate-400 font-semibold">Fixed ({fixedPercent}%)</Text>
            <Text className="text-xs font-bold text-slate-200">
              {formatCurrency(totals.fixedTotal, currency)}
            </Text>
          </View>
        </View>

        {/* Subscriptions */}
        <View className="flex-row items-center gap-1.5">
          <View className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <View>
            <Text className="text-[10px] text-slate-400 font-semibold">Subs ({subPercent}%)</Text>
            <Text className="text-xs font-bold text-slate-200">
              {formatCurrency(totals.subTotal, currency)}
            </Text>
          </View>
        </View>

        {/* Leisure */}
        <View className="flex-row items-center gap-1.5">
          <View className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <View>
            <Text className="text-[10px] text-slate-400 font-semibold">Leisure ({leisurePercent}%)</Text>
            <Text className="text-xs font-bold text-slate-200">
              {formatCurrency(totals.leisureTotal, currency)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
