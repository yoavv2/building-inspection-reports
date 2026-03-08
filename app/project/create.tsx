/**
 * Screen 2: Create / Edit Project
 */
import React from 'react';
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
import { z } from 'zod';
import { useProjectsStore } from '../../src/store/projectsStore';
import { Colors } from '../../src/constants/colors';
import { he } from '../../src/lib/i18n/he';
import { TextField } from '../../src/components/ui/TextField';
import { Button } from '../../src/components/ui/Button';
import { PropertyType } from '../../src/types/domain';

const schema = z.object({
  clientName: z.string().min(1, he.validation.required),
  propertyAddress: z.string().min(1, he.validation.required),
  inspectionDate: z.string().min(1, he.validation.required),
  inspectorName: z.string().min(1, he.validation.required),
  propertyType: z.enum(['apartment', 'house', 'office', 'commercial', 'industrial', 'other']),
  notes: z.string().default(''),
});

type FormValues = z.infer<typeof schema>;

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: he.projects.propertyTypes.apartment },
  { value: 'house', label: he.projects.propertyTypes.house },
  { value: 'office', label: he.projects.propertyTypes.office },
  { value: 'commercial', label: he.projects.propertyTypes.commercial },
  { value: 'industrial', label: he.projects.propertyTypes.industrial },
  { value: 'other', label: he.projects.propertyTypes.other },
];

export default function CreateProjectScreen() {
  const { createProject } = useProjectsStore();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      clientName: '',
      propertyAddress: '',
      inspectionDate: new Date().toISOString().split('T')[0],
      inspectorName: '',
      propertyType: 'apartment',
      notes: '',
    },
  });

  const selectedType = watch('propertyType');

  async function onSubmit(values: FormValues) {
    try {
      const project = await createProject(values);
      router.replace(`/project/${project.id}`);
    } catch {
      Alert.alert(he.errors.generic, he.errors.saveFailed);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{he.projects.createTitle}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="clientName"
          rules={{ required: he.validation.required }}
          render={({ field }) => (
            <TextField
              label={he.projects.clientName}
              placeholder={he.projects.clientNamePlaceholder}
              value={field.value}
              onChangeText={field.onChange}
              error={errors.clientName?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="propertyAddress"
          rules={{ required: he.validation.required }}
          render={({ field }) => (
            <TextField
              label={he.projects.propertyAddress}
              placeholder={he.projects.propertyAddressPlaceholder}
              value={field.value}
              onChangeText={field.onChange}
              error={errors.propertyAddress?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="inspectionDate"
          rules={{ required: he.validation.required }}
          render={({ field }) => (
            <TextField
              label={he.projects.inspectionDate}
              placeholder="YYYY-MM-DD"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.inspectionDate?.message}
              keyboardType="numeric"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="inspectorName"
          rules={{ required: he.validation.required }}
          render={({ field }) => (
            <TextField
              label={he.projects.inspectorName}
              placeholder={he.projects.inspectorNamePlaceholder}
              value={field.value}
              onChangeText={field.onChange}
              error={errors.inspectorName?.message}
              required
            />
          )}
        />

        {/* Property Type Selector */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{he.projects.propertyType}</Text>
          <View style={styles.typeGrid}>
            {PROPERTY_TYPES.map((pt) => (
              <TouchableOpacity
                key={pt.value}
                style={[styles.typeChip, selectedType === pt.value && styles.typeChipSelected]}
                onPress={() => setValue('propertyType', pt.value)}
              >
                <Text style={[styles.typeChipText, selectedType === pt.value && styles.typeChipTextSelected]}>
                  {pt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <TextField
              label={he.projects.notes}
              placeholder={he.projects.notesPlaceholder}
              value={field.value}
              onChangeText={field.onChange}
              multiline
              numberOfLines={3}
            />
          )}
        />

        <Button
          label={he.actions.save}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          fullWidth
          size="lg"
          style={{ marginTop: 8 }}
        />
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
  content: { padding: 16, gap: 16, paddingBottom: 40 },

  fieldGroup: { gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: '500', color: Colors.text, textAlign: 'right' },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  typeChipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  typeChipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  typeChipTextSelected: { color: Colors.textInverse },
});
