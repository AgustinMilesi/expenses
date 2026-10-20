import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActiveTab } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { getTranslations } from '../utils/i18n';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenQRScanner: () => void;
  colors: ThemeColors;
  locale: any;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  onOpenQRScanner,
  colors,
  locale,
}) => {
  const t = getTranslations(locale);

  return (
    <View style={styles.dockWrapper}>
      <View
        style={[
          styles.dockContainer,
          {
            backgroundColor: colors.tabBarBg,
            borderColor: colors.tabBarBorder,
          },
        ]}
      >
        {/* Tab 1: Home */}
        <TouchableOpacity
          onPress={() => onTabChange('home')}
          style={styles.tabItem}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={22}
            color={activeTab === 'home' ? colors.lime : colors.textDim}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'home' ? colors.lime : colors.textDim },
            ]}
          >
            {t.homeTab}
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Cards */}
        <TouchableOpacity
          onPress={() => onTabChange('cards')}
          style={styles.tabItem}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'cards' ? 'card' : 'card-outline'}
            size={22}
            color={activeTab === 'cards' ? colors.lime : colors.textDim}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'cards' ? colors.lime : colors.textDim },
            ]}
          >
            {t.cardsTab}
          </Text>
        </TouchableOpacity>

        {/* Center Floating Action Button: QR Scanner */}
        <View style={styles.centerFabAnchor}>
          <TouchableOpacity
            onPress={onOpenQRScanner}
            style={[
              styles.fabButton,
              {
                backgroundColor: colors.lime,
                shadowColor: colors.lime,
              },
            ]}
            activeOpacity={0.85}
          >
            <Ionicons name="scan" size={26} color={colors.limeText} />
          </TouchableOpacity>
        </View>

        {/* Tab 3: History */}
        <TouchableOpacity
          onPress={() => onTabChange('history')}
          style={styles.tabItem}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'history' ? 'receipt' : 'receipt-outline'}
            size={22}
            color={activeTab === 'history' ? colors.lime : colors.textDim}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'history' ? colors.lime : colors.textDim },
            ]}
          >
            {t.historyTab}
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Search */}
        <TouchableOpacity
          onPress={() => onTabChange('search')}
          style={styles.tabItem}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'search' ? 'search' : 'search-outline'}
            size={22}
            color={activeTab === 'search' ? colors.lime : colors.textDim}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'search' ? colors.lime : colors.textDim },
            ]}
          >
            {t.searchTab}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dockWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  dockContainer: {
    width: '100%',
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  centerFabAnchor: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    top: -14,
  },
  fabButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
});
