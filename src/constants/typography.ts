import { StyleSheet } from 'react-native';

export const FontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
} as const;

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const textStyles = StyleSheet.create({
  heading1: {
    fontSize: FontSizes['3xl'],
    fontWeight: FontWeights.bold,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  heading2: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  heading3: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  heading4: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  body: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.regular,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  bodyMedium: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  caption: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
