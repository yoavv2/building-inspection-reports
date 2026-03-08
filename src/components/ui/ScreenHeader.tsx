import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Colors } from '../../constants/colors';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: { label: string; onPress: () => void };
}

export function ScreenHeader({ title, subtitle, onBack, rightAction }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.row}>
        {rightAction ? (
          <TouchableOpacity onPress={rightAction.onPress} style={styles.action}>
            <Text style={styles.actionText}>{rightAction.label}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.action}>
            <Text style={styles.actionText}>→</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textInverse,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 2,
  },
  action: { padding: 4, minWidth: 44, alignItems: 'center' },
  actionText: { color: Colors.textInverse, fontSize: 15, fontWeight: '600' },
  placeholder: { minWidth: 44 },
});
