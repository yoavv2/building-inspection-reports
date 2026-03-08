/**
 * Screen 1: Home / Projects List
 * Shows all projects, allows create new and open existing.
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useProjectsStore } from '../src/store/projectsStore';
import { Project } from '../src/types/domain';
import { Colors } from '../src/constants/colors';
import { he } from '../src/lib/i18n/he';
import { EmptyState } from '../src/components/ui/EmptyState';
import { ConfirmDialog } from '../src/components/ui/ConfirmDialog';

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('he-IL');
  } catch {
    return dateStr;
  }
}

function ProjectCard({ project, onPress, onDelete }: {
  project: Project;
  onPress: () => void;
  onDelete: () => void;
}) {
  const statusLabel = he.projects.status[project.status];
  const statusColor = project.status === 'exported'
    ? Colors.success
    : project.status === 'completed'
    ? Colors.primary
    : Colors.textMuted;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={styles.statusText}>{statusLabel}</Text>
      </View>
      <Text style={styles.clientName}>{project.clientName}</Text>
      <Text style={styles.address} numberOfLines={1}>{project.propertyAddress}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.date}>{formatDate(project.inspectionDate)}</Text>
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>🗑</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function ProjectsListScreen() {
  const { projects, loading, loadProjects, deleteProject } = useProjectsStore();
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  function handleOpen(project: Project) {
    router.push(`/project/${project.id}`);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteProject(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{he.projects.title}</Text>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => router.push('/project/create')}
        >
          <Text style={styles.newBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Projects List */}
      <FlatList
        data={projects}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadProjects} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title={he.projects.empty}
              hint={he.projects.emptyHint}
              icon="🏗️"
            />
          ) : null
        }
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => handleOpen(item)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <ConfirmDialog
        visible={!!deleteTarget}
        title={he.projects.deleteTitle}
        message={he.projects.deleteConfirm}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textInverse,
    flex: 1,
    textAlign: 'center',
  },
  settingsBtn: { padding: 8 },
  settingsIcon: { fontSize: 20 },
  newBtn: {
    backgroundColor: Colors.accent,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBtnText: { color: '#fff', fontSize: 22, fontWeight: '700', lineHeight: 28 },

  list: { padding: 16, gap: 12, flexGrow: 1 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, color: Colors.textMuted, fontWeight: '500' },
  clientName: { fontSize: 18, fontWeight: '700', color: Colors.text, textAlign: 'right' },
  address: { fontSize: 14, color: Colors.textSecondary, textAlign: 'right' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  date: { fontSize: 13, color: Colors.textMuted },
  deleteBtn: { padding: 4 },
  deleteText: { fontSize: 18 },
});
