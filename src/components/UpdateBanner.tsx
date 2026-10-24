import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import { AppLocale } from '../types/expense';
import { ThemeColors } from '../utils/theme';

interface UpdateBannerProps {
  colors: ThemeColors;
  locale: AppLocale;
}

export const UpdateBanner: React.FC<UpdateBannerProps> = ({ colors, locale }) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function checkForUpdates() {
      try {
        if (__DEV__) return;
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          setUpdateAvailable(true);
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('Update check (safe to ignore in dev):', error);
        }
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
    <View
      style={{
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 14,
        borderRadius: 16,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderWidth: 1,
        borderColor: colors.success,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, paddingRight: 8 }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: 'rgba(16, 185, 129, 0.25)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="sparkles" size={16} color={colors.success} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.text }}>
            {locale === 'es' ? 'Nueva actualización disponible' : 'New update available'}
          </Text>
          <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>
            {locale === 'es' ? 'Se descargó una versión corregida.' : 'A new version has been downloaded.'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleApplyUpdate}
        disabled={isUpdating}
        activeOpacity={0.8}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 10,
          backgroundColor: colors.success,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {isUpdating ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="refresh" size={14} color="#FFFFFF" />
            <Text style={{ fontSize: 12, fontWeight: '900', color: '#FFFFFF', textTransform: 'uppercase' }}>
              {locale === 'es' ? 'Reiniciar' : 'Reload'}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
