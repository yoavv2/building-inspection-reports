/**
 * Screen 5: Findings List
 * Lists all findings for a project (optionally filtered by area).
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useProjectsStore } from '../../../src/store/projectsStore';
import { Area, Finding } from '../../../src/types/domain';
import { Colors } from '../../../src/constants/colors';
import { he } from '../../../src/lib/i18n/he';
import { SeverityBadge } from '../../../src/components/ui/SeverityBadge';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { ConfirmDialog } from '../../../src/components/ui/ConfirmDialog';
import { findingImagesRepository } from '../../../src/db/repositories';

type Section = { title: string; areaId: string; data: Finding[] };

export default function FindingsScreen() {
  const { id: projectId, areaId } = useLocalSearchParams<{ id: string; areaId?: string }>();
  const { areas, findings, loading, loadAreas, loadFindings, deleteFinding } = useProjectsStore();
  const [imagesCounts, setImagesCounts] = useState<Record<string, number>>({});
  const [deleteTarget, setDeleteTarget] = useState<Finding | null>(null);

  const load = useCallback(async () => {
    if (!projectId) return;
    await loadAreas(projectId);
    await loadFindings(projectId);
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    // Load image counts for all findings
    (async () => {
      const counts: Record<string, number> = {};
      for (const f of findings) {
        const imgs = await findingImagesRepository.listByFinding(f.id);
        counts[f.id] = imgs.length;
      }
      setImagesCounts(counts);
    })();
  }, [findings]);

  // Build sections grouped by area
  const filteredAreas = areaId ? areas.filter((a) => a.id === areaId) : areas;
  const sections: Section[] = filteredAreas.map((area) => ({
    title: area.name,
    areaId: area.id,
    data: findings.filter((f) => f.areaId === area.id),
  }));

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteFinding(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{he.findings.title}</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push(`/project/${projectId}/finding/create?areaId=${areaId ?? ''}`)}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(f) => f.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <EmptyState title={he.findings.empty} hint={he.findings.emptyHint} icon="🔍" />
          ) : null
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <TouchableOpacity
              onPress={() =>
                router.push(`/project/${projectId}/finding/create?areaId=${section.areaId}`)
              }
              style={styles.sectionAddBtn}
            >
              <Text style={styles.sectionAddText}>+ {he.findings.new}</Text>
            </TouchableOpacity>
          </View>
        )}
        renderSectionFooter={({ section }) =>
          section.data.length === 0 ? (
            <Text style={styles.emptySectionText}>{he.findings.emptyHint}</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/project/${projectId}/finding/${item.id}`)}
            activeOpacity={0.8}
          >
            <View style={styles.cardTop}>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => setDeleteTarget(item)} style={styles.iconBtn}>
                  <Text>🗑</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cardInfo}>
                <SeverityBadge severity={item.severity} />
                <Text style={styles.findingTitle} numberOfLines={2}>{item.title}</Text>
              </View>
            </View>
            {item.description ? (
              <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            ) : null}
            <View style={styles.cardFooter}>
              {item.repairCostEstimate ? (
                <Text style={styles.cost}>
                  {he.common.currency}{item.repairCostEstimate.toLocaleString('he-IL')}
                </Text>
              ) : null}
              {imagesCounts[item.id] ? (
                <Text style={styles.imgCount}>📷 {imagesCounts[item.id]}</Text>
              ) : null}
              {item.conclusion ? <Text style={styles.hasConcl}>✓ מסקנה</Text> : null}
            </View>
          </TouchableOpacity>
        )}
      />

      <ConfirmDialog
        visible={!!deleteTarget}
        title={he.findings.deleteTitle}
        message={he.findings.deleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel={he.actions.delete}
        danger
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
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
  addBtn: {
    backgroundColor: Colors.accent,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 22, fontWeight: '700', lineHeight: 28 },

  list: { padding: 12, flexGrow: 1, gap: 4 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 10,
    backgroundColor: Colors.background,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  sectionAddBtn: { padding: 4 },
  sectionAddText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  emptySectionText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', paddingVertical: 8 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 8,
    padding: 14,
    gap: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  cardInfo: { flex: 1, gap: 6, alignItems: 'flex-end' },
  cardActions: { flexDirection: 'row', gap: 4 },
  iconBtn: { padding: 6 },
  findingTitle: { fontSize: 15, fontWeight: '600', color: Colors.text, textAlign: 'right' },
  description: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right', lineHeight: 18 },
  cardFooter: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' },
  cost: { fontSize: 13, color: Colors.success, fontWeight: '600' },
  imgCount: { fontSize: 13, color: Colors.textMuted },
  hasConcl: { fontSize: 13, color: Colors.primary },
});
