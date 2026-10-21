import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../utils/theme';
import { AppLocale } from '../types/expense';

interface LegalModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy' | 'cookies' | null;
  locale: AppLocale;
  colors: ThemeColors;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  visible,
  onClose,
  type,
  locale,
  colors,
}) => {
  if (!visible || !type) return null;

  const isEs = locale === 'es';

  const getContent = () => {
    switch (type) {
      case 'terms':
        return {
          title: isEs ? 'Términos y Condiciones' : 'Terms of Service',
          subtitle: isEs ? 'Acuerdo de Usuario y Operaciones' : 'User Agreement & Operations',
          body: isEs
            ? `1. ACEPTACIÓN DE LOS TÉRMINOS
Al acceder y utilizar la aplicación móvil VOUT Pocket, usted acepta quedar vinculado por estos Términos de Servicio. Si no está de acuerdo, por favor desinstale la aplicación.

2. NATURALEZA DEL SERVICIO
VOUT Pocket opera como un gestor financiero personal, control de presupuestos y simulador de transferencias y tarjetas. La aplicación funciona con persistencia local fuera de línea (Offline-First) mediante almacenamiento encriptado seguro en su dispositivo.

3. RESPONSABILIDAD DEL USUARIO
Usted es el único responsable de la exactitud de los montos, límites de transferencia y categorías ingresadas. Mantenga su dispositivo protegido mediante biometría o clave de acceso.

4. DERECHOS DE PROPIEDAD INTELECTUAL
El diseño visual, interfaz en tonos chartreuse/lime neón, tipografía, lógica de cálculo y código fuente son propiedad exclusiva de VOUT. Se prohíbe la reproducción o explotación comercial no autorizada.

5. MODIFICACIONES
Nos reservamos el derecho de actualizar estos términos en cualquier momento. Las actualizaciones se notificarán dentro de la aplicación.`
            : `1. ACCEPTANCE OF TERMS
By accessing and using VOUT Pocket mobile application, you agree to be bound by these Terms of Service. If you do not agree, please discontinue using the application.

2. SERVICE NATURE
VOUT Pocket functions as a personal finance tracker, budget manager, and card & transfer simulator. It utilizes an offline-first architecture storing data securely on your local device.

3. USER RESPONSIBILITIES
You are solely responsible for verifying amounts, transfer limits, and transaction entries. Please ensure your device is secured via biometric or passcode lock.

4. INTELLECTUAL PROPERTY
The unique visual design, neon-lime aesthetic, typography, calculation engines, and source code are the proprietary property of VOUT.

5. CHANGES TO TERMS
We reserve the right to revise these terms at any time. Continued use of the application constitutes acceptance of updated terms.`,
        };
      case 'privacy':
        return {
          title: isEs ? 'Política de Privacidad' : 'Privacy Policy',
          subtitle: isEs ? 'Protección y Tratamiento de Datos' : 'Data Protection & Privacy',
          body: isEs
            ? `1. PRIVACIDAD POR DISEÑO
En VOUT Pocket creemos firmemente que sus finanzas son privadas. La aplicación no vende ni comparte su información personal o saldos financieros con anunciantes ni terceros.

2. ALMACENAMIENTO DE DATOS
Todos los balances, transacciones, tarjetas y preferencias se almacenan localmente en su dispositivo mediante AsyncStorage y almacenamiento en espacio seguro de la aplicación.

3. DERECHOS DEL TITULAR (GDPR / CCPA)
Usted tiene derecho en todo momento a exportar, editar o eliminar completamente sus datos desde el menú de opciones o borrando los datos de la aplicación.

4. SEGURIDAD
Aplicamos principios de reducción al mínimo de datos y encriptación local para asegurar que nadie pueda acceder a su información sin acceso físico a su dispositivo desbloqueado.`
            : `1. PRIVACY BY DESIGN
VOUT Pocket is designed with user privacy as a core tenet. We do not sell, rent, or monetize your financial logs, budgets, or personal transaction history.

2. DATA STORAGE
All balances, transactions, payment cards, and user configurations are persisted locally on your device using encrypted sandbox storage.

3. USER RIGHTS (GDPR / CCPA COMPLIANCE)
You maintain full control to review, edit, export, or permanently erase your transaction history and wallet records at any time.

4. SECURITY PROTOCOLS
We adhere to data minimization principles ensuring that no sensitive credentials leave your local device runtime environment.`,
        };
      case 'cookies':
        return {
          title: isEs ? 'Política de Cookies y Almacenamiento' : 'Cookie & Storage Policy',
          subtitle: isEs ? 'Uso de AsyncStorage y Preferencias' : 'AsyncStorage & Local Caching',
          body: isEs
            ? `1. USO DE ALMACENAMIENTO LOCAL
En entornos móviles, VOUT Pocket no utiliza cookies web de rastreo publicitario. En su lugar, emplea almacenamiento de claves y valores (AsyncStorage) para guardar:
- Sus preferencias de tema (modo oscuro / claro y color de acento).
- Su divisa seleccionada (ARS, USD, EUR, CNY, BRL).
- Su idioma preferido (español, inglés, portugués, chino).
- Su historial de transacciones y contactos frecuentes.

2. BORRADO DE DATOS
Puede restablecer o eliminar este almacenamiento en cualquier momento a través de la configuración de la aplicación o del sistema operativo.`
            : `1. LOCAL STORAGE MECHANISM
In our native mobile environment, VOUT Pocket does not use third-party tracking web cookies. Instead, secure key-value AsyncStorage is utilized solely to remember:
- Theme settings (dark/light mode and chosen accent palette).
- Selected currency (USD, ARS, EUR, CNY, BRL).
- Interface language preference.
- Cached contacts and transaction records.

2. CLEARING STORAGE
You can purge or reset this local cache at any moment via the application settings or operating system app settings.`,
        };
    }
  };

  const content = getContent();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />

        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.subtitle, { color: colors.primary }]}>{content.subtitle}</Text>
              <Text style={[styles.title, { color: colors.text }]}>{content.title}</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.cardLight }]}
            >
              <Ionicons name="close" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollBody}
          >
            <Text style={[styles.bodyText, { color: colors.textMuted }]}>
              {content.body}
            </Text>
          </ScrollView>

          {/* Footer button */}
          <TouchableOpacity
            onPress={onClose}
            style={[styles.doneBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.doneBtnText, { color: colors.primaryText }]}>
              {isEs ? 'Entendido y Acepto' : 'Understood & Accept'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '82%',
    borderRadius: 28,
    borderWidth: 1,
    padding: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  scrollBody: {
    paddingVertical: 10,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 22,
    fontWeight: '500',
  },
  doneBtn: {
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
