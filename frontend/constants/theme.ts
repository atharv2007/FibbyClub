// Fibby Design System - Cinematic Look

export const COLORS = {
  // Brand Colors
  primary: '#966866', // Muted Clay/Rose
  primaryLight: '#B08886',
  primaryDark: '#7A5454',
  
  // Backgrounds
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  
  // Semantic Colors
  success: '#10B981',
  successLight: '#34D399',
  danger: '#F43F5E',
  dangerLight: '#FB7185',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  info: '#3B82F6',
  
  // Neutrals
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  disabled: '#D1D5DB',
  
  // Chart Colors
  chart1: '#966866',
  chart2: '#3B82F6',
  chart3: '#10B981',
  chart4: '#F59E0B',
  chart5: '#8B5CF6',
  chart6: '#EC4899',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const TYPOGRAPHY = {
  // You'll need to load these fonts
  heading: 'Urbanist-Bold',
  body: 'Urbanist-Regular',
  data: 'System', // Using system font for now, can load Rethink Sans
};