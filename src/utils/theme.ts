import { AccentTheme, AppTheme, AccentOption } from '../types/expense';

export interface ThemeColors {
  bg: string;
  card: string;
  cardBorder: string;
  cardLight: string;
  text: string;
  textMuted: string;
  textDim: string;
  inputBg: string;
  inputBorder: string;
  primary: string;
  primaryText: string;
  accent: string;
  accentText: string;
  success: string;
  warning: string;
  danger: string;
  purple: string;
  lime: string;
  limeText: string;
  limeGlow: string;
  limeGlowStrong: string;
  pillActiveBg: string;
  pillActiveText: string;
  pillInactiveBg: string;
  pillInactiveText: string;
  borderSubtle: string;
  tabBarBg: string;
  tabBarBorder: string;
  keypadBg: string;
  keypadText: string;
}

export const ACCENT_PALETTES: AccentOption[] = [
  { id: 'lime', name: 'Cyber Lime (Flagship)', hex: '#C6F827', colorClass: 'bg-[#C6F827]' },
  { id: 'emerald', name: 'Emerald', hex: '#10B981', colorClass: 'bg-[#10B981]' },
  { id: 'indigo', name: 'Electric Indigo', hex: '#6366F1', colorClass: 'bg-[#6366F1]' },
  { id: 'rose', name: 'Rose Neon', hex: '#F43F5E', colorClass: 'bg-[#F43F5E]' },
  { id: 'amber', name: 'Amber Gold', hex: '#F59E0B', colorClass: 'bg-[#F59E0B]' },
  { id: 'cyan', name: 'Cyber Cyan', hex: '#06B6D4', colorClass: 'bg-[#06B6D4]' },
  { id: 'violet', name: 'Clay Violet', hex: '#8B5CF6', colorClass: 'bg-[#8B5CF6]' },
];

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getThemeColors(mode: AppTheme = 'dark', accent: AccentTheme = 'lime'): ThemeColors {
  const selectedAccent = ACCENT_PALETTES.find((a) => a.id === accent) || ACCENT_PALETTES[0];
  const accentHex = selectedAccent.hex;
  const isLightAccent = accent === 'lime' || accent === 'amber' || accent === 'cyan';
  const accentTextColor = isLightAccent ? '#0C1008' : '#FFFFFF';

  if (mode === 'dark') {
    return {
      bg: '#0A0E14',
      card: '#121824',
      cardBorder: '#1E293B',
      cardLight: '#182030',
      text: '#FFFFFF',
      textMuted: '#94A3B8',
      textDim: '#64748B',
      inputBg: '#0F1520',
      inputBorder: '#1E293B',
      primary: accentHex,
      primaryText: accentTextColor,
      accent: accentHex,
      accentText: accentTextColor,
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#F87171',
      purple: '#8B5CF6',
      // DYNAMIC: follows the active accent theme selected by the user
      lime: accentHex,
      limeText: accentTextColor,
      limeGlow: hexToRgba(accentHex, 0.16),
      limeGlowStrong: hexToRgba(accentHex, 0.28),
      pillActiveBg: accentHex,
      pillActiveText: accentTextColor,
      pillInactiveBg: '#182030',
      pillInactiveText: '#94A3B8',
      borderSubtle: 'rgba(255, 255, 255, 0.08)',
      tabBarBg: '#0D121B',
      tabBarBorder: '#1E293B',
      keypadBg: '#121824',
      keypadText: '#FFFFFF',
    };
  }

  // Light Mode
  return {
    bg: '#F8FAFC',
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',
    cardLight: '#F1F5F9',
    text: '#0F172A',
    textMuted: '#64748B',
    textDim: '#94A3B8',
    inputBg: '#FFFFFF',
    inputBorder: '#CBD5E1',
    primary: accentHex,
    primaryText: accentTextColor,
    accent: accentHex,
    accentText: accentTextColor,
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    purple: '#7C3AED',
    lime: accentHex,
    limeText: accentTextColor,
    limeGlow: hexToRgba(accentHex, 0.16),
    limeGlowStrong: hexToRgba(accentHex, 0.28),
    pillActiveBg: accentHex,
    pillActiveText: accentTextColor,
    pillInactiveBg: '#F1F5F9',
    pillInactiveText: '#64748B',
    borderSubtle: 'rgba(0, 0, 0, 0.06)',
    tabBarBg: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    keypadBg: '#F1F5F9',
    keypadText: '#0F172A',
  };
}
