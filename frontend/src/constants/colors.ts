// Color Palette Constants
export const COLORS = {
  // Primary Colors
  primary: {
    dark: '#2E073F',    // Dark purple - main brand color
    main: '#7A1CAC',    // Medium purple - primary actions
    light: '#AD49E1',   // Light purple - accents and highlights
  },
  
  // Accent Color
  accent: {
    main: '#EBD3F8',    // Very light purple - call-to-action, highlights
  },
  
  // Semantic Colors
  success: {
    main: '#10B981',    // Green for success states
    light: '#D1FAE5',
    dark: '#059669',
  },
  
  warning: {
    main: '#F59E0B',    // Amber for warnings
    light: '#FEF3C7',
    dark: '#D97706',
  },
  
  error: {
    main: '#EF4444',    // Red for errors
    light: '#FEE2E2',
    dark: '#DC2626',
  },
  
  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  
  // Background Colors
  background: {
    primary: '#EBD3F8',    // Very light purple background
    secondary: '#FFFFFF',  // White background
    accent: '#AD49E1',     // Light purple background
  },
  
  // Text Colors
  text: {
    primary: '#2E073F',    // Dark purple for primary text
    secondary: '#7A1CAC',  // Medium purple for secondary text
    muted: '#6B7280',      // Gray for muted text
    light: '#FFFFFF',      // White text
  },
  
  // Border Colors
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
  
  // Shadow Colors
  shadow: {
    light: 'rgba(46, 7, 63, 0.1)',    // Primary color with opacity
    medium: 'rgba(46, 7, 63, 0.15)',
    dark: 'rgba(46, 7, 63, 0.2)',
  },
} as const;

// Color utility functions
export const getColor = (colorPath: string): string => {
  const path = colorPath.split('.');
  let current: any = COLORS;
  
  for (const key of path) {
    if (current[key] === undefined) {
      console.warn(`Color path "${colorPath}" not found`);
      return COLORS.primary.main;
    }
    current = current[key];
  }
  
  return current;
};

// Common color combinations
export const COLOR_COMBINATIONS = {
  primary: {
    background: COLORS.primary.main,
    text: COLORS.neutral.white,
    hover: COLORS.primary.dark,
  },
  secondary: {
    background: COLORS.neutral.white,
    text: COLORS.primary.main,
    border: COLORS.primary.main,
    hover: COLORS.primary.light,
  },
  accent: {
    background: COLORS.accent.main,
    text: COLORS.primary.dark,
    hover: COLORS.primary.main,
  },
  success: {
    background: COLORS.success.main,
    text: COLORS.neutral.white,
    hover: COLORS.success.dark,
  },
  warning: {
    background: COLORS.warning.main,
    text: COLORS.neutral.white,
    hover: COLORS.warning.dark,
  },
  error: {
    background: COLORS.error.main,
    text: COLORS.neutral.white,
    hover: COLORS.error.dark,
  },
} as const;

export default COLORS; 