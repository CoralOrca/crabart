/**
 * CrabArt Design System Constants
 * Based on the design tokens provided
 */

export const DesignTokens = {
  fonts: {
    primary: 'Geist',
    secondary: 'Geist Mono',
  },
  
  typography: {
    h1: {
      size: 48,
      weight: 700,
      lineHeight: 1.2,
      letterSpacing: -0.02,
    },
    h2: {
      size: 32,
      weight: 700,
      lineHeight: 1.3,
      letterSpacing: -0.01,
    },
    h3: {
      size: 24,
      weight: 600,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    h4: {
      size: 18,
      weight: 600,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    body: {
      size: 16,
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    caption: {
      size: 13,
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: 0.01,
    },
    monoData: {
      size: 14,
      weight: 500,
      lineHeight: 1.6,
      letterSpacing: 0,
    },
  },
  
  spacing: {
    micro: 4,
    tight: 8,
    standard: 16,
    section: 24,
    card: 32,
    major: 64,
  },
  
  appearance: {
    radius: 10,
    borderWidth: 1,
    shadowOpacity: 15,
    shadowBlur: 10,
    transitionDuration: 150,
    disabledOpacity: 50,
    focusRingWidth: 3,
  },
} as const;

export const ColorScheme = {
  light: {
    primary: {
      accent: '#FF4D4D',
      deepBackground: '#FFFFFF',
      surface: '#F4F4F5',
      highlight: '#1BC5A3',
    },
    secondary: {
      warmGray: '#E4E4E7',
      softWhite: '#18181B', // This is actually dark text on light bg
      warning: '#FF6600',
      error: '#DC2626',
      success: '#0AC730',
    },
  },
  dark: {
    primary: {
      accent: '#FF4D4D',
      deepBackground: '#0E0F13',
      surface: '#181A20',
      highlight: '#00FFC2',
    },
    secondary: {
      warmGray: '#2A2D36',
      softWhite: '#F5F5F7', // This is light text on dark bg
      warning: '#FFB020',
      error: '#FF4D4F',
      success: '#22C55E',
    },
  },
} as const;

// Utility function to get current color scheme
export function getColorScheme(isDark: boolean) {
  return isDark ? ColorScheme.dark : ColorScheme.light;
}

// Type-safe color names
export type PrimaryColorKey = keyof typeof ColorScheme.light.primary;
export type SecondaryColorKey = keyof typeof ColorScheme.light.secondary;
export type ColorKey = PrimaryColorKey | SecondaryColorKey;

// Spacing keys
export type SpacingKey = keyof typeof DesignTokens.spacing;

// Typography keys  
export type TypographyKey = keyof typeof DesignTokens.typography;