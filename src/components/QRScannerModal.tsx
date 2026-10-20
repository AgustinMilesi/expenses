import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Currency, UserWallet } from '../types/expense';
import { ThemeColors } from '../utils/theme';
import { formatCurrency } from '../utils/formatters';

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
  wallet: UserWallet;
  currency: Currency;
  colors: ThemeColors;
  onSimulateReceive: (amount: number, from: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  visible,
  onClose,
  wallet,
  currency,
  colors,
  onSimulateReceive,
}) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'myCode'>('scan');

  const handleSimulatePaymentScan = () => {
    Alert.alert(
      'Simulate QR Payment',
      'Choose simulation action:',
      [
        {
          text: 'Receive $500.00',
          onPress: () => {
            onSimulateReceive(500, 'Merchant Refund / Store Pay');
            onClose();
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />

        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.subtitle, { color: colors.lime }]}>Contactless &amp; QR</Text>
              <Text style={[styles.title, { color: colors.text }]}>
                {activeTab === 'scan' ? 'Scan to Pay' : 'Receive Money'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.cardLight }]}>
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Tab Switcher */}
          <View style={[styles.tabBar, { backgroundColor: colors.cardLight, borderColor: colors.cardBorder }]}>
            <TouchableOpacity
              onPress={() => setActiveTab('scan')}
              style={[
                styles.tabBtn,
                activeTab === 'scan' && { backgroundColor: colors.card },
              ]}
            >
              <Text style={[styles.tabText, { color: activeTab === 'scan' ? colors.lime : colors.textMuted }]}>
                Scan QR Code
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('myCode')}
              style={[
                styles.tabBtn,
                activeTab === 'myCode' && { backgroundColor: colors.card },
              ]}
            >
              <Text style={[styles.tabText, { color: activeTab === 'myCode' ? colors.lime : colors.textMuted }]}>
                My QR Code
              </Text>
            </TouchableOpacity>
          </View>

          {/* Scanner / QR Display Viewfinder */}
          {activeTab === 'scan' ? (
            <View style={styles.scannerWrapper}>
              <View style={[styles.viewfinder, { borderColor: colors.lime }]}>
                <View style={[styles.laserBeam, { backgroundColor: colors.lime }]} />
                <Ionicons name="qr-code-outline" size={120} color="rgba(255,255,255,0.15)" />
              </View>
              <Text style={[styles.instructionText, { color: colors.textMuted }]}>
                Align the merchant QR code within the frame to send or request payment instantly.
              </Text>
              <TouchableOpacity
                onPress={handleSimulatePaymentScan}
                style={[styles.actionBtn, { backgroundColor: colors.lime }]}
              >
                <Text style={[styles.actionBtnText, { color: colors.limeText }]}>
                  Simulate QR Scan
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.scannerWrapper}>
              {/* My QR Card */}
              <View style={[styles.qrCodeCard, { backgroundColor: '#FFFFFF' }]}>
                <Ionicons name="qr-code" size={170} color="#0C1008" />
                <Text style={styles.qrUserText}>@{wallet.username}</Text>
                <Text style={styles.qrAccountText}>{wallet.accountNumber}</Text>
              </View>
              <Text style={[styles.instructionText, { color: colors.textMuted }]}>
                Show this QR code to another PocketWallet user to receive payments.
              </Text>
              <View style={[styles.balancePill, { backgroundColor: colors.cardLight }]}>
                <Text style={[styles.balancePillText, { color: colors.text }]}>
                  Account Balance: <Text style={{ color: colors.lime, fontWeight: '900' }}>{formatCurrency(wallet.balance, currency)}</Text>
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '800',
  },
  scannerWrapper: {
    alignItems: 'center',
  },
  viewfinder: {
    width: 220,
    height: 220,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  laserBeam: {
    position: 'absolute',
    top: '48%',
    left: 10,
    right: 10,
    height: 2,
    shadowColor: '#C6F827',
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  qrCodeCard: {
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  qrUserText: {
    color: '#0C1008',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 6,
  },
  qrAccountText: {
    color: '#60695B',
    fontSize: 12,
    fontWeight: '600',
  },
  instructionText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  actionBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '900',
  },
  balancePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  balancePillText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
