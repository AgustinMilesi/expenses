import './global.css';
import React, { useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  AccentTheme,
  ActiveTab,
  AppLocale,
  AppTheme,
  CardItem,
  ContactItem,
  Currency,
  TransactionItem,
  UserWallet,
} from './src/types/expense';
import {
  loadCards,
  loadContacts,
  loadPreferences,
  loadTransactions,
  loadWallet,
  saveCards,
  saveContacts,
  savePreferences,
  saveTransactions,
  saveWallet,
  INITIAL_WALLET,
} from './src/utils/storage';
import { getThemeColors } from './src/utils/theme';
import { getTranslations } from './src/utils/i18n';
import { generateTrxId, getCurrentTimeFormatted, formatCurrency } from './src/utils/formatters';

// Screen & Modal Components
import { HomeScreen } from './src/components/HomeScreen';
import { SendMoneyScreen } from './src/components/SendMoneyScreen';
import { CardsScreen } from './src/components/CardsScreen';
import { HistoryView } from './src/components/HistoryView';
import { SearchView } from './src/components/SearchView';
import { BottomNavBar } from './src/components/BottomNavBar';
import { PreferencesModal } from './src/components/PreferencesModal';
import { QRScannerModal } from './src/components/QRScannerModal';
import { TopupModal } from './src/components/TopupModal';
import { AddContactModal } from './src/components/AddContactModal';
import { LegalModal } from './src/components/LegalModal';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Core Data
  const [wallet, setWallet] = useState<UserWallet>(INITIAL_WALLET);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [cards, setCards] = useState<CardItem[]>([]);

  // Preferences
  const [theme, setTheme] = useState<AppTheme>('dark');
  const [accent, setAccent] = useState<AccentTheme>('lime');
  const [locale, setLocale] = useState<AppLocale>('es');
  const [currency, setCurrency] = useState<Currency>('USD');

  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentScreen, setCurrentScreen] = useState<'main' | 'sendMoney'>('main');

  // Modals
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | 'cookies' | null>(null);

  // Theme & Translations
  const colors = useMemo(() => getThemeColors(theme, accent), [theme, accent]);
  const t = useMemo(() => getTranslations(locale), [locale]);

  // Load Initial Persisted Data
  useEffect(() => {
    async function init() {
      try {
        const [loadedPrefs, loadedWallet, loadedContacts, loadedTrx, loadedCards] =
          await Promise.all([
            loadPreferences(),
            loadWallet(),
            loadContacts(),
            loadTransactions(),
            loadCards(),
          ]);

        setTheme(loadedPrefs.theme);
        setAccent(loadedPrefs.accent || 'lime');
        setLocale(loadedPrefs.locale);
        setCurrency(loadedPrefs.currency);

        setWallet({
          ...loadedWallet,
          currency: loadedPrefs.currency || loadedWallet.currency,
        });
        setContacts(loadedContacts);
        setTransactions(loadedTrx);
        setCards(loadedCards);
      } catch (err) {
        console.error('Error during initialization:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Preference Handlers
  const handleSelectTheme = async (newTheme: AppTheme) => {
    setTheme(newTheme);
    await savePreferences({ theme: newTheme, accent, locale, currency });
  };

  const handleSelectAccent = async (newAccent: AccentTheme) => {
    setAccent(newAccent);
    await savePreferences({ theme, accent: newAccent, locale, currency });
  };

  const handleSelectLocale = async (newLocale: AppLocale) => {
    setLocale(newLocale);
    await savePreferences({ theme, accent, locale: newLocale, currency });
  };

  const handleSelectCurrency = async (newCurrency: Currency) => {
    setCurrency(newCurrency);
    const updatedWallet = { ...wallet, currency: newCurrency };
    setWallet(updatedWallet);
    await Promise.all([
      savePreferences({ theme, accent, locale, currency: newCurrency }),
      saveWallet(updatedWallet),
    ]);
  };

  // Transaction & Financial Logic (Strictly dynamic, no sample numbers!)
  const handleSendSuccess = async (amount: number, recipientName: string) => {
    const newBalance = Math.max(0, wallet.balance - amount);
    const updatedWallet: UserWallet = {
      ...wallet,
      balance: newBalance,
    };

    const newTrx: TransactionItem = {
      id: `tx-${Date.now()}`,
      type: 'send',
      title: `Send Money to ${recipientName}`,
      recipientOrSender: recipientName,
      amount,
      trxId: generateTrxId(),
      time: getCurrentTimeFormatted(),
      date: 'Today',
      category: 'transfer',
    };

    const updatedTrx = [newTrx, ...transactions];

    setWallet(updatedWallet);
    setTransactions(updatedTrx);

    await Promise.all([saveWallet(updatedWallet), saveTransactions(updatedTrx)]);

    Alert.alert(
      t.transferSuccessTitle,
      t.transferSuccessMsg(formatCurrency(amount, currency), recipientName),
      [
        {
          text: 'OK',
          onPress: () => setCurrentScreen('main'),
        },
      ]
    );
  };

  const handleConfirmTopup = async (amount: number) => {
    const newBalance = wallet.balance + amount;
    const updatedWallet: UserWallet = {
      ...wallet,
      balance: newBalance,
    };

    const newTrx: TransactionItem = {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      title: 'Topup / Account Deposit',
      recipientOrSender: 'Bank Account Topup',
      amount,
      trxId: generateTrxId(),
      time: getCurrentTimeFormatted(),
      date: 'Today',
      category: 'income',
    };

    const updatedTrx = [newTrx, ...transactions];

    setWallet(updatedWallet);
    setTransactions(updatedTrx);

    await Promise.all([saveWallet(updatedWallet), saveTransactions(updatedTrx)]);

    Alert.alert('Topup Success', `Successfully added ${formatCurrency(amount, currency)} to your balance.`);
  };

  const handleToggleFreeze = async (cardId: string) => {
    const updatedCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFrozen: !c.isFrozen } : c
    );
    setCards(updatedCards);
    await saveCards(updatedCards);
    const card = updatedCards.find((c) => c.id === cardId);
    Alert.alert(
      card?.isFrozen ? 'Card Frozen' : 'Card Active',
      card?.isFrozen ? t.cardFrozenNotice : 'Your card is now ready for transactions.'
    );
  };

  const handleAddCard = async () => {
    const randomCardNumber = `7820 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
    const newCard: CardItem = {
      id: `card-${Date.now()}`,
      cardHolder: wallet.accountHolder,
      cardNumber: randomCardNumber,
      expiry: '12/32',
      type: 'Credit',
      brand: 'VISA',
      isFrozen: false,
      dailyLimit: 7500,
    };
    const updated = [...cards, newCard];
    setCards(updated);
    await saveCards(updated);
    Alert.alert('Card Added', `A new ${newCard.brand} ${newCard.type} card was generated.`);
  };

  const handleAddContact = async (name: string, handle: string) => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const masked = `••••${Math.floor(10 + Math.random() * 90)}`;
    const newContact: ContactItem = {
      id: `c-${Date.now()}`,
      name,
      handle,
      maskedAccount: masked,
      initials: initials || 'CO',
    };

    const updated = [...contacts, newContact];
    setContacts(updated);
    await saveContacts(updated);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'statements':
        Alert.alert('Statements', 'Account statements export generated and sent to email.');
        break;
      case 'bills':
        Alert.alert('Bills Pay', 'All linked utility and credit bills are up to date.');
        break;
      case 'loans':
        Alert.alert('Instant Loans', 'Pre-approved loan credit line up to $15,000.00 at 0% APR.');
        break;
      case 'limit':
        Alert.alert('Daily Limit', `Current card daily limit: ${formatCurrency(5000, currency)}`);
        break;
      case 'deposits':
        Alert.alert('High-Yield Deposits', 'Active savings vault generating 7.8% APY.');
        break;
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

        {/* View Switcher: Send Money Screen vs Main Navigation */}
        {currentScreen === 'sendMoney' ? (
          <SendMoneyScreen
            wallet={wallet}
            contacts={contacts}
            currency={currency}
            colors={colors}
            locale={locale}
            onBack={() => setCurrentScreen('main')}
            onOpenNotifications={() => Alert.alert(t.notifications, 'All accounts synchronized.')}
            onAddContact={() => setIsAddContactOpen(true)}
            onSendSuccess={handleSendSuccess}
          />
        ) : (
          <View style={styles.contentWrapper}>
            {activeTab === 'home' && (
              <HomeScreen
                wallet={wallet}
                contacts={contacts}
                transactions={transactions}
                currency={currency}
                colors={colors}
                locale={locale}
                onOpenPreferences={() => setIsPreferencesOpen(true)}
                onOpenNotifications={() => Alert.alert(t.notifications, 'No pending alerts.')}
                onOpenAchievements={() => Alert.alert(t.achievements, 'VIP Level 2: 1.5% cashback on all card payments.')}
                onNavigateToSend={() => setCurrentScreen('sendMoney')}
                onOpenRequest={() => {
                  Alert.alert('Request Money', 'Share your payment link or QR code to receive funds.', [
                    { text: 'Show QR Code', onPress: () => setIsQRScannerOpen(true) },
                    { text: 'Cancel', style: 'cancel' },
                  ]);
                }}
                onOpenPayment={() => setIsQRScannerOpen(true)}
                onOpenWithdraw={() => {
                  Alert.alert('Withdraw Funds', `Transfer to linked bank account? Balance: ${formatCurrency(wallet.balance, currency)}`, [
                    {
                      text: 'Withdraw $200.00',
                      onPress: () => handleSendSuccess(200, 'Linked Bank Checking Acct'),
                    },
                    { text: 'Cancel', style: 'cancel' },
                  ]);
                }}
                onAddContact={() => setIsAddContactOpen(true)}
                onViewAllTransactions={() => setActiveTab('history')}
                onSelectContactToSend={(c) => setCurrentScreen('sendMoney')}
              />
            )}

            {activeTab === 'cards' && (
              <CardsScreen
                cards={cards}
                wallet={wallet}
                currency={currency}
                colors={colors}
                locale={locale}
                onBack={() => setActiveTab('home')}
                onOpenNotifications={() => Alert.alert(t.notifications, 'No card alerts.')}
                onNavigateToSend={() => setCurrentScreen('sendMoney')}
                onOpenTopup={() => setIsTopupOpen(true)}
                onToggleFreeze={handleToggleFreeze}
                onAddCard={handleAddCard}
                onOpenQuickAction={handleQuickAction}
              />
            )}

            {activeTab === 'history' && (
              <HistoryView
                transactions={transactions}
                currency={currency}
                colors={colors}
                locale={locale}
                onOpenPreferences={() => setIsPreferencesOpen(true)}
                onClearHistory={async () => {
                  setTransactions([]);
                  await saveTransactions([]);
                }}
              />
            )}

            {activeTab === 'search' && (
              <SearchView
                transactions={transactions}
                contacts={contacts}
                currency={currency}
                colors={colors}
                locale={locale}
                onSelectContact={(c) => setCurrentScreen('sendMoney')}
              />
            )}

            {/* Floating Curved Bottom Navigation Dock */}
            <BottomNavBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onOpenQRScanner={() => setIsQRScannerOpen(true)}
              colors={colors}
              locale={locale}
            />
          </View>
        )}

        {/* 1. Cross-Project Preferences Block / Modal ("El cuadro de cambiar idioma, moneda y theme") */}
        <PreferencesModal
          visible={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
          currentAccent={accent}
          onSelectAccent={handleSelectAccent}
          currentLocale={locale}
          onSelectLocale={handleSelectLocale}
          currentCurrency={currency}
          onSelectCurrency={handleSelectCurrency}
          onOpenLegal={(type) => {
            setIsPreferencesOpen(false);
            setLegalModalType(type);
          }}
          colors={colors}
        />

        {/* 2. QR Scanner Modal */}
        <QRScannerModal
          visible={isQRScannerOpen}
          onClose={() => setIsQRScannerOpen(false)}
          wallet={wallet}
          currency={currency}
          colors={colors}
          onSimulateReceive={(amount, from) => {
            handleConfirmTopup(amount);
          }}
        />

        {/* 3. Topup Modal */}
        <TopupModal
          visible={isTopupOpen}
          onClose={() => setIsTopupOpen(false)}
          currency={currency}
          colors={colors}
          locale={locale}
          onConfirmTopup={handleConfirmTopup}
        />

        {/* 4. Add Contact Modal */}
        <AddContactModal
          visible={isAddContactOpen}
          onClose={() => setIsAddContactOpen(false)}
          colors={colors}
          locale={locale}
          onAddContact={handleAddContact}
        />

        {/* 5. In-App Legal & Compliance Modal */}
        <LegalModal
          visible={legalModalType !== null}
          onClose={() => setLegalModalType(null)}
          type={legalModalType}
          locale={locale}
          colors={colors}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
});
