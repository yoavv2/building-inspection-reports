/**
 * Screen 3: Project Dashboard
 * Shows project summary, list of areas, findings count, quick actions.
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useProjectsStore } from '../../../src/store/projectsStore';
import { Area, Finding } from '../../../src/types/domain';
import { Colors } from '../../../src/constants/colors';
import { he } from '../../../src/lib/i18n/he';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { SeverityBadge } from '../../../src/components/ui/SeverityBadge';
import { ConfirmDialog } from '../../../src/components/ui/ConfirmDialog';
import { findingsRepository } from '../../../src/db/repositories';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('he-IL');
  } catch {
    return dateStr;
  }
}

export default function ProjectDashboardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedProject, selectProject, areas, findings, loading, loadAreas, loadFindings, deleteProject } =
    useProjectsStore();
  const [areaFindingCounts, setAreaFindingCounts] = useState<Record<string, number>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const project = selectedProject;

  const load = useCallback(async () => {
    if (!id) return;
    await loadAreas(id);
    await loadFindings(id);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    // Build per-area finding counts
    const counts: Record<string, number> = {};
    for (const finding of findings) {
      counts[finding.areaId] = (counts[finding.areaId] ?? 0) + 1;
    }
    setAreaFindingCounts(counts);
  }, [findings]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  async function handleDeleteProject() {
    if (!id) return;
    await deleteProject(id);
    router.replace('/');
  }

  if (!project) {
    return (
      <View style={styles.screen}>
        <Text style={styles.notFound}>הפרויקט לא נמצא</Text>
      </View>
    );
  }

  const highCount = findings.filter((f) => f.severity === 'high').length;
  const mediumCount = findings.filter((f) => f.severity === 'medium').length;
  const lowCount = findings.filter((f) => f.severity === 'low').length;

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{project.clientName}</Text>
          <Text style={styles.headerSub} numberOfLines={1}>{project.propertyAddress}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowDeleteConfirm(true)} style={styles.backBtn}>
          <Text style={styles.backText}>🗑</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Project Info Card */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{project.inspectorName}</Text>
            <Text style={styles.infoLabel}>{he.projects.inspectorName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{formatDate(project.inspectionDate)}</Text>
            <Text style={styles.infoLabel}>{he.projects.inspectionDate}</Text>
          </View>
          {project.notes ? (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoValue} numberOfLines={2}>{project.notes}</Text>
                <Text style={styles.infoLabel}>{he.projects.notes}</Text>
              </View>
            </>
          ) : null}
        </Card>

        {/* Summary Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { borderColor: Colors.severityHigh }]}>
            <Text style={[styles.statNum, { color: Colors.severityHigh }]}>{highCount}</Text>
            <Text style={styles.statLabel}>{he.findings.severityLevels.high}</Text>
          </View>
          <View style={[styles.statBox, { borderColor: Colors.severityMedium }]}>
            <Text style={[styles.statNum, { color: Colors.severityMedium }]}>{mediumCount}</Text>
            <Text style={styles.statLabel}>{he.findings.severityLevels.medium}</Text>
          </View>
          <View style={[styles.statBox, { borderColor: Colors.severityLow }]}>
            <Text style={[styles.statNum, { color: Colors.severityLow }]}>{lowCount}</Text>
            <Text style={styles.statLabel}>{he.findings.severityLevels.low}</Text>
          </View>
          <View style={[styles.statBox, { borderColor: Colors.border }]}>
            <Text style={[styles.statNum, { color: Colors.primary }]}>{findings.length}</Text>
            <Text style={styles.statLabel}>סה"כ</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push(`/project/${id}/areas`)}
          >
            <Text style={styles.actionIcon}>🏠</Text>
            <Text style={styles.actionLabel}>{he.areas.title}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push(`/project/${id}/findings`)}
          >
            <Text style={styles.actionIcon}>🔍</Text>
            <Text style={styles.actionLabel}>{he.findings.title}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push(`/project/${id}/preview`)}
          >
            <Text style={styles.actionIcon}>📄</Text>
            <Text style={styles.actionLabel}>{he.dashboard.previewReport}</Text>
          </TouchableOpacity>
        </View>

        {/* Areas List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TouchableOpacity onPress={() => router.push(`/project/${id}/areas`)}>
              <Text style={styles.seeAll}>ראה הכל</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>{he.areas.title}</Text>
          </View>
          {areas.length === 0 ? (
            <Text style={styles.emptyText}>{he.areas.empty}</Text>
          ) : (
            areas.slice(0, 5).map((area) => (
              <TouchableOpacity
                key={area.id}
                style={styles.areaRow}
                onPress={() => router.push(`/project/${id}/findings?areaId=${area.id}`)}
              >
                <Text style={styles.areaCount}>
                  {areaFindingCounts[area.id] ?? 0} {he.findings.title}
                </Text>
                <Text style={styles.areaName}>{area.name}</Text>
              </TouchableOpacity>
            ))
          )}
          <Button
            label={`+ ${he.areas.new}`}
            onPress={() => router.push(`/project/${id}/areas`)}
            variant="secondary"
            size="sm"
            fullWidth
            style={{ marginTop: 8 }}
          />
        </View>

        {/* Export */}
        <View style={styles.exportSection}>
          <Button
            label={`📤 ${he.dashboard.exportReport}`}
            onPress={() => router.push(`/project/${id}/preview`)}
            size="lg"
            fullWidth
          />
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={showDeleteConfirm}
        title={he.projects.deleteTitle}
        message={he.projects.deleteConfirm}
        onConfirm={handleDeleteProject}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmLabel={he.actions.delete}
        danger
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  notFound: { textAlign: 'center', marginTop: 40, color: Colors.textSecondary },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 54,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textInverse, textAlign: 'center' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 2 },
  backBtn: { padding: 8, minWidth: 44 },
  backText: { color: Colors.textInverse, fontSize: 18, fontWeight: '600' },

  scroll: { flex: 1 },
  infoCard: { margin: 16, gap: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  infoLabel: { fontSize: 13, color: Colors.textMuted },
  infoValue: { fontSize: 15, color: Colors.text, fontWeight: '500', flex: 1, textAlign: 'right', marginRight: 8 },
  divider: { height: 1, backgroundColor: Colors.borderLight },

  statsRow: { flexDirection: 'row', gap: 8, marginHorizontal: 16, marginBottom: 16 },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: Colors.textMuted, textAlign: 'center' },

  actionsRow: { flexDirection: 'row', gap: 12, marginHorizontal: 16, marginBottom: 16 },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: { fontSize: 24 },
  actionLabel: { fontSize: 12, color: Colors.text, fontWeight: '600', textAlign: 'center' },

  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 10,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  emptyText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', paddingVertical: 8 },

  areaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  areaName: { fontSize: 15, color: Colors.text, fontWeight: '600' },
  areaCount: { fontSize: 13, color: Colors.textMuted },

  exportSection: { margin: 16, marginTop: 4 },
});
