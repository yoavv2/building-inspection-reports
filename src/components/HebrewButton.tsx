import { Pressable, PressableProps, StyleSheet, View } from 'react-native';

import { HebrewText } from './HebrewText';

type HebrewButtonProps = PressableProps & {
  label: string;
};

export const HebrewButton = ({ label, style, ...props }: HebrewButtonProps) => {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
    >
      <View style={styles.content}>
        <HebrewText style={styles.label}>{label}</HebrewText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.85,
  },
  content: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
