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

export function getThemeColors(mode: AppTheme = 'dark', accent: AccentTheme = 'lime'): ThemeColors {
  const selectedAccent = ACCENT_PALETTES.find((a) => a.id === accent) || ACCENT_PALETTES[0];
  const accentHex = selectedAccent.hex;
  const isLightAccent = accent === 'lime' || accent === 'amber';
  const accentTextColor = isLightAccent ? '#0C1008' : '#FFFFFF';

  if (mode === 'dark') {
    return {
      bg: '#0B0F07',
      card: '#141A10',
      cardBorder: '#232D1C',
      cardLight: '#1B2316',
      text: '#FFFFFF',
      textMuted: '#9BA3AF',
      textDim: '#60695B',
      inputBg: '#11160D',
      inputBorder: '#283320',
      primary: accentHex,
      primaryText: accentTextColor,
      accent: accentHex,
      accentText: accentTextColor,
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#F87171',
      purple: '#8B5CF6',
      lime: '#C6F827',
      limeText: '#0C1008',
      pillActiveBg: accentHex,
      pillActiveText: accentTextColor,
      pillInactiveBg: '#1B2316',
      pillInactiveText: '#9BA3AF',
      borderSubtle: 'rgba(255, 255, 255, 0.08)',
      tabBarBg: '#131A0F',
      tabBarBorder: '#222C1B',
      keypadBg: '#171E13',
      keypadText: '#FFFFFF',
    };
  }

  // Light Mode
  return {
    bg: '#F5F7EE',
    card: '#FFFFFF',
    cardBorder: '#E2E8D5',
    cardLight: '#EEF3E3',
    text: '#0C1008',
    textMuted: '#5E6754',
    textDim: '#8A9480',
    inputBg: '#FFFFFF',
    inputBorder: '#CBD5BE',
    primary: accent === 'lime' ? '#5E880B' : accentHex,
    primaryText: '#FFFFFF',
    accent: accentHex,
    accentText: accentTextColor,
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    purple: '#7C3AED',
    lime: '#C6F827',
    limeText: '#0C1008',
    pillActiveBg: accent === 'lime' ? '#5E880B' : accentHex,
    pillActiveText: '#FFFFFF',
    pillInactiveBg: '#EEF3E3',
    pillInactiveText: '#5E6754',
    borderSubtle: 'rgba(0, 0, 0, 0.06)',
    tabBarBg: '#FFFFFF',
    tabBarBorder: '#E2E8D5',
    keypadBg: '#E9EFE0',
    keypadText: '#0C1008',
  };
}
