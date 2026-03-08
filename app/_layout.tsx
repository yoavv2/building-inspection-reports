import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { I18nManager, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { bootstrapDatabase } from '../src/db/initDatabase';
import { Colors } from '../src/constants/colors';

// Enable RTL globally
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bootstrapDatabase()
      .then(() => setReady(true))
      .catch((e) => setError(String(e)));
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>שגיאה בטעינת הנתונים: {error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>טוען...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="project/[id]" />
      <Stack.Screen name="project/create" />
      <Stack.Screen name="project/[id]/areas" />
      <Stack.Screen name="project/[id]/findings" />
      <Stack.Screen name="project/[id]/finding/[findingId]" />
      <Stack.Screen name="project/[id]/finding/create" />
      <Stack.Screen name="project/[id]/preview" />
      <Stack.Screen name="standards-picker" />
      <Stack.Screen name="template-picker" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 15,
    color: Colors.error,
    textAlign: 'center',
    padding: 24,
  },
});
