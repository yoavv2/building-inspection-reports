import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TextStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export function TextField({
  label,
  error,
  hint,
  containerStyle,
  required,
  style: inputStyle,
  ...inputProps
}: TextFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          inputProps.multiline && styles.multiline,
          inputStyle as StyleProp<TextStyle>,
          error && styles.inputError,
        ]}
        textAlign="right"
        placeholderTextColor={Colors.textMuted}
        {...inputProps}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'right',
  },
  required: { color: Colors.error },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    minHeight: 48,
    writingDirection: 'rtl',
  },
  multiline: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  inputError: { borderColor: Colors.error },
  error: { fontSize: 12, color: Colors.error, textAlign: 'right' },
  hint: { fontSize: 12, color: Colors.textMuted, textAlign: 'right' },
});
