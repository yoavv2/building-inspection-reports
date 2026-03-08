import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';

type HebrewTextProps = PropsWithChildren<TextProps> & {
  variant?: 'title' | 'subtitle' | 'body';
};

export const HebrewText = ({ children, style, variant = 'body', ...rest }: HebrewTextProps) => {
  return (
    <Text {...rest} style={[styles.base, styles[variant], style as StyleProp<TextStyle>]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    textAlign: 'right',
    writingDirection: 'rtl',
    color: '#111827',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
});
