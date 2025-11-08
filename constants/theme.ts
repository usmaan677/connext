/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Main backgrounds
    background: '#F8FAFC',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    header: '#FFFFFF',
    
    // Text colors
    text: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    
    // Brand colors
    primary: '#3B82F6',
    primaryDark: '#1D4ED8',
    accent: '#10B981',
    warning: '#F59E0B',
    
    // UI elements
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    icon: '#64748B',
    iconActive: '#3B82F6',
    
    // Tab bar
    tabBackground: '#FFFFFF',
    tabActive: '#3B82F6',
    tabInactive: '#64748B',
    
    // Status
    success: '#10B981',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Shadows
    shadow: '#1E293B',
  },
  dark: {
    // Main backgrounds
    background: '#0F172A',
    surface: '#1E293B',
    card: '#334155',
    header: '#1E293B',
    
    // Text colors
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    
    // Brand colors
    primary: '#60A5FA',
    primaryDark: '#3B82F6',
    accent: '#34D399',
    warning: '#FBBF24',
    
    // UI elements
    border: '#475569',
    borderLight: '#334155',
    icon: '#CBD5E1',
    iconActive: '#60A5FA',
    
    // Tab bar
    tabBackground: '#1E293B',
    tabActive: '#60A5FA',
    tabInactive: '#94A3B8',
    
    // Status
    success: '#34D399',
    error: '#F87171',
    info: '#60A5FA',
    
    // Shadows
    shadow: '#000000',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
