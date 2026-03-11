import '../src/global.css';

import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { ActivityIndicator, I18nManager, Platform } from 'react-native';
import { bootstrapDatabase } from '../src/db/initDatabase';
import { Colors } from '../src/constants/colors';
import { Text, View } from '../src/tw';

// Enable RTL globally
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

export default function RootLayout() {
  const isWeb = Platform.OS === 'web';
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isWeb) {
      return;
    }

    bootstrapDatabase()
      .then(() => setReady(true))
      .catch((e) => setError(String(e)));
  }, [isWeb]);

  if (isWeb) {
    return (
      <View className="flex-1 items-center justify-center bg-page px-6">
        <View className="w-full max-w-xl gap-4 rounded-[28px] border border-line bg-surface p-6">
          <Text className="text-center text-2xl font-bold text-ink">גרסת ווב אינה נתמכת</Text>
          <Text className="text-center text-base leading-6 text-ink-secondary">
            האפליקציה הזו משתמשת ב-SQLite מקומי דרך Expo ומתוכננת לריצה ב-iOS או Android.
          </Text>
          <Text className="text-center text-base leading-6 text-ink-secondary">
            כדי לבדוק אותה, השתמש בסימולטור iOS, במכשיר Android, או ב-Expo Go שתואם ל-SDK של
            הפרויקט.
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-page px-6">
        <View className="w-full max-w-xl rounded-[28px] border border-danger/20 bg-surface p-6">
          <Text className="text-center text-base leading-6 text-danger">
            שגיאה בטעינת הנתונים: {error}
          </Text>
        </View>
      </View>
    );
  }

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-page px-6">
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text className="text-base text-ink-secondary">טוען...</Text>
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
