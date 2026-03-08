/**
 * Screen 6: Finding Editor (Create mode)
 * Full finding entry form with template picker integration.
 */
import React, { useState, useEffect } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useProjectsStore } from '../../../../src/store/projectsStore';
import { Colors } from '../../../../src/constants/colors';
import { he } from '../../../../src/lib/i18n/he';
import { TextField } from '../../../../src/components/ui/TextField';
import { Button } from '../../../../src/components/ui/Button';
import { Severity } from '../../../../src/types/domain';
import { areasRepository } from '../../../../src/db/repositories';

interface FormValues {
  title: string;
  description: string;
  severity: Severity;
  standardQuoteText: string;
  conclusion: string;
  repairCostEstimate: string;
  areaId: string;
}

const SEVERITIES: { value: Severity; label: string }[] = [
  { value: 'high', label: he.findings.severityLevels.high },
  { value: 'medium', label: he.findings.severityLevels.medium },
  { value: 'low', label: he.findings.severityLevels.low },
];

const SEVERITY_COLORS: Record<Severity, string> = {
  high: Colors.severityHigh,
  medium: Colors.severityMedium,
  low: Colors.severityLow,
};

export default function CreateFindingScreen() {
  const { id: projectId, areaId: initialAreaId } = useLocalSearchParams<{
    id: string;
    areaId?: string;
  }>();
  const { areas, createFinding, loadAreas } = useProjectsStore();
  const [areaNames, setAreaNames] = useState<Record<string, string>>({});

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      severity: 'medium',
      standardQuoteText: '',
      conclusion: '',
      repairCostEstimate: '',
      areaId: initialAreaId ?? '',
    },
  });

  const selectedSeverity = watch('severity');
  const selectedAreaId = watch('areaId');

  useEffect(() => {
    if (projectId) loadAreas(projectId);
  }, [projectId]);

  async function onSubmit(values: FormValues) {
    if (!values.areaId) {
      Alert.alert(he.common.error, 'יש לבחור אזור');
      return;
    }
    try {
      const finding = await createFinding({
        projectId: projectId!,
        areaId: values.areaId,
        title: values.title,
        description: values.description,
        severity: values.severity,
        standardQuoteText: values.standardQuoteText,
        conclusion: values.conclusion,
        repairCostEstimate: values.repairCostEstimate ? parseFloat(values.repairCostEstimate) : null,
      });
      // Navigate to finding detail for image attachment
      router.replace(`/project/${projectId}/finding/${finding.id}`);
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
        <Text style={styles.title}>{he.findings.createTitle}</Text>
        <TouchableOpacity
          onPress={() => router.push('/template-picker')}
          style={styles.templateBtn}
        >
          <Text style={styles.templateText}>תבניות</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Area Selector */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{he.findings.area} *</Text>
          <View style={styles.chipRow}>
            {areas.map((area) => (
              <TouchableOpacity
                key={area.id}
                style={[styles.chip, selectedAreaId === area.id && styles.chipSelected]}
                onPress={() => setValue('areaId', area.id)}
              >
                <Text style={[styles.chipText, selectedAreaId === area.id && styles.chipTextSelected]}>
                  {area.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Severity */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{he.findings.severity} *</Text>
          <View style={styles.chipRow}>
            {SEVERITIES.map((s) => (
              <TouchableOpacity
                key={s.value}
                style={[
                  styles.chip,
                  selectedSeverity === s.value && {
                    backgroundColor: SEVERITY_COLORS[s.value],
                    borderColor: SEVERITY_COLORS[s.value],
                  },
                ]}
                onPress={() => setValue('severity', s.value)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedSeverity === s.value && styles.chipTextSelected,
                  ]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Controller
          control={control}
          name="title"
          rules={{ required: he.validation.required }}
          render={({ field }) => (
            <TextField
              label={he.findings.findingTitle}
              placeholder={he.findings.findingTitlePlaceholder}
              value={field.value}
              onChangeText={field.onChange}
              error={errors.title?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextField
              label={he.findings.description}
              placeholder={he.findings.descriptionPlaceholder}
              value={field.value}
              onChangeText={field.onChange}
              multiline
              numberOfLines={4}
            />
          )}
        />

        <Controller
          control={control}
          name="standardQuoteText"
          render={({ field }) => (
            <TextField
              label={he.findings.standardQuote}
              placeholder={he.findings.standardQuotePlaceholder}
              value={field.value}
              onChangeText={field.onChange}
              multiline
              numberOfLines={3}
            />
          )}
        />

        <Controller
          control={control}
          name="conclusion"
          render={({ field }) => (
            <TextField
              label={he.findings.conclusion}
              placeholder={he.findings.conclusionPlaceholder}
              value={field.value}
              onChangeText={field.onChange}
              multiline
              numberOfLines={4}
            />
          )}
        />

        <Controller
          control={control}
          name="repairCostEstimate"
          render={({ field }) => (
            <TextField
              label={`${he.findings.repairCost} (${he.common.currency})`}
              placeholder={he.findings.repairCostPlaceholder}
              value={field.value}
              onChangeText={field.onChange}
              keyboardType="numeric"
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
  templateBtn: { padding: 8 },
  templateText: { color: Colors.accent, fontSize: 14, fontWeight: '600' },

  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 16, paddingBottom: 48 },

  fieldGroup: { gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: '500', color: Colors.text, textAlign: 'right' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  chipTextSelected: { color: Colors.textInverse },
});
