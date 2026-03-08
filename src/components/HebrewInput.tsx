import { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export const HebrewInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
  return (
    <TextInput
      ref={ref}
      placeholderTextColor="#6b7280"
      textAlign="right"
      style={[styles.input, props.style]}
      {...props}
    />
  );
});

HebrewInput.displayName = 'HebrewInput';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    writingDirection: 'rtl',
    backgroundColor: '#ffffff',
  },
});
