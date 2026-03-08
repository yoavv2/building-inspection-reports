/**
 * Screen 10: Report Preview
 * Shows assembled report structure before export.
 * Also triggers DOCX export.
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { assembleReport } from '../../../src/services/reportAssembler';
import { exportReport } from '../../../src/features/export/exportService';
import { AssembledReport, AreaWithFindings, FindingWithImages } from '../../../src/types/domain';
import { Colors } from '../../../src/constants/colors';
import { he } from '../../../src/lib/i18n/he';
import { SeverityBadge } from '../../../src/components/ui/SeverityBadge';
import { Button } from '../../../src/components/ui/Button';
import * as FileSystem from 'expo-file-system';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('he-IL');
  } catch {
    return dateStr;
  }
}

function FindingPreview({ finding }: { finding: FindingWithImages }) {
  return (
    <View style={styles.findingCard}>
      <View style={styles.findingHeader}>
        <SeverityBadge severity={finding.severity} />
        <Text style={styles.findingTitle}>{finding.title}</Text>
      </View>
      {finding.description ? (
        <View style={styles.findingSection}>
          <Text style={styles.findingSectionLabel}>תיאור</Text>
          <Text style={styles.findingBody}>{finding.description}</Text>
        </View>
      ) : null}
      {finding.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {finding.images.map((img) => (
            <View key={img.id} style={styles.imageWrapper}>
              <Image source={{ uri: img.localUri }} style={styles.previewImg} resizeMode="cover" />
              {img.caption ? <Text style={styles.imgCaption}>{img.caption}</Text> : null}
            </View>
          ))}
        </ScrollView>
      )}
      {finding.standardQuoteText ? (
        <View style={styles.findingSection}>
          <Text style={styles.findingSectionLabel}>{he.preview.standardRef}</Text>
          <Text style={styles.quoteText}>{finding.standardQuoteText}</Text>
        </View>
      ) : null}
      {finding.conclusion ? (
        <View style={styles.findingSection}>
          <Text style={styles.findingSectionLabel}>{he.preview.conclusion}</Text>
          <Text style={styles.findingBody}>{finding.conclusion}</Text>
        </View>
      ) : null}
      {finding.repairCostEstimate ? (
        <View style={styles.costLine}>
          <Text style={styles.costValue}>
            {he.common.currency}{finding.repairCostEstimate.toLocaleString('he-IL')}
          </Text>
          <Text style={styles.costLabel}>{he.preview.costEstimate}:</Text>
        </View>
      ) : null}
    </View>
  );
}

function AreaSection({ area }: { area: AreaWithFindings }) {
  return (
    <View style={styles.areaSection}>
      <View style={styles.areaHeader}>
        <Text style={styles.areaTitle}>{area.name}</Text>
        <Text style={styles.areaCount}>{area.findings.length} ממצאים</Text>
      </View>
      {area.findings.map((finding) => (
        <FindingPreview key={finding.id} finding={finding} />
      ))}
      {area.findings.length === 0 && (
        <Text style={styles.emptyArea}>אין ממצאים באזור זה</Text>
      )}
    </View>
  );
}

export default function ReportPreviewScreen() {
  const { id: projectId } = useLocalSearchParams<{ id: string }>();
  const [report, setReport] = useState<AssembledReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const assembled = await assembleReport(projectId);
      setReport(assembled);
    } catch (e) {
      Alert.alert(he.errors.generic, he.errors.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleExport() {
    if (!projectId || !report) return;
    setExporting(true);
    try {
      await exportReport(projectId);
    } catch (e) {
      Alert.alert(he.export.error, String(e));
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <Text style={styles.loadingText}>{he.common.loading}</Text>
      </View>
    );
  }

  if (!report) return null;

  const { project, areas, settings } = report;
  const totalFindings = areas.reduce((sum, a) => sum + a.findings.length, 0);
  const totalCost = areas
    .flatMap((a) => a.findings)
    .reduce((sum, f) => sum + (f.repairCostEstimate ?? 0), 0);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{he.preview.title}</Text>
        <TouchableOpacity onPress={handleExport} disabled={exporting} style={styles.exportBtn}>
          {exporting
            ? <ActivityIndicator color={Colors.accent} size="small" />
            : <Text style={styles.exportBtnText}>ייצא</Text>
          }
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Cover */}
        <View style={styles.cover}>
          {settings?.companyName ? (
            <Text style={styles.companyName}>{settings.companyName}</Text>
          ) : null}
          <Text style={styles.reportTitle}>{settings?.reportTitle ?? he.preview.reportTitle}</Text>
          <View style={styles.divider} />
          <View style={styles.coverRow}>
            <Text style={styles.coverValue}>{project.clientName}</Text>
            <Text style={styles.coverLabel}>{he.preview.client}</Text>
          </View>
          <View style={styles.coverRow}>
            <Text style={styles.coverValue}>{project.propertyAddress}</Text>
            <Text style={styles.coverLabel}>{he.preview.address}</Text>
          </View>
          <View style={styles.coverRow}>
            <Text style={styles.coverValue}>{formatDate(project.inspectionDate)}</Text>
            <Text style={styles.coverLabel}>{he.preview.date}</Text>
          </View>
          <View style={styles.coverRow}>
            <Text style={styles.coverValue}>{project.inspectorName}</Text>
            <Text style={styles.coverLabel}>{he.preview.inspector}</Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNum}>{totalFindings}</Text>
            <Text style={styles.summaryLabel}>סה"כ ממצאים</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryNum}>{areas.length}</Text>
            <Text style={styles.summaryLabel}>אזורים</Text>
          </View>
          {totalCost > 0 && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryNum}>{he.common.currency}{totalCost.toLocaleString('he-IL')}</Text>
              <Text style={styles.summaryLabel}>עלות כוללת משוערת</Text>
            </View>
          )}
        </View>

        {/* Intro paragraph */}
        <View style={styles.introPara}>
          <Text style={styles.introText}>{he.preview.intro}</Text>
        </View>

        {/* Areas + Findings */}
        {areas.length === 0 ? (
          <Text style={styles.noFindings}>{he.preview.noFindings}</Text>
        ) : (
          areas.map((area) => <AreaSection key={area.id} area={area} />)
        )}

        {/* Export Button */}
        <Button
          label={`📤 ${he.actions.export} (.docx)`}
          onPress={handleExport}
          loading={exporting}
          fullWidth
          size="lg"
          style={styles.exportAction}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: Colors.background },
  loadingText: { fontSize: 16, color: Colors.textSecondary },
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textInverse },
  exportBtn: { padding: 8 },
  exportBtnText: { color: Colors.accent, fontSize: 15, fontWeight: '700' },

  scroll: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 48 },

  // Cover section
  cover: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 24,
    gap: 12,
  },
  companyName: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontWeight: '600' },
  reportTitle: { fontSize: 22, fontWeight: '800', color: Colors.textInverse, textAlign: 'center' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  coverRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  coverLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', minWidth: 80 },
  coverValue: { fontSize: 15, color: Colors.textInverse, fontWeight: '600', flex: 1, textAlign: 'right' },

  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  summaryNum: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  summaryLabel: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },

  introPara: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  introText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'right', lineHeight: 22 },
  noFindings: { fontSize: 15, color: Colors.textMuted, textAlign: 'center', paddingVertical: 20 },

  // Area sections
  areaSection: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  areaHeader: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaTitle: { fontSize: 17, fontWeight: '700', color: Colors.textInverse },
  areaCount: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  emptyArea: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', padding: 16 },

  // Finding cards
  findingCard: {
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  findingHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-end', gap: 10 },
  findingTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, flex: 1, textAlign: 'right' },
  findingSection: { gap: 4 },
  findingSectionLabel: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, textAlign: 'right', textTransform: 'uppercase' },
  findingBody: { fontSize: 14, color: Colors.text, textAlign: 'right', lineHeight: 20 },
  quoteText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'right',
    fontStyle: 'italic',
    lineHeight: 18,
    backgroundColor: Colors.surfaceElevated,
    padding: 10,
    borderRadius: 8,
    borderRightWidth: 3,
    borderRightColor: Colors.primary,
  },
  costLine: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 6 },
  costLabel: { fontSize: 13, color: Colors.textMuted },
  costValue: { fontSize: 15, fontWeight: '700', color: Colors.success },

  // Images
  imageScroll: { marginHorizontal: -4 },
  imageWrapper: { marginHorizontal: 4, width: 120 },
  previewImg: { width: 120, height: 90, borderRadius: 8 },
  imgCaption: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', marginTop: 4 },

  exportAction: { marginTop: 8 },
});
