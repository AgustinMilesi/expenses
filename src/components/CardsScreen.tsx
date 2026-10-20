import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CardItem, Currency, UserWallet } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { formatCardNumber, formatCurrency } from '../utils/formatters';
import { getTranslations } from '../utils/i18n';

interface CardsScreenProps {
  cards: CardItem[];
  wallet: UserWallet;
  currency: Currency;
  colors: ThemeColors;
  locale: any;
  onBack: () => void;
  onOpenNotifications: () => void;
  onNavigateToSend: () => void;
  onOpenTopup: () => void;
  onToggleFreeze: (cardId: string) => void;
  onAddCard: () => void;
  onOpenQuickAction: (action: string) => void;
}

export const CardsScreen: React.FC<CardsScreenProps> = ({
  cards,
  wallet,
  currency,
  colors,
  locale,
  onBack,
  onOpenNotifications,
  onNavigateToSend,
  onOpenTopup,
  onToggleFreeze,
  onAddCard,
  onOpenQuickAction,
}) => {
  const t = getTranslations(locale);
  const activeCard = cards.length > 0 ? cards[0] : null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t.cardsTitle}
        </Text>

        <TouchableOpacity
          onPress={onOpenNotifications}
          style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <Ionicons name="notifications-outline" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Main Physical Visa Card */}
        {activeCard ? (
          <View
            style={[
              styles.cardContainer,
              { backgroundColor: colors.lime },
              activeCard.isFrozen && styles.cardFrozenOverlay,
            ]}
          >
            {/* Holographic accent glow */}
            <View style={styles.cardHoloGlow} />

            {/* Top row: Name & VISA */}
            <View style={styles.cardTopRow}>
              <View>
                <Text style={[styles.cardHolderName, { color: colors.limeText }]}>
                  {activeCard.cardHolder}
                </Text>
                <View style={styles.chipRow}>
                  <Ionicons name="wifi" size={16} color={colors.limeText} style={{ transform: [{ rotate: '90deg' }] }} />
                  <Text style={[styles.cardType, { color: colors.limeText }]}>
                    {activeCard.type}
                  </Text>
                </View>
              </View>
              <Text style={[styles.visaLogo, { color: colors.limeText }]}>
                {activeCard.brand}
              </Text>
            </View>

            {/* Card Middle & Bottom details */}
            <View style={styles.cardBottomRow}>
              <View>
                <Text style={[styles.validThruLabel, { color: 'rgba(12, 16, 8, 0.6)' }]}>
                  {t.validThru}
                </Text>
                <Text style={[styles.validThruValue, { color: colors.limeText }]}>
                  {activeCard.expiry}
                </Text>
              </View>

              <Text style={[styles.cardNumberText, { color: colors.limeText }]}>
                {formatCardNumber(activeCard.cardNumber)}
              </Text>
            </View>

            {activeCard.isFrozen && (
              <View style={styles.frozenBadge}>
                <Ionicons name="snow" size={16} color="#FFFFFF" />
                <Text style={styles.frozenBadgeText}>CARD FROZEN</Text>
              </View>
            )}
          </View>
        ) : null}

        {/* Quick Actions Grid */}
        <View style={styles.actionsSection}>
          <Text style={[styles.actionsTitle, { color: colors.text }]}>
            {t.quickActions}
          </Text>

          {/* Row 1 */}
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              onPress={onNavigateToSend}
              style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.cardLight }]}>
                <Ionicons name="arrow-up-outline" size={22} color={colors.lime} style={{ transform: [{ rotate: '45deg' }] }} />
              </View>
              <Text style={[styles.actionTileText, { color: colors.lime }]} numberOfLines={1}>
                {t.send}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onOpenTopup}
              style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.cardLight }]}>
                <Ionicons name="add" size={22} color={colors.lime} />
              </View>
              <Text style={[styles.actionTileText, { color: colors.lime }]} numberOfLines={1}>
                {t.topup}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onOpenQuickAction('statements')}
              style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.cardLight }]}>
                <Ionicons name="document-text-outline" size={20} color={colors.lime} />
              </View>
              <Text style={[styles.actionTileText, { color: colors.lime }]} numberOfLines={1}>
                {t.statements}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onOpenQuickAction('bills')}
              style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.cardLight }]}>
                <Ionicons name="receipt-outline" size={20} color={colors.lime} />
              </View>
              <Text style={[styles.actionTileText, { color: colors.lime }]} numberOfLines={1}>
                {t.billsPay}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Row 2 */}
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              onPress={() => onOpenQuickAction('loans')}
              style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.cardLight }]}>
                <Ionicons name="cash-outline" size={20} color={colors.lime} />
              </View>
              <Text style={[styles.actionTileText, { color: colors.lime }]} numberOfLines={1}>
                {t.loans}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => activeCard && onToggleFreeze(activeCard.id)}
              style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.cardLight }]}>
                <Ionicons
                  name={activeCard?.isFrozen ? 'flame-outline' : 'snow-outline'}
                  size={20}
                  color={activeCard?.isFrozen ? colors.danger : colors.lime}
                />
              </View>
              <Text style={[styles.actionTileText, { color: activeCard?.isFrozen ? colors.danger : colors.lime }]} numberOfLines={1}>
                {activeCard?.isFrozen ? t.unfreezeCards : t.freezeCards}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onOpenQuickAction('limit')}
              style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.cardLight }]}>
                <Ionicons name="options-outline" size={20} color={colors.lime} />
              </View>
              <Text style={[styles.actionTileText, { color: colors.lime }]} numberOfLines={1}>
                {t.limitRequest}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onOpenQuickAction('deposits')}
              style={[styles.actionTile, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.cardLight }]}>
                <Ionicons name="wallet-outline" size={20} color={colors.lime} />
              </View>
              <Text style={[styles.actionTileText, { color: colors.lime }]} numberOfLines={1}>
                {t.deposits}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Cards Button */}
        <TouchableOpacity
          onPress={onAddCard}
          style={[styles.addCardsButton, { backgroundColor: colors.lime }]}
          activeOpacity={0.85}
        >
          <Text style={[styles.addCardsText, { color: colors.limeText }]}>
            {t.addCards}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  cardContainer: {
    borderRadius: 28,
    padding: 22,
    height: 200,
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  cardFrozenOverlay: {
    opacity: 0.65,
  },
  cardHoloGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHolderName: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  cardType: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  visaLogo: {
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  validThruLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  validThruValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  cardNumberText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  frozenBadge: {
    position: 'absolute',
    top: 16,
    right: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
  },
  frozenBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionTile: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionTileText: {
    fontSize: 10,
    fontWeight: '800',
  },
  addCardsButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardsText: {
    fontSize: 15,
    fontWeight: '900',
  },
});
