import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import { AppLocale } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { getTranslations } from '../utils/i18n';

export type UpdateTriggerType = 'shake' | 'manual';
export type UpdateStatus = 'idle' | 'checking' | 'downloading' | 'ready' | 'upToDate' | 'error';

interface UpdateModalProps {
  visible: boolean;
  triggerType: UpdateTriggerType;
  colors: ThemeColors;
  locale: AppLocale;
  onClose: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  triggerType,
  colors,
  locale,
  onClose,
}) => {
  const t = getTranslations(locale);
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    if (visible) {
      checkAndApplyUpdate();
    } else {
      setStatus('idle');
      setErrorDetails('');
    }
  }, [visible]);

  const checkAndApplyUpdate = async () => {
    try {
      setStatus('checking');
      setErrorDetails('');

      // If in development mode (__DEV__), simulate check and explain
      if (__DEV__) {
        setTimeout(() => {
          setStatus('upToDate');
        }, 1200);
        return;
      }

      if (!Updates.isEnabled) {
        setStatus('error');
        setErrorDetails(
          locale === 'es'
            ? 'El servicio de actualizaciones EAS no está habilitado en este build.'
            : 'EAS Update service is not enabled in this build.'
        );
        return;
      }

      const updateCheck = await Updates.checkForUpdateAsync();

      if (updateCheck.isAvailable) {
        setStatus('downloading');
        await Updates.fetchUpdateAsync();
        setStatus('ready');

        // Automatically reload after a brief moment so user can read the success state
        setTimeout(async () => {
          try {
            await Updates.reloadAsync();
          } catch (reloadErr) {
            console.error('Error reloading:', reloadErr);
          }
        }, 1800);
      } else {
        setStatus('upToDate');
        // Auto-close after 3 seconds if already up to date
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (err: any) {
      console.warn('Update check error:', err);
      setStatus('error');
      setErrorDetails(
        err?.message ||
          (locale === 'es'
            ? 'No se pudo conectar con el servidor de actualizaciones. Revisa tu conexión a internet.'
            : 'Could not connect to update servers. Check your internet connection.')
      );
    }
  };

  const handleManualReload = async () => {
    try {
      await Updates.reloadAsync();
    } catch (err) {
      console.error('Manual reload error:', err);
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.dialogCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.lime,
            },
          ]}
        >
          {/* Header Tag */}
          <View style={styles.tagRow}>
            <View
              style={[
                styles.badgePill,
                {
                  backgroundColor:
                    triggerType === 'shake'
                      ? colors.limeGlowStrong
                      : 'rgba(59, 130, 246, 0.2)',
                  borderColor: triggerType === 'shake' ? colors.lime : '#3B82F6',
                },
              ]}
            >
              <Ionicons
                name={triggerType === 'shake' ? 'phone-portrait' : 'cloud-download'}
                size={12}
                color={triggerType === 'shake' ? colors.lime : '#3B82F6'}
              />
              <Text
                style={[
                  styles.badgeText,
                  { color: triggerType === 'shake' ? colors.lime : '#3B82F6' },
                ]}
              >
                {triggerType === 'shake' ? 'SHAKE TO UPDATE' : 'OTA UPDATE'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.cardLight }]}
            >
              <Ionicons name="close" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Icon Circle */}
          <View style={styles.centerSection}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor:
                    status === 'ready' || status === 'upToDate'
                      ? colors.limeGlow
                      : status === 'error'
                      ? 'rgba(239, 68, 68, 0.15)'
                      : colors.limeGlow,
                  borderColor:
                    status === 'error' ? colors.danger : colors.lime,
                },
              ]}
            >
              {status === 'checking' && (
                <ActivityIndicator size="large" color={colors.lime} />
              )}
              {status === 'downloading' && (
                <ActivityIndicator size="large" color={colors.lime} />
              )}
              {status === 'ready' && (
                <Ionicons name="checkmark-done" size={36} color={colors.lime} />
              )}
              {status === 'upToDate' && (
                <Ionicons name="sparkles" size={34} color={colors.lime} />
              )}
              {status === 'error' && (
                <Ionicons name="alert-circle" size={36} color={colors.danger} />
              )}
              {status === 'idle' && (
                <Ionicons name="sync" size={34} color={colors.lime} />
              )}
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: colors.text }]}>
              {triggerType === 'shake'
                ? t.shakeDetectedTitle
                : t.manualUpdateTitle}
            </Text>

            {/* Status Message */}
            <Text style={[styles.description, { color: colors.textDim }]}>
              {status === 'checking' && t.checkingUpdates}
              {status === 'downloading' && t.downloadingUpdate}
              {status === 'ready' && t.updateReady}
              {status === 'upToDate' && t.upToDate}
              {status === 'error' &&
                (errorDetails || t.updateError)}
              {status === 'idle' && t.checkingUpdates}
            </Text>

            {/* Technical Metadata */}
            <View
              style={[
                styles.metaContainer,
                {
                  backgroundColor: colors.cardLight,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, { color: colors.textMuted }]}>
                  Canal:
                </Text>
                <Text style={[styles.metaValue, { color: colors.lime }]}>
                  {Updates.channel || 'production'}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, { color: colors.textMuted }]}>
                  Runtime:
                </Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>
                  {Updates.runtimeVersion || '1.0.0'}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={[styles.metaLabel, { color: colors.textMuted }]}>
                  Gesto:
                </Text>
                <Text style={[styles.metaValue, { color: colors.text }]}>
                  📳 Shake Detector Activo
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            {status === 'ready' ? (
              <TouchableOpacity
                onPress={handleManualReload}
                style={[styles.primaryBtn, { backgroundColor: colors.lime }]}
                activeOpacity={0.85}
              >
                <Ionicons name="refresh" size={18} color={colors.limeText} />
                <Text style={[styles.primaryBtnText, { color: colors.limeText }]}>
                  {t.restartNow}
                </Text>
              </TouchableOpacity>
            ) : status === 'checking' || status === 'downloading' ? (
              <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color={colors.lime} />
                <Text style={[styles.loadingFooterText, { color: colors.textMuted }]}>
                  Procesando en segundo plano...
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={onClose}
                style={[
                  styles.primaryBtn,
                  {
                    backgroundColor:
                      status === 'upToDate'
                        ? colors.lime
                        : colors.cardLight,
                    borderWidth: status === 'upToDate' ? 0 : 1,
                    borderColor: colors.cardBorder,
                  },
                ]}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.primaryBtnText,
                    {
                      color:
                        status === 'upToDate'
                          ? colors.limeText
                          : colors.text,
                    },
                  ]}
                >
                  {status === 'upToDate' ? '¡Excelente!' : t.close}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSection: {
    alignItems: 'center',
    marginVertical: 8,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
    marginBottom: 18,
  },
  metaContainer: {
    width: '100%',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '800',
  },
  actionRow: {
    marginTop: 10,
    width: '100%',
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  loadingFooterText: {
    fontSize: 12,
  },
});
