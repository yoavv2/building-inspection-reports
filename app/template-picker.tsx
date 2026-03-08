/**
 * Screen 8: Template Picker
 * Browse and select reusable defect templates.
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { FindingTemplate } from '../src/types/domain';
import { Colors } from '../src/constants/colors';
import { he } from '../src/lib/i18n/he';
import { templatesRepository } from '../src/db/repositories';
import { EmptyState } from '../src/components/ui/EmptyState';

let _templateListener: ((t: FindingTemplate) => void) | null = null;

export function onTemplateSelected(cb: (t: FindingTemplate) => void): () => void {
  _templateListener = cb;
  return () => { _templateListener = null; };
}

export default function TemplatePickerScreen() {
  const [templates, setTemplates] = useState<FindingTemplate[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const results = query.trim()
      ? await templatesRepository.search(query)
      : await templatesRepository.list();
    setTemplates(results);
    setLoading(false);
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(load, 200);
    return () => clearTimeout(timer);
  }, [load]);

  function handleSelect(template: FindingTemplate) {
    _templateListener?.(template);
    router.back();
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{he.templates.title}</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder={he.templates.search}
          textAlign="right"
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} color={Colors.primary} />
      ) : (
        <FlatList
          data={templates}
          keyExtractor={(t) => t.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState title={he.templates.empty} icon="📝" />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleSelect(item)}
              activeOpacity={0.8}
            >
              <View style={styles.cardTop}>
                <Text style={styles.category}>
                  {he.templates.categories[item.category as keyof typeof he.templates.categories] ?? item.category}
                </Text>
                <Text style={styles.templateTitle}>{item.title}</Text>
              </View>
              {item.defaultDescription ? (
                <Text style={styles.preview} numberOfLines={2}>{item.defaultDescription}</Text>
              ) : null}
              {item.defaultRepairCostRange ? (
                <Text style={styles.costRange}>עלות משוערת: {item.defaultRepairCostRange}</Text>
              ) : null}
              <Text style={styles.useBtn}>{he.templates.useTemplate} →</Text>
            </TouchableOpacity>
          )}
        />
      )}
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

  searchContainer: { padding: 12, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  searchInput: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  list: { padding: 16, gap: 10, paddingBottom: 32 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-end', gap: 10 },
  category: {
    fontSize: 11,
    color: Colors.primary,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontWeight: '600',
  },
  templateTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, flex: 1, textAlign: 'right' },
  preview: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right', lineHeight: 18 },
  costRange: { fontSize: 12, color: Colors.success, fontWeight: '600', textAlign: 'right' },
  useBtn: { fontSize: 13, color: Colors.primary, fontWeight: '700', textAlign: 'right', marginTop: 4 },
});
