import { Platform } from 'react-native';

// ===== MEDICAL APP COLOR PALETTE (From Logo) =====
export const AppColors = {
  
  primary: {
    main: '#2F3E46',     
    light: '#B8C0C2',   
    dark: '#1E2A30',     
    50: '#E4E7E8',      
    100: '#D0D5D7',      
    500: '#2F3E46',     
    600: '#253238',       
    700: '#1A2429',       
  },

  secondary: {
    main: '#C81E1E',      
    light: '#E75A5A',   
    dark: '#991616',     
    50: '#FCEAEA',     
    100: '#F9D4D4',      
  },

  medical: {
    emergency: '#C81E1E',
    heart: '#C81E1E',
    lung: '#B8C0C2',
    brain: '#2F3E46',
    bone: '#E0E3E4',
    blood: '#991616',
  },

  status: {
    success: '#2F3E46',   
    warning: '#B8C0C2',
    error: '#C81E1E',
    info: '#6B7B83',
    pending: '#A3ACAE',
  },

  neutral: {
    white: '#FFFFFF',
    gray50: '#F9FAFA',
    gray100: '#F1F3F3',
    gray200: '#E4E7E8',
    gray300: '#D0D5D7',
    gray400: '#A3ACAE',
    gray500: '#6B7B83',
    gray600: '#4A555B',
    gray700: '#2F3E46',
    gray800: '#1E2A30',
    gray900: '#0F1619',
    black: '#000000',
  },

  // Background Colors
  background: {
    primary: '#F5F7F8',   
    secondary: '#FFFFFF', 
    tertiary: '#E4E7E8',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },

  // Text Colors
  text: {
    primary: '#2F3E46',   // Main text
    secondary: '#6B7B83', // Secondary text
    tertiary: '#A3ACAE',  // Disabled/placeholder text
    inverse: '#FFFFFF',   // On dark backgrounds
    link: '#C81E1E',      // Accent red for links
  },

  // Border Colors
  border: {
    light: '#E4E7E8',     // Light borders
    medium: '#D0D5D7',    // Medium borders
    dark: '#A3ACAE',      // Dark borders
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(47, 62, 70, 0.1)',
    medium: 'rgba(47, 62, 70, 0.2)',
    dark: 'rgba(47, 62, 70, 0.3)',
  },

  // Gradient Colors
  gradients: {
    primary: ['#2F3E46', '#1E2A30'],
    secondary: ['#C81E1E', '#991616'],
    cool: ['#B8C0C2', '#6B7B83'],
  },
};

// Legacy Colors (for backward compatibility)
const tintColorLight = AppColors.primary.main;
const tintColorDark = AppColors.neutral.white;

export const Colors = {
  light: {
    text: AppColors.text.primary,
    background: AppColors.background.secondary,
    tint: tintColorLight,
    icon: AppColors.neutral.gray500,
    tabIconDefault: AppColors.neutral.gray500,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: AppColors.neutral.gray50,
    background: AppColors.neutral.gray800,
    tint: tintColorDark,
    icon: AppColors.neutral.gray400,
    tabIconDefault: AppColors.neutral.gray400,
    tabIconSelected: tintColorDark,
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
