import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../utils/theme';
import { getTranslations } from '../utils/i18n';

interface AddContactModalProps {
  visible: boolean;
  onClose: () => void;
  colors: ThemeColors;
  locale: any;
  onAddContact: (name: string, handle: string) => void;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({
  visible,
  onClose,
  colors,
  locale,
  onAddContact,
}) => {
  const t = getTranslations(locale);
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(t.addContactTitle, 'Please enter a contact name');
      return;
    }
    const cleanHandle = handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim() || name.toLowerCase().replace(/\s+/g, '')}`;
    onAddContact(name.trim(), cleanHandle);
    setName('');
    setHandle('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />

        <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBox, { backgroundColor: colors.cardLight }]}>
                <Ionicons name="person-add-outline" size={20} color={colors.lime} />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>{t.addContactTitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.cardLight }]}>
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Form fields */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textDim }]}>{t.contactName}</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Rachel Adams"
              placeholderTextColor={colors.textDim}
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
              autoFocus
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.textDim }]}>{t.contactHandle}</Text>
            <TextInput
              value={handle}
              onChangeText={setHandle}
              placeholder="e.g. @rachel"
              placeholderTextColor={colors.textDim}
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.cancelBtn, { backgroundColor: colors.cardLight }]}
            >
              <Text style={[styles.cancelBtnText, { color: colors.textMuted }]}>{t.cancel}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              style={[styles.confirmBtn, { backgroundColor: colors.lime }]}
            >
              <Text style={[styles.confirmBtnText, { color: colors.limeText }]}>{t.confirm}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 28,
    borderWidth: 1,
    padding: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1.5,
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
