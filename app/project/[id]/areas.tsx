/**
 * Screen 4: Area Management
 * Create, rename, delete areas for a project.
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useProjectsStore } from '../../../src/store/projectsStore';
import { Area } from '../../../src/types/domain';
import { Colors } from '../../../src/constants/colors';
import { he } from '../../../src/lib/i18n/he';
import { Button } from '../../../src/components/ui/Button';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { ConfirmDialog } from '../../../src/components/ui/ConfirmDialog';

const AREA_PRESETS = [
  he.areas.presets.exterior,
  he.areas.presets.salon,
  he.areas.presets.kitchen,
  he.areas.presets.bathroom,
  he.areas.presets.bedroom,
  he.areas.presets.balcony,
  he.areas.presets.roof,
  he.areas.presets.stairwell,
  he.areas.presets.parking,
  he.areas.presets.lobby,
];

export default function AreasScreen() {
  const { id: projectId } = useLocalSearchParams<{ id: string }>();
  const { areas, loading, loadAreas, createArea, updateArea, deleteArea } = useProjectsStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Area | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Area | null>(null);
  const [areaName, setAreaName] = useState('');

  useEffect(() => {
    if (projectId) loadAreas(projectId);
  }, [projectId]);

  async function handleAdd() {
    if (!areaName.trim() || !projectId) return;
    await createArea({ projectId, name: areaName.trim() });
    setAreaName('');
    setShowAddModal(false);
  }

  async function handleUpdate() {
    if (!editTarget || !areaName.trim()) return;
    await updateArea(editTarget.id, { name: areaName.trim() });
    setEditTarget(null);
    setAreaName('');
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteArea(deleteTarget.id);
    setDeleteTarget(null);
  }

  function openEdit(area: Area) {
    setEditTarget(area);
    setAreaName(area.name);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{he.areas.title}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => { setAreaName(''); setShowAddModal(true); }}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={areas}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={!loading ? <EmptyState title={he.areas.empty} hint={he.areas.emptyHint} icon="🏠" /> : null}
        renderItem={({ item }) => (
          <View style={styles.areaCard}>
            <View style={styles.areaActions}>
              <TouchableOpacity onPress={() => setDeleteTarget(item)} style={styles.iconBtn}>
                <Text style={styles.deleteIcon}>🗑</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openEdit(item)} style={styles.iconBtn}>
                <Text style={styles.editIcon}>✏️</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.areaContent}
              onPress={() => router.push(`/project/${projectId}/findings?areaId=${item.id}`)}
            >
              <Text style={styles.areaName}>{item.name}</Text>
              {item.description ? <Text style={styles.areaDesc}>{item.description}</Text> : null}
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Add / Edit Modal */}
      <Modal
        visible={showAddModal || !!editTarget}
        transparent
        animationType="slide"
        onRequestClose={() => { setShowAddModal(false); setEditTarget(null); }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>
              {editTarget ? he.areas.editTitle : he.areas.createTitle}
            </Text>

            {/* Quick presets (only on create) */}
            {!editTarget && (
              <View style={styles.presetGroup}>
                <Text style={styles.presetLabel}>{he.areas.quickAdd}</Text>
                <View style={styles.presets}>
                  {AREA_PRESETS.map((preset) => (
                    <TouchableOpacity
                      key={preset}
                      style={styles.preset}
                      onPress={() => setAreaName(preset)}
                    >
                      <Text style={styles.presetText}>{preset}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <TextInput
              style={styles.input}
              value={areaName}
              onChangeText={setAreaName}
              placeholder={he.areas.namePlaceholder}
              textAlign="right"
              autoFocus
            />
            <View style={styles.modalActions}>
              <Button
                label={he.actions.cancel}
                onPress={() => { setShowAddModal(false); setEditTarget(null); setAreaName(''); }}
                variant="secondary"
                style={{ flex: 1 }}
              />
              <Button
                label={he.actions.save}
                onPress={editTarget ? handleUpdate : handleAdd}
                disabled={!areaName.trim()}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmDialog
        visible={!!deleteTarget}
        title={he.areas.deleteTitle}
        message={he.areas.deleteConfirm}
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

  list: { padding: 16, gap: 10, flexGrow: 1 },
  areaCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  areaContent: { flex: 1, padding: 16 },
  areaName: { fontSize: 16, fontWeight: '600', color: Colors.text, textAlign: 'right' },
  areaDesc: { fontSize: 13, color: Colors.textMuted, marginTop: 4, textAlign: 'right' },
  areaActions: { flexDirection: 'column', borderLeftWidth: 1, borderLeftColor: Colors.borderLight },
  iconBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 12 },
  deleteIcon: { fontSize: 18 },
  editIcon: { fontSize: 18 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 16,
    paddingBottom: 40,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, textAlign: 'right' },
  presetGroup: { gap: 8 },
  presetLabel: { fontSize: 13, color: Colors.textMuted, textAlign: 'right' },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' },
  preset: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetText: { fontSize: 13, color: Colors.text },
  input: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  modalActions: { flexDirection: 'row', gap: 10 },
});
