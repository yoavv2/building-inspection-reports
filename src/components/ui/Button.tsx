import React from 'react';
import { ActivityIndicator, type TextStyle, type ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { cn } from '../../lib/utils/cn';
import { Text, TouchableOpacity } from '../../tw';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        'items-center justify-center rounded-xl',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50',
      )}
      style={style}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? Colors.textInverse : Colors.primary}
          size="small"
        />
      ) : (
        <Text
          className={cn('text-center font-semibold', labelClasses[variant], labelSizeClasses[size])}
          style={textStyle}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-primary',
  secondary: 'border border-brand-primary bg-surface',
  danger: 'bg-danger',
  ghost: 'bg-transparent',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3.5 py-2',
  md: 'px-5 py-3',
  lg: 'px-7 py-4 rounded-2xl',
};

const labelClasses: Record<Variant, string> = {
  primary: 'text-ink-inverse',
  secondary: 'text-brand-primary',
  danger: 'text-ink-inverse',
  ghost: 'text-brand-primary',
};

const labelSizeClasses: Record<Size, string> = {
  sm: 'text-[13px]',
  md: 'text-[15px]',
  lg: 'text-[17px]',
};
