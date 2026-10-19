import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';

export const UpdateBanner: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function checkForUpdates() {
      try {
        if (__DEV__) return; // Updates are disabled in local development mode
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          setUpdateAvailable(true);
        }
      } catch (error) {
        console.log('Update check error (safe to ignore in dev):', error);
      }
    }

    checkForUpdates();
  }, []);

  const handleApplyUpdate = async () => {
    try {
      setIsUpdating(true);
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Error reloading app:', error);
      setIsUpdating(false);
    }
  };

  if (!updateAvailable) {
    return null;
  }

  return (
    <View className="mx-5 mb-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 shadow-lg shadow-emerald-950/20 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2.5 flex-1 pr-2">
        <View className="w-8 h-8 rounded-full bg-emerald-500/20 items-center justify-center">
          <Ionicons name="sparkles" size={16} color="#10B981" />
        </View>
        <View className="flex-1">
          <Text className="text-xs font-bold text-white tracking-tight">
            Nueva actualización disponible
          </Text>
          <Text className="text-[11px] text-emerald-300">
            Se sincronizó una nueva versión desde GitHub.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleApplyUpdate}
        disabled={isUpdating}
        className="px-3 py-2 rounded-xl bg-emerald-500 flex-row items-center gap-1 active:opacity-90 shadow-sm shadow-emerald-500/40"
      >
        {isUpdating ? (
          <ActivityIndicator size="small" color="#090D16" />
        ) : (
          <>
            <Ionicons name="refresh" size={14} color="#090D16" />
            <Text className="text-xs font-black text-slate-950 uppercase tracking-wider">
              Reiniciar
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
