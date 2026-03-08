/**
 * Screen 11: Settings
 * Company name, default inspector, report title, logo.
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { settingsRepository } from '../src/db/repositories';
import { AppSettings } from '../src/types/domain';
import { Colors } from '../src/constants/colors';
import { he } from '../src/lib/i18n/he';
import { TextField } from '../src/components/ui/TextField';
import { Button } from '../src/components/ui/Button';

interface FormValues {
  companyName: string;
  defaultInspectorName: string;
  reportTitle: string;
  defaultCurrency: string;
}

export default function SettingsScreen() {
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      companyName: '',
      defaultInspectorName: '',
      reportTitle: 'דוח בדיקת בניין',
      defaultCurrency: 'ILS',
    },
  });

  useEffect(() => {
    settingsRepository.get().then((settings) => {
      if (settings) {
        reset({
          companyName: settings.companyName,
          defaultInspectorName: settings.defaultInspectorName,
          reportTitle: settings.reportTitle,
          defaultCurrency: settings.defaultCurrency,
        });
      }
    });
  }, []);

  async function onSave(values: FormValues) {
    try {
      await settingsRepository.upsert(values);
      Alert.alert('✓', he.settings.saved);
    } catch {
      Alert.alert(he.errors.generic, he.errors.saveFailed);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{he.settings.title}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionLabel}>פרטי חברה</Text>

        <Controller
          control={control}
          name="companyName"
          render={({ field }) => (
            <TextField
              label={he.settings.companyName}
              placeholder={he.settings.companyNamePlaceholder}
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="defaultInspectorName"
          render={({ field }) => (
            <TextField
              label={he.settings.defaultInspectorName}
              placeholder={he.settings.defaultInspectorNamePlaceholder}
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />

        <Text style={[styles.sectionLabel, { marginTop: 8 }]}>הגדרות דוח</Text>

        <Controller
          control={control}
          name="reportTitle"
          render={({ field }) => (
            <TextField
              label={he.settings.reportTitle}
              placeholder={he.settings.reportTitlePlaceholder}
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="defaultCurrency"
          render={({ field }) => (
            <TextField
              label={he.settings.defaultCurrency}
              placeholder="ILS"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />

        <Button
          label={he.actions.save}
          onPress={handleSubmit(onSave)}
          loading={isSubmitting}
          fullWidth
          size="lg"
          style={{ marginTop: 16 }}
        />

        <View style={styles.version}>
          <Text style={styles.versionText}>Building Inspection Reports v1.0.0</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 54,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { padding: 8 },
  backText: { color: Colors.textInverse, fontSize: 20, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: Colors.textInverse },

  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 16, paddingBottom: 48 },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    textAlign: 'right',
    letterSpacing: 0.5,
  },

  version: { alignItems: 'center', marginTop: 24 },
  versionText: { fontSize: 12, color: Colors.textMuted },
});
