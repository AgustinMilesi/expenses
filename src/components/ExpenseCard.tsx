import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Currency, ExpenseItem } from '../types/expense';
import { formatCurrency, getCategoryBadge } from '../utils/formatters';

interface ExpenseCardProps {
  item: ExpenseItem;
  currency: Currency;
  onTogglePaid: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  item,
  currency,
  onTogglePaid,
  onDelete,
}) => {
  const badge = getCategoryBadge(item.category);

  return (
    <View className="mx-5 mb-3 p-4 rounded-2xl bg-card border border-white/5 shadow-md flex-row items-center justify-between">
      {/* Left Column: Icon and Info */}
      <View className="flex-row items-center gap-3.5 flex-1 pr-2">
        {/* Category Color Icon */}
        <View
          className="w-11 h-11 rounded-xl items-center justify-center border border-white/10"
          style={{ backgroundColor: `${item.color}20` }}
        >
          <Ionicons
            name={item.iconName as keyof typeof Ionicons.glyphMap}
            size={22}
            color={item.color}
          />
        </View>

        {/* Text Info */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              numberOfLines={1}
              className={`text-sm font-bold tracking-tight ${
                item.isPaid ? 'text-slate-300 line-through' : 'text-white'
              }`}
            >
              {item.title}
            </Text>
          </View>

          {item.notes ? (
            <Text numberOfLines={1} className="text-xs text-slate-400 mt-0.5">
              {item.notes}
            </Text>
          ) : null}

          {/* Badges: Category & Due Day */}
          <View className="flex-row items-center gap-2 mt-2">
            <View
              className={`px-2 py-0.5 rounded-md border ${badge.bgColor} ${badge.borderColor}`}
            >
              <Text className={`text-[10px] font-bold ${badge.textColor}`}>
                {badge.label}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="calendar-outline" size={10} color="#94A3B8" />
              <Text className="text-[10px] font-medium text-slate-400">
                Day {item.dueDate}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Right Column: Amount, Paid Toggle & Delete */}
      <View className="items-end gap-2">
        {/* Amount */}
        <Text
          className={`text-base font-black ${
            item.isPaid ? 'text-slate-400' : 'text-white'
          }`}
        >
          {formatCurrency(item.amount, currency)}
        </Text>

        <View className="flex-row items-center gap-2">
          {/* Paid / Pending Toggle */}
          <TouchableOpacity
            onPress={() => onTogglePaid(item.id)}
            className={`px-2.5 py-1 rounded-lg flex-row items-center gap-1 border active:opacity-80 ${
              item.isPaid
                ? 'bg-emerald-500/20 border-emerald-500/30'
                : 'bg-amber-500/10 border-amber-500/30'
            }`}
          >
            <Ionicons
              name={item.isPaid ? 'checkmark-circle' : 'ellipse-outline'}
              size={12}
              color={item.isPaid ? '#10B981' : '#F59E0B'}
            />
            <Text
              className={`text-[10px] font-bold ${
                item.isPaid ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {item.isPaid ? 'PAID' : 'PENDING'}
            </Text>
          </TouchableOpacity>

          {/* Delete Action */}
          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            className="w-7 h-7 rounded-lg bg-white/5 items-center justify-center border border-white/5 active:bg-rose-500/20"
            accessibilityLabel={`Delete ${item.title}`}
          >
            <Ionicons name="trash-outline" size={13} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
