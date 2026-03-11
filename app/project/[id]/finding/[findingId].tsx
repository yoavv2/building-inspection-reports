/**
 * Screen 6b: Finding Detail / Edit
 * Edit all finding fields and manage attached images.
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useProjectsStore } from '../../../../src/store/projectsStore';
import { Finding, FindingImage, Severity } from '../../../../src/types/domain';
import { Colors } from '../../../../src/constants/colors';
import { he } from '../../../../src/lib/i18n/he';
import { TextField } from '../../../../src/components/ui/TextField';
import { Button } from '../../../../src/components/ui/Button';
import { SeverityBadge } from '../../../../src/components/ui/SeverityBadge';
import { ConfirmDialog } from '../../../../src/components/ui/ConfirmDialog';
import { findingsRepository, findingImagesRepository } from '../../../../src/db/repositories';

interface FormValues {
  title: string;
  description: string;
  severity: Severity;
  standardQuoteText: string;
  conclusion: string;
  repairCostEstimate: string;
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

const IMAGE_DIR = `${FileSystem.documentDirectory}inspection-images/`;

async function ensureImageDir() {
  const info = await FileSystem.getInfoAsync(IMAGE_DIR);
  if (!info.exists) await FileSystem.makeDirectoryAsync(IMAGE_DIR, { intermediates: true });
}

async function copyImageToStorage(uri: string): Promise<string> {
  await ensureImageDir();
  const filename = `img-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const dest = IMAGE_DIR + filename;
  await FileSystem.copyAsync({ from: uri, to: dest });
  return dest;
}

export default function FindingDetailScreen() {
  const { id: projectId, findingId } = useLocalSearchParams<{ id: string; findingId: string }>();
  const { updateFinding } = useProjectsStore();

  const [finding, setFinding] = useState<Finding | null>(null);
  const [images, setImages] = useState<FindingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteImageTarget, setDeleteImageTarget] = useState<FindingImage | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty, isSubmitting },
  } = useForm<FormValues>();

  const selectedSeverity = watch('severity');

  const load = useCallback(async () => {
    if (!findingId) return;
    setLoading(true);
    const f = await findingsRepository.getById(findingId);
    if (f) {
      setFinding(f);
      reset({
        title: f.title,
        description: f.description,
        severity: f.severity,
        standardQuoteText: f.standardQuoteText,
        conclusion: f.conclusion,
        repairCostEstimate: f.repairCostEstimate?.toString() ?? '',
      });
    }
    const imgs = await findingImagesRepository.listByFinding(findingId);
    setImages(imgs);
    setLoading(false);
  }, [findingId]);

  useEffect(() => {
    load();
  }, [load]);

  async function onSave(values: FormValues) {
    if (!findingId) return;
    setSaving(true);
    try {
      await updateFinding(findingId, {
        title: values.title,
        description: values.description,
        severity: values.severity,
        standardQuoteText: values.standardQuoteText,
        conclusion: values.conclusion,
        repairCostEstimate: values.repairCostEstimate ? parseFloat(values.repairCostEstimate) : null,
      });
      await load();
    } catch {
      Alert.alert(he.errors.generic, he.errors.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  async function pickImage(fromCamera: boolean) {
    const perm = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(he.errors.generic, fromCamera ? he.errors.cameraPermission : he.errors.libraryPermission);
      return;
    }
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.85 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.85, allowsMultipleSelection: false });

    if (!result.canceled && result.assets[0]) {
      const localUri = await copyImageToStorage(result.assets[0].uri);
      const img = await findingImagesRepository.create({ findingId: findingId!, localUri });
      setImages((prev) => [...prev, img]);
    }
  }

  function showImagePicker() {
    Alert.alert(he.images.add, '', [
      { text: he.images.takePhoto, onPress: () => pickImage(true) },
      { text: he.images.chooseFromLibrary, onPress: () => pickImage(false) },
      { text: he.actions.cancel, style: 'cancel' },
    ]);
  }

  async function handleDeleteImage() {
    if (!deleteImageTarget) return;
    try {
      await FileSystem.deleteAsync(deleteImageTarget.localUri, { idempotent: true });
    } catch {}
    await findingImagesRepository.delete(deleteImageTarget.id);
    setImages((prev) => prev.filter((img) => img.id !== deleteImageTarget.id));
    setDeleteImageTarget(null);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!finding) {
    return (
      <View style={styles.center}>
        <Text>ממצא לא נמצא</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{finding.title}</Text>
        <TouchableOpacity onPress={handleSubmit(onSave)} disabled={saving || isSubmitting}>
          <Text style={[styles.saveText, (saving || isSubmitting) && styles.savingText]}>
            {saving ? he.common.saving : he.actions.save}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Severity */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{he.findings.severity}</Text>
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
                onPress={() => setValue('severity', s.value, { shouldDirty: true })}
              >
                <Text style={[styles.chipText, selectedSeverity === s.value && styles.chipTextSelected]}>
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
              value={field.value}
              onChangeText={field.onChange}
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

        {/* Images Section */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{he.images.title}</Text>
          <View style={styles.imageGrid}>
            {images.map((img) => (
              <TouchableOpacity
                key={img.id}
                style={styles.imageThumb}
                onLongPress={() => setDeleteImageTarget(img)}
                activeOpacity={0.85}
              >
                <Image source={{ uri: img.localUri }} style={styles.thumbImg} />
                {img.caption ? <Text style={styles.thumbCaption} numberOfLines={1}>{img.caption}</Text> : null}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addImageBtn} onPress={showImagePicker}>
              <Text style={styles.addImageIcon}>📷</Text>
              <Text style={styles.addImageText}>{he.images.add}</Text>
            </TouchableOpacity>
          </View>
        </View>

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
          onPress={handleSubmit(onSave)}
          loading={saving || isSubmitting}
          fullWidth
          size="lg"
          style={{ marginTop: 8 }}
        />
      </ScrollView>

      <ConfirmDialog
        visible={!!deleteImageTarget}
        title={he.images.deleteTitle}
        message={he.images.deleteConfirm}
        onConfirm={handleDeleteImage}
        onCancel={() => setDeleteImageTarget(null)}
        confirmLabel={he.actions.delete}
        danger
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
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
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textInverse, flex: 1, textAlign: 'center', paddingHorizontal: 8 },
  saveText: { color: Colors.accent, fontSize: 15, fontWeight: '700', padding: 4 },
  savingText: { opacity: 0.5 },

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
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  chipTextSelected: { color: Colors.textInverse },

  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-end' },
  imageThumb: {
    width: 90,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceElevated,
  },
  thumbImg: { width: 90, height: 90 },
  thumbCaption: { fontSize: 11, color: Colors.textMuted, padding: 4, textAlign: 'center' },
  addImageBtn: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceElevated,
  },
  addImageIcon: { fontSize: 24 },
  addImageText: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },
});
