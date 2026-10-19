import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Currency, ExpenseCategory, ExpenseItem } from '../types/expense';

interface AddExpenseModalProps {
  visible: boolean;
  currency: Currency;
  onClose: () => void;
  onSave: (expense: Omit<ExpenseItem, 'id' | 'createdAt'>) => void;
}

const CATEGORY_OPTIONS: Array<{
  id: ExpenseCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}> = [
  { id: 'fixed', label: 'Fixed Bill', icon: 'flash-outline', color: '#3B82F6' },
  { id: 'subscription', label: 'Subscription', icon: 'repeat-outline', color: '#8B5CF6' },
  { id: 'leisure', label: 'Leisure / Outing', icon: 'restaurant-outline', color: '#F43F5E' },
];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  visible,
  currency,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('fixed');
  const [dueDate, setDueDate] = useState('10');
  const [notes, setNotes] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please enter a title (e.g. Electricity, Netflix, Dinner)');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    const parsedDay = parseInt(dueDate, 10) || 1;
    const clampedDay = Math.min(Math.max(parsedDay, 1), 31);

    const activeCat = CATEGORY_OPTIONS.find((c) => c.id === category);

    onSave({
      title: title.trim(),
      amount: parsedAmount,
      category,
      dueDate: clampedDay,
      notes: notes.trim(),
      isPaid,
      iconName: activeCat ? activeCat.icon : 'cash-outline',
      color: activeCat ? activeCat.color : '#6366F1',
    });

    // Reset form
    setTitle('');
    setAmount('');
    setCategory('fixed');
    setDueDate('10');
    setNotes('');
    setIsPaid(false);
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/70"
      >
        <View className="bg-card border-t border-white/10 rounded-t-3xl p-6 max-h-[85%]">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-4 border-b border-white/10">
            <Text className="text-lg font-black text-white">Add New Expense</Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-white/5 items-center justify-center"
            >
              <Ionicons name="close" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="my-4">
            {error ? (
              <View className="p-3 mb-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Text className="text-xs text-rose-400 font-bold">{error}</Text>
              </View>
            ) : null}

            {/* Category Selector */}
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Category
            </Text>
            <View className="flex-row gap-2 mb-4">
              {CATEGORY_OPTIONS.map((opt) => {
                const isSelected = category === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setCategory(opt.id)}
                    className={`flex-1 p-2.5 rounded-xl border items-center gap-1.5 ${
                      isSelected
                        ? 'bg-primary/20 border-primary'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={18}
                      color={isSelected ? '#818CF8' : '#94A3B8'}
                    />
                    <Text
                      numberOfLines={1}
                      className={`text-[11px] font-bold ${
                        isSelected ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Title Input */}
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Expense Name
            </Text>
            <TextInput
              value={title}
              onChangeText={(t) => {
                setTitle(t);
                setError('');
              }}
              placeholder="e.g. Electric Bill, Gym Pass, Sushi Bar"
              placeholderTextColor="#64748B"
              className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm mb-4"
            />

            {/* Amount & Due Day in Row */}
            <View className="flex-row gap-3 mb-4">
              {/* Amount */}
              <View className="flex-1">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Amount ({currency})
                </Text>
                <TextInput
                  value={amount}
                  onChangeText={(a) => {
                    setAmount(a);
                    setError('');
                  }}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="#64748B"
                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm"
                />
              </View>

              {/* Due Date (Day of Month) */}
              <View className="w-28">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Due Day (1-31)
                </Text>
                <TextInput
                  value={dueDate}
                  onChangeText={setDueDate}
                  keyboardType="numeric"
                  placeholder="15"
                  placeholderTextColor="#64748B"
                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm text-center"
                />
              </View>
            </View>

            {/* Optional Notes */}
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Notes (Optional)
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="e.g. Auto-debit from card, split with roommate"
              placeholderTextColor="#64748B"
              className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm mb-4"
            />

            {/* Initial Paid Status */}
            <TouchableOpacity
              onPress={() => setIsPaid(!isPaid)}
              className="flex-row items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 mb-4"
            >
              <View>
                <Text className="text-xs font-bold text-white">Payment Status</Text>
                <Text className="text-[11px] text-slate-400">
                  {isPaid ? 'Marked as already paid' : 'Marked as pending payment'}
                </Text>
              </View>
              <View
                className={`w-6 h-6 rounded-md items-center justify-center border ${
                  isPaid ? 'bg-emeraldCustom border-emerald-400' : 'border-white/20'
                }`}
              >
                {isPaid ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row gap-3 pt-2 border-t border-white/10">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 py-3.5 rounded-xl bg-white/5 items-center justify-center"
            >
              <Text className="text-xs font-bold text-slate-300 uppercase">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 py-3.5 rounded-xl bg-primary items-center justify-center shadow-lg shadow-primary/30"
            >
              <Text className="text-xs font-black text-white uppercase">Save Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
