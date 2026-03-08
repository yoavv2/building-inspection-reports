import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Severity } from '../../types/domain';
import { Colors } from '../../constants/colors';
import { he } from '../../lib/i18n/he';

const SEVERITY_CONFIG: Record<Severity, { color: string; bg: string; label: string }> = {
  high: { color: Colors.severityHigh, bg: Colors.errorLight, label: he.findings.severityLevels.high },
  medium: { color: Colors.severityMedium, bg: Colors.warningLight, label: he.findings.severityLevels.medium },
  low: { color: Colors.severityLow, bg: Colors.successLight, label: he.findings.severityLevels.low },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const config = SEVERITY_CONFIG[severity];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
