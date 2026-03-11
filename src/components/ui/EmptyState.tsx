import React from 'react';
import { Text, View } from '../../tw';

interface EmptyStateProps {
  title: string;
  hint?: string;
  icon?: string;
}

export function EmptyState({ title, hint, icon = '📋' }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-8">
      <Text className="text-5xl">{icon}</Text>
      <Text className="text-center text-lg font-semibold text-ink-secondary">{title}</Text>
      {hint && <Text className="text-center text-sm leading-5 text-ink-muted">{hint}</Text>}
    </View>
  );
}
