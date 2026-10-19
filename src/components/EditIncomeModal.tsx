import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Currency } from '../types/expense';

interface EditIncomeModalProps {
  visible: boolean;
  currentIncome: number;
  currency: Currency;
  onClose: () => void;
  onSave: (newIncome: number) => void;
}

export const EditIncomeModal: React.FC<EditIncomeModalProps> = ({
  visible,
  currentIncome,
  currency,
  onClose,
  onSave,
}) => {
  const [income, setIncome] = useState(currentIncome.toString());
  const [error, setError] = useState('');

  const handleSave = () => {
    const parsed = parseFloat(income);
    if (isNaN(parsed) || parsed < 0) {
      setError('Please enter a valid monthly income');
      return;
    }
    onSave(parsed);
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center items-center bg-black/75 px-5"
      >
        <View className="w-full max-w-sm bg-card border border-white/10 rounded-3xl p-6 shadow-2xl">
          <View className="flex-row items-center justify-between pb-3 border-b border-white/10">
            <Text className="text-base font-black text-white">Update Monthly Income</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <Text className="text-xs text-slate-400 my-3">
            Set your net monthly salary or earnings to calculate your remaining disposable balance.
          </Text>

          {error ? (
            <View className="p-2.5 mb-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <Text className="text-xs text-rose-400 font-bold">{error}</Text>
            </View>
          ) : null}

          <View className="mb-5">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Net Income ({currency})
            </Text>
            <TextInput
              value={income}
              onChangeText={(t) => {
                setIncome(t);
                setError('');
              }}
              keyboardType="numeric"
              placeholder="e.g. 2500"
              placeholderTextColor="#64748B"
              className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-black text-lg"
              autoFocus
            />
          </View>

          <View className="flex-row gap-2.5">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 py-3 rounded-xl bg-white/5 items-center justify-center"
            >
              <Text className="text-xs font-bold text-slate-300 uppercase">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 py-3 rounded-xl bg-primary items-center justify-center shadow-lg shadow-primary/30"
            >
              <Text className="text-xs font-black text-white uppercase">Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
