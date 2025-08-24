// Apple Human Interface Guidelines Design System
// This file implements Apple's design principles for a native, intuitive experience

export const AppleColors = {
  // Primary Colors (iOS/macOS)
  primary: {
    blue: '#007AFF',        // iOS Blue
    indigo: '#5856D6',      // iOS Indigo
    purple: '#AF52DE',      // iOS Purple
    pink: '#FF2D92',        // iOS Pink
    red: '#FF3B30',         // iOS Red
    orange: '#FF9500',      // iOS Orange
    yellow: '#FFCC00',      // iOS Yellow
    green: '#34C759',       // iOS Green
    teal: '#5AC8FA',        // iOS Teal
  },
  
  // Semantic Colors
  semantic: {
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',
  },
  
  // System Colors
  system: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F2F2F7',
      tertiary: '#E5E5EA',
      grouped: '#F2F2F7',
      groupedSecondary: '#FFFFFF',
    },
    label: {
      primary: '#000000',
      secondary: '#3C3C43',
      tertiary: '#48484A',
      quaternary: '#8E8E93',
    },
    separator: {
      opaque: '#C6C6C8',
      transparent: '#C6C6C8',
    },
    fill: {
      primary: '#787880',
      secondary: '#787880',
      tertiary: '#787880',
      quaternary: '#787880',
    }
  },
  
  // Dark Mode Colors
  dark: {
    background: {
      primary: '#000000',
      secondary: '#1C1C1E',
      tertiary: '#2C2C2E',
      grouped: '#1C1C1E',
      groupedSecondary: '#2C2C2E',
    },
    label: {
      primary: '#FFFFFF',
      secondary: '#EBEBF5',
      tertiary: '#EBEBF2',
      quaternary: '#EBEBE5',
    },
    separator: {
      opaque: '#38383A',
      transparent: '#38383A',
    },
    fill: {
      primary: '#787880',
      secondary: '#787880',
      tertiary: '#787880',
      quaternary: '#787880',
    }
  }
};

export const AppleTypography = {
  // Font Families (SF Pro Display - Apple's system font)
  fontFamily: {
    primary: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    monospace: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },
  
  // Font Sizes (iOS/macOS standard)
  fontSize: {
    largeTitle: '34px',
    title1: '28px',
    title2: '22px',
    title3: '20px',
    headline: '17px',
    body: '17px',
    callout: '16px',
    subhead: '15px',
    footnote: '13px',
    caption1: '12px',
    caption2: '11px',
  },
  
  // Font Weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
  
  // Line Heights
  lineHeight: {
    tight: '1.2',
    normal: '1.4',
    relaxed: '1.6',
    loose: '1.8',
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: '-0.5px',
    normal: '0px',
    wide: '0.5px',
    wider: '1px',
  }
};

export const AppleSpacing = {
  // Spacing Scale (8pt grid system)
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
  
  // Component Spacing
  component: {
    padding: '16px',
    margin: '16px',
    gap: '16px',
  },
  
  // Layout Spacing
  layout: {
    page: '24px',
    section: '32px',
    card: '16px',
  }
};

export const AppleShadows = {
  // Elevation System
  small: {
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  xlarge: {
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  }
};

export const AppleBorderRadius = {
  // Corner Radius System
  none: '0px',
  small: '8px',
  medium: '12px',
  large: '16px',
  xlarge: '20px',
  full: '9999px',
  
  // Component Specific
  button: '12px',
  card: '16px',
  input: '12px',
  modal: '20px',
};

export const AppleTransitions = {
  // Animation Timing
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  
  // Easing Functions
  ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  
  // Spring Animation
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

export const AppleComponents = {
  // Button Styles
  button: {
    primary: {
      backgroundColor: AppleColors.primary.blue,
      color: '#FFFFFF',
      borderRadius: AppleBorderRadius.button,
      padding: `${AppleSpacing.sm} ${AppleSpacing.lg}`,
      fontSize: AppleTypography.fontSize.body,
      fontWeight: AppleTypography.fontWeight.semibold,
      transition: `all ${AppleTransitions.normal} ${AppleTransitions.ease}`,
      '&:hover': {
        backgroundColor: '#0056CC',
        transform: 'translateY(-1px)',
        boxShadow: AppleShadows.medium,
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: AppleShadows.small,
      }
    },
    secondary: {
      backgroundColor: 'transparent',
      color: AppleColors.primary.blue,
      border: `1px solid ${AppleColors.primary.blue}`,
      borderRadius: AppleBorderRadius.button,
      padding: `${AppleSpacing.sm} ${AppleSpacing.lg}`,
      fontSize: AppleTypography.fontSize.body,
      fontWeight: AppleTypography.fontWeight.medium,
      transition: `all ${AppleTransitions.normal} ${AppleTransitions.ease}`,
      '&:hover': {
        backgroundColor: AppleColors.primary.blue,
        color: '#FFFFFF',
      }
    },
    tertiary: {
      backgroundColor: 'transparent',
      color: AppleColors.system.label.secondary,
      borderRadius: AppleBorderRadius.button,
      padding: `${AppleSpacing.sm} ${AppleSpacing.lg}`,
      fontSize: AppleTypography.fontSize.body,
      fontWeight: AppleTypography.fontWeight.medium,
      transition: `all ${AppleTransitions.normal} ${AppleTransitions.ease}`,
      '&:hover': {
        backgroundColor: AppleColors.system.background.secondary,
        color: AppleColors.system.label.primary,
      }
    }
  },
  
  // Card Styles
  card: {
    backgroundColor: AppleColors.system.background.primary,
    borderRadius: AppleBorderRadius.card,
    padding: AppleSpacing.component.padding,
    boxShadow: AppleShadows.small,
    border: `1px solid ${AppleColors.system.separator.transparent}`,
    transition: `all ${AppleTransitions.normal} ${AppleTransitions.ease}`,
    '&:hover': {
      boxShadow: AppleShadows.medium,
      transform: 'translateY(-2px)',
    }
  },
  
  // Input Styles
  input: {
    backgroundColor: AppleColors.system.background.secondary,
    border: `1px solid ${AppleColors.system.separator.transparent}`,
    borderRadius: AppleBorderRadius.input,
    padding: `${AppleSpacing.sm} ${AppleSpacing.md}`,
    fontSize: AppleTypography.fontSize.body,
    color: AppleColors.system.label.primary,
    transition: `all ${AppleTransitions.fast} ${AppleTransitions.ease}`,
    '&:focus': {
      outline: 'none',
      borderColor: AppleColors.primary.blue,
      backgroundColor: AppleColors.system.background.primary,
      boxShadow: `0 0 0 3px ${AppleColors.primary.blue}20`,
    }
  },
  
  // Navigation Styles
  navigation: {
    backgroundColor: AppleColors.system.background.primary,
    borderBottom: `1px solid ${AppleColors.system.separator.transparent}`,
    padding: `${AppleSpacing.md} ${AppleSpacing.lg}`,
  }
};

// Utility Functions
export const createAppleStyle = (component, variant = 'default') => {
  return AppleComponents[component]?.[variant] || AppleComponents[component] || {};
};

export const applyAppleSpacing = (direction, size) => {
  const spacing = AppleSpacing[size] || size;
  return {
    [`margin${direction.charAt(0).toUpperCase() + direction.slice(1)}`]: spacing,
  };
};

export const applyAppleTypography = (variant) => {
  return {
    fontFamily: AppleTypography.fontFamily.primary,
    fontSize: AppleTypography.fontSize[variant] || AppleTypography.fontSize.body,
    fontWeight: AppleTypography.fontWeight.regular,
    lineHeight: AppleTypography.lineHeight.normal,
    letterSpacing: AppleTypography.letterSpacing.normal,
  };
};

// Export everything as a single object for easy importing
const appleDesignSystem = {
  colors: AppleColors,
  typography: AppleTypography,
  spacing: AppleSpacing,
  shadows: AppleShadows,
  borderRadius: AppleBorderRadius,
  transitions: AppleTransitions,
  components: AppleComponents,
  createStyle: createAppleStyle,
  applySpacing: applyAppleSpacing,
  applyTypography: applyAppleTypography,
};

export default appleDesignSystem;
