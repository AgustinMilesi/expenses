import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  AccentTheme,
  AppLocale,
  AppTheme,
  Currency,
  ShakeSensitivity,
  VoutAccount,
  MonthlyBudget,
  ExpenseItem,
  ExtraIncomeItem,
} from '../types/expense';
import { ACCENT_PALETTES, ThemeColors } from '../utils/theme';
import { getTranslations, LOCALES } from '../utils/i18n';
import { CURRENCY_INFO } from '../utils/formatters';
import { loadVoutAccount, saveVoutAccount } from '../utils/storage';
import { APP_VERSION } from '../utils/version';
import {
  loginToVoutCloud,
  registerToVoutCloud,
  syncWithVoutCloud,
  DEFAULT_VOUT_WEB_URL,
} from '../utils/syncApi';

interface PreferencesModalProps {
  visible: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  currentAccent: AccentTheme;
  onSelectAccent: (accent: AccentTheme) => void;
  currentLocale: AppLocale;
  onSelectLocale: (locale: AppLocale) => void;
  currentCurrency: Currency;
  onSelectCurrency: (currency: Currency) => void;
  shakeToUpdate: boolean;
  onToggleShakeToUpdate: (enabled: boolean) => void;
  shakeSensitivity: ShakeSensitivity;
  onSelectShakeSensitivity: (sensitivity: ShakeSensitivity) => void;
  onCheckUpdates: () => void;
  onOpenLegal: (type: 'terms' | 'privacy' | 'cookies') => void;
  colors: ThemeColors;
  currentBudget?: MonthlyBudget;
  currentExpenses?: ExpenseItem[];
  onSyncComplete?: (budget: MonthlyBudget, expenses: ExpenseItem[], extraIncomes: ExtraIncomeItem[]) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  visible,
  onClose,
  currentTheme,
  onSelectTheme,
  currentAccent,
  onSelectAccent,
  currentLocale,
  onSelectLocale,
  currentCurrency,
  onSelectCurrency,
  shakeToUpdate,
  onToggleShakeToUpdate,
  shakeSensitivity,
  onSelectShakeSensitivity,
  onCheckUpdates,
  onOpenLegal,
  colors,
  currentBudget,
  currentExpenses,
  onSyncComplete,
}) => {
  const t = getTranslations(currentLocale);
  const isDark = currentTheme === 'dark';

  const [account, setAccount] = useState<VoutAccount | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [serverUrl, setServerUrl] = useState(DEFAULT_VOUT_WEB_URL);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadVoutAccount().then(setAccount);
    }
  }, [visible]);

  const handleAuthSubmit = async () => {
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Por favor completa todos los campos');
      return;
    }
    if (authMode === 'register' && !authName.trim()) {
      setAuthError('Por favor ingresa tu nombre');
      return;
    }

    setAuthError(null);
    setIsAuthLoading(true);

    try {
      const res =
        authMode === 'login'
          ? await loginToVoutCloud(authEmail, authPassword, serverUrl)
          : await registerToVoutCloud(authName, authEmail, authPassword, serverUrl);

      if (res.error || !res.account) {
        setAuthError(res.error || 'Error de autenticación');
        return;
      }

      setAccount(res.account);
      setShowAuthForm(false);
      setAuthPassword('');

      if (currentBudget && currentExpenses) {
        handleSyncNow(res.account);
      }
    } catch {
      setAuthError('Error de conexión con el servidor VOUT');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSyncNow = async (targetAccount = account) => {
    if (!targetAccount) return;
    if (!currentBudget || !currentExpenses) return;

    setIsSyncing(true);
    try {
      const result = await syncWithVoutCloud(
        targetAccount,
        currentBudget,
        currentExpenses,
        currentBudget.extraIncomes || [],
        {
          theme: currentTheme,
          accent: currentAccent,
          locale: currentLocale,
          currency: currentCurrency,
        }
      );

      if (result.success && result.budget && result.expenses) {
        const updated = await loadVoutAccount();
        if (updated) setAccount(updated);
        if (onSyncComplete) {
          onSyncComplete(result.budget, result.expenses, result.extraIncomes || []);
        }
        Alert.alert('VOUT Cloud', '¡Sincronización en la nube completada con éxito!');
      } else {
        Alert.alert('VOUT Cloud', result.error || 'Error al sincronizar datos');
      }
    } catch {
      Alert.alert('VOUT Cloud', 'Fallo de red al conectar con el servidor');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnectVout = async () => {
    await saveVoutAccount(null);
    setAccount(null);
  };
  const currencies: Currency[] = ['USD', 'ARS', 'EUR', 'CNY', 'BRL'];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />

        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          {/* Top Bar Indicator */}
          <View style={styles.dragHandle} />

          {/* Modal Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.subtitle, { color: colors.textDim }]}>
                {t.personalizationSubtitle}
              </Text>
              <Text style={[styles.title, { color: colors.text }]}>
                {t.preferencesTitle}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.cardLight }]}
            >
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* 0. Cuenta VOUT (VOUT ID) Unified Ecosystem Section */}
            <View style={styles.section}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={[styles.sectionLabel, { color: colors.textDim, marginBottom: 0 }]}>
                  CUENTA VOUT (VOUT ID)
                </Text>
                <View style={{ backgroundColor: colors.card, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, borderWidth: 1, borderColor: colors.lime }}>
                  <Text style={{ color: colors.lime, fontSize: 9, fontWeight: '900' }}>MEMBRESÍA VIP</Text>
                </View>
              </View>

              {account ? (
                <View
                  style={[
                    styles.accountCard,
                    {
                      backgroundColor: colors.cardLight,
                      borderColor: colors.lime,
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={[styles.accountAvatar, { backgroundColor: colors.lime }]}>
                      <Text style={{ color: colors.limeText, fontWeight: '900', fontSize: 16 }}>V</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.accountName, { color: colors.text }]}>
                          {account.name}
                        </Text>
                        <Ionicons name="checkmark-circle" size={15} color={colors.lime} />
                      </View>
                      <Text style={[styles.accountEmail, { color: colors.textMuted }]}>
                        {account.email}
                      </Text>
                      <Text style={[styles.accountSync, { color: colors.lime }]}>
                        ⚡ Vinculado a Nube VOUT
                      </Text>
                    </View>
                  </View>

                  {/* Sync Action & Timestamp */}
                  <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.cardBorder, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={{ fontSize: 11, color: colors.textDim }}>
                        Última sinc: {account.lastSyncAt || 'Reciente'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleSyncNow()}
                      disabled={isSyncing}
                      style={{
                        backgroundColor: colors.lime,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {isSyncing ? (
                        <ActivityIndicator size="small" color={colors.limeText} />
                      ) : (
                        <Ionicons name="cloud-upload-outline" size={14} color={colors.limeText} />
                      )}
                      <Text style={{ fontSize: 11, fontWeight: '800', color: colors.limeText }}>
                        {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={handleDisconnectVout}
                    style={{ alignSelf: 'center', marginTop: 10 }}
                  >
                    <Text style={{ fontSize: 11, color: colors.danger, fontWeight: '700' }}>
                      Cerrar Sesión / Desconectar
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : showAuthForm ? (
                <View
                  style={[
                    styles.accountCard,
                    {
                      backgroundColor: colors.cardLight,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                >
                  {/* Auth Mode Toggle */}
                  <View style={{ flexDirection: 'row', borderRadius: 10, backgroundColor: colors.card, padding: 3, marginBottom: 12 }}>
                    <TouchableOpacity
                      onPress={() => { setAuthMode('login'); setAuthError(null); }}
                      style={{
                        flex: 1,
                        paddingVertical: 7,
                        borderRadius: 8,
                        backgroundColor: authMode === 'login' ? colors.lime : 'transparent',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '800', color: authMode === 'login' ? colors.limeText : colors.textMuted }}>
                        Iniciar Sesión
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => { setAuthMode('register'); setAuthError(null); }}
                      style={{
                        flex: 1,
                        paddingVertical: 7,
                        borderRadius: 8,
                        backgroundColor: authMode === 'register' ? colors.lime : 'transparent',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '800', color: authMode === 'register' ? colors.limeText : colors.textMuted }}>
                        Crear Cuenta
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Error banner */}
                  {authError && (
                    <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)', borderWidth: 1, padding: 8, borderRadius: 8, marginBottom: 10 }}>
                      <Text style={{ color: '#F87171', fontSize: 11, textAlign: 'center', fontWeight: '600' }}>
                        {authError}
                      </Text>
                    </View>
                  )}

                  {authMode === 'register' && (
                    <View style={{ marginBottom: 10 }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: colors.textMuted, marginBottom: 4, textTransform: 'uppercase' }}>
                        Tu Nombre
                      </Text>
                      <TextInput
                        value={authName}
                        onChangeText={setAuthName}
                        placeholder="Ej: Agustín"
                        placeholderTextColor={colors.textDim}
                        style={{
                          backgroundColor: colors.card,
                          borderColor: colors.cardBorder,
                          borderWidth: 1,
                          borderRadius: 10,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          color: colors.text,
                          fontSize: 13,
                        }}
                      />
                    </View>
                  )}

                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: colors.textMuted, marginBottom: 4, textTransform: 'uppercase' }}>
                      Correo Electrónico
                    </Text>
                    <TextInput
                      value={authEmail}
                      onChangeText={setAuthEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      placeholder="tu@correo.com"
                      placeholderTextColor={colors.textDim}
                      style={{
                        backgroundColor: colors.card,
                        borderColor: colors.cardBorder,
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        color: colors.text,
                        fontSize: 13,
                      }}
                    />
                  </View>

                  <View style={{ marginBottom: 14 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: colors.textMuted, marginBottom: 4, textTransform: 'uppercase' }}>
                      Contraseña
                    </Text>
                    <TextInput
                      value={authPassword}
                      onChangeText={setAuthPassword}
                      secureTextEntry
                      placeholder="••••••••"
                      placeholderTextColor={colors.textDim}
                      style={{
                        backgroundColor: colors.card,
                        borderColor: colors.cardBorder,
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        color: colors.text,
                        fontSize: 13,
                      }}
                    />
                  </View>

                  {/* Actions */}
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => setShowAuthForm(false)}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: colors.cardBorder,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '700' }}>
                        Cancelar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleAuthSubmit}
                      disabled={isAuthLoading}
                      style={{
                        flex: 2,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: colors.lime,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isAuthLoading ? (
                        <ActivityIndicator size="small" color={colors.limeText} />
                      ) : (
                        <Text style={{ color: colors.limeText, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' }}>
                          {authMode === 'login' ? 'Entrar y Sincronizar' : 'Crear Cuenta'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View
                  style={[
                    styles.accountCard,
                    {
                      backgroundColor: colors.cardLight,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={[styles.accountAvatar, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1 }]}>
                      <Ionicons name="cloud-outline" size={18} color={colors.lime} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.accountName, { color: colors.text }]}>
                        Sincronización en la Nube VOUT
                      </Text>
                      <Text style={[styles.accountEmail, { color: colors.textMuted, marginTop: 2 }]}>
                        Conecta tu cuenta para sincronizar tus gastos con la web.
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowAuthForm(true)}
                    style={[styles.connectBtn, { backgroundColor: colors.lime }]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.connectBtnText, { color: colors.limeText }]}>
                      ⚡ Vincular o Crear Cuenta
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* 1. Mode: Light vs Dark */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.textDim }]}>
                {t.screenMode}
              </Text>
              <View
                style={[
                  styles.toggleContainer,
                  {
                    backgroundColor: colors.cardLight,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => onSelectTheme('light')}
                  style={[
                    styles.toggleBtn,
                    !isDark && {
                      backgroundColor: colors.card,
                      shadowColor: '#000',
                      shadowOpacity: 0.12,
                      shadowRadius: 4,
                      elevation: 2,
                    },
                  ]}
                >
                  <Ionicons
                    name="sunny-outline"
                    size={16}
                    color={!isDark ? colors.primary : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.toggleText,
                      {
                        color: !isDark ? colors.text : colors.textMuted,
                        fontWeight: !isDark ? '800' : '600',
                      },
                    ]}
                  >
                    {t.light}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onSelectTheme('dark')}
                  style={[
                    styles.toggleBtn,
                    isDark && {
                      backgroundColor: colors.card,
                      shadowColor: '#000',
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 2,
                    },
                  ]}
                >
                  <Ionicons
                    name="moon-outline"
                    size={16}
                    color={isDark ? colors.primary : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.toggleText,
                      {
                        color: isDark ? colors.text : colors.textMuted,
                        fontWeight: isDark ? '800' : '600',
                      },
                    ]}
                  >
                    {t.dark}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 2. Color Accent Palettes */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.textDim }]}>
                {t.accentColor}
              </Text>
              <View
                style={[
                  styles.swatchesRow,
                  {
                    backgroundColor: colors.cardLight,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                {ACCENT_PALETTES.map((palette) => {
                  const isSelected = currentAccent === palette.id;
                  return (
                    <TouchableOpacity
                      key={palette.id}
                      onPress={() => onSelectAccent(palette.id)}
                      style={[
                        styles.swatchBtn,
                        { backgroundColor: palette.hex },
                        isSelected && {
                          borderWidth: 3,
                          borderColor: '#FFFFFF',
                          transform: [{ scale: 1.15 }],
                        },
                      ]}
                      activeOpacity={0.8}
                    />
                  );
                })}
              </View>
            </View>

            {/* 3. Language Selector */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.textDim }]}>
                {t.language}
              </Text>
              <View style={styles.gridRow}>
                {LOCALES.map((l) => {
                  const isSelected = currentLocale === l.code;
                  return (
                    <TouchableOpacity
                      key={l.code}
                      onPress={() => onSelectLocale(l.code)}
                      style={[
                        styles.langCard,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.cardLight,
                          borderColor: isSelected ? colors.primary : colors.cardBorder,
                        },
                      ]}
                    >
                      <Text style={styles.flagIcon}>{l.flag}</Text>
                      <Text
                        style={[
                          styles.langLabel,
                          {
                            color: isSelected ? colors.primaryText : colors.text,
                            fontWeight: isSelected ? '800' : '600',
                          },
                        ]}
                      >
                        {l.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 4. Currency Selector */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.textDim }]}>
                {t.currency}
              </Text>
              <View style={styles.gridRow}>
                {currencies.map((curr) => {
                  const info = CURRENCY_INFO[curr];
                  const isSelected = currentCurrency === curr;
                  return (
                    <TouchableOpacity
                      key={curr}
                      onPress={() => onSelectCurrency(curr)}
                      style={[
                        styles.currCard,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.cardLight,
                          borderColor: isSelected ? colors.primary : colors.cardBorder,
                        },
                      ]}
                    >
                      <View style={styles.currLeft}>
                        <Text style={styles.flagIconSmall}>{info.flag}</Text>
                        <Text
                          style={[
                            styles.currCode,
                            {
                              color: isSelected ? colors.primaryText : colors.text,
                              fontWeight: isSelected ? '800' : '600',
                            },
                          ]}
                        >
                          {curr}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.currSymbol,
                          {
                            color: isSelected ? colors.primaryText : colors.textMuted,
                          },
                        ]}
                      >
                        {info.symbol}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 5. OTA Updates & Shake to Update */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.textDim }]}>
                {t.updatesSection}
              </Text>
              <View
                style={[
                  styles.updateCard,
                  {
                    backgroundColor: colors.cardLight,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                {/* Manual Check Button */}
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    setTimeout(() => {
                      onCheckUpdates();
                    }, 250);
                  }}
                  activeOpacity={0.8}
                  style={[styles.updateCheckBtn, { backgroundColor: colors.lime }]}
                >
                  <Ionicons name="cloud-download-outline" size={18} color={colors.limeText} />
                  <Text style={[styles.updateCheckBtnText, { color: colors.limeText }]}>
                    {t.checkForUpdates}
                  </Text>
                </TouchableOpacity>

                <View style={[styles.legalDivider, { backgroundColor: colors.cardBorder, marginVertical: 12 }]} />

                {/* Shake To Update Switch */}
                <TouchableOpacity
                  onPress={() => onToggleShakeToUpdate(!shakeToUpdate)}
                  activeOpacity={0.85}
                  style={styles.shakeRow}
                >
                  <View style={styles.shakeLeft}>
                    <View
                      style={[
                        styles.shakeIconWrap,
                        {
                          backgroundColor: shakeToUpdate
                            ? colors.limeGlow
                            : 'rgba(150, 150, 150, 0.15)',
                        },
                      ]}
                    >
                      <Ionicons
                        name="phone-portrait-outline"
                        size={18}
                        color={shakeToUpdate ? colors.lime : colors.textMuted}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.shakeTitle, { color: colors.text }]}>
                        {t.shakeToUpdateTitle}
                      </Text>
                      <Text style={[styles.shakeSubtitle, { color: colors.textMuted }]}>
                        {t.shakeToUpdateDesc}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.togglePill,
                      {
                        backgroundColor: shakeToUpdate ? colors.lime : colors.card,
                        borderColor: shakeToUpdate ? colors.lime : colors.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.togglePillText,
                        { color: shakeToUpdate ? colors.limeText : colors.textMuted },
                      ]}
                    >
                      {shakeToUpdate ? 'ON' : 'OFF'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Shake Sensitivity Level Selector */}
                {shakeToUpdate && (
                  <View style={styles.sensitivityContainer}>
                    <Text style={[styles.sensitivityLabel, { color: colors.textMuted }]}>
                      {t.shakeSensitivity}:
                    </Text>
                    <View style={styles.sensitivityRow}>
                      {(['firm', 'medium', 'gentle'] as ShakeSensitivity[]).map((sens) => {
                        const isSelected = shakeSensitivity === sens;
                        const label =
                          sens === 'firm'
                            ? t.sensitivityFirm
                            : sens === 'medium'
                            ? t.sensitivityMedium
                            : t.sensitivityGentle;
                        return (
                          <TouchableOpacity
                            key={sens}
                            onPress={() => onSelectShakeSensitivity(sens)}
                            activeOpacity={0.8}
                            style={[
                              styles.sensBtn,
                              {
                                backgroundColor: isSelected ? colors.lime : colors.card,
                                borderColor: isSelected ? colors.lime : colors.cardBorder,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.sensBtnText,
                                {
                                  color: isSelected ? colors.limeText : colors.textDim,
                                  fontWeight: isSelected ? '800' : '600',
                                },
                              ]}
                            >
                              {label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <Text style={[styles.sensitivityHint, { color: colors.textDim }]}>
                      {t.sensitivityDesc}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* 6. Legal & Compliance Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.textDim }]}>
                {t.legalSection}
              </Text>
              <View
                style={[
                  styles.legalContainer,
                  {
                    backgroundColor: colors.cardLight,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => onOpenLegal('terms')}
                  style={styles.legalItem}
                >
                  <View style={styles.legalLeft}>
                    <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
                    <Text style={[styles.legalText, { color: colors.text }]}>
                      {t.termsOfService}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
                </TouchableOpacity>

                <View style={[styles.legalDivider, { backgroundColor: colors.cardBorder }]} />

                <TouchableOpacity
                  onPress={() => onOpenLegal('privacy')}
                  style={styles.legalItem}
                >
                  <View style={styles.legalLeft}>
                    <Ionicons name="lock-closed-outline" size={16} color={colors.primary} />
                    <Text style={[styles.legalText, { color: colors.text }]}>
                      {t.privacyPolicy}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
                </TouchableOpacity>

                <View style={[styles.legalDivider, { backgroundColor: colors.cardBorder }]} />

                <TouchableOpacity
                  onPress={() => onOpenLegal('cookies')}
                  style={styles.legalItem}
                >
                  <View style={styles.legalLeft}>
                    <Ionicons name="cafe-outline" size={16} color={colors.primary} />
                    <Text style={[styles.legalText, { color: colors.text }]}>
                      {t.cookiePolicy}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Version & Close Button */}
            <View style={styles.footerSection}>
              <Text style={[styles.versionText, { color: colors.textDim }]}>
                VOUT v{APP_VERSION} • React Native &amp; Expo
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.applyButton, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.applyButtonText, { color: colors.primaryText }]}>
                  {t.apply}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '88%',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  dragHandle: {
    width: 44,
    height: 4,
    backgroundColor: 'rgba(150, 150, 150, 0.35)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  toggleText: {
    fontSize: 13,
  },
  swatchesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 18,
    borderWidth: 1,
  },
  swatchBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 3,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langCard: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  flagIcon: {
    fontSize: 18,
  },
  langLabel: {
    fontSize: 13,
  },
  currCard: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  currLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flagIconSmall: {
    fontSize: 16,
  },
  currCode: {
    fontSize: 13,
  },
  currSymbol: {
    fontSize: 14,
    fontWeight: '800',
  },
  legalContainer: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  legalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  legalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legalText: {
    fontSize: 13,
    fontWeight: '600',
  },
  legalDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  updateCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  updateCheckBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  updateCheckBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  shakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  shakeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  shakeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shakeTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  shakeSubtitle: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  togglePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  togglePillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  sensitivityContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  sensitivityLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sensitivityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sensBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensBtnText: {
    fontSize: 11,
  },
  sensitivityHint: {
    fontSize: 10,
    marginTop: 6,
    lineHeight: 14,
  },
  footerSection: {
    marginTop: 10,
    alignItems: 'center',
  },
  accountCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  accountAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountName: {
    fontSize: 14,
    fontWeight: '800',
  },
  accountEmail: {
    fontSize: 12,
  },
  accountSync: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  connectBtn: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectBtnText: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  versionText: {
    fontSize: 11,
    marginBottom: 14,
  },
  applyButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
