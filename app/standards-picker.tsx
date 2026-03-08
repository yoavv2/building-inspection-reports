/**
 * Screen 7: Standards Library Picker
 * Browse and search Hebrew building standards/regulations.
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
import { StandardReference } from '../src/types/domain';
import { Colors } from '../src/constants/colors';
import { he } from '../src/lib/i18n/he';
import { standardsRepository } from '../src/db/repositories';
import { EmptyState } from '../src/components/ui/EmptyState';

export default function StandardsPickerScreen() {
  const [standards, setStandards] = useState<StandardReference[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const results = query.trim()
      ? await standardsRepository.search(query)
      : await standardsRepository.list();
    setStandards(results);
    setLoading(false);
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(load, 200);
    return () => clearTimeout(timer);
  }, [load]);

  const categories = [...new Set(standards.map((s) => s.category))].sort();

  const grouped = categories.map((cat) => ({
    category: cat,
    items: standards.filter((s) => s.category === cat),
  }));

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{he.standards.title}</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder={he.standards.search}
          textAlign="right"
          placeholderTextColor={Colors.textMuted}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} color={Colors.primary} />
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(g) => g.category}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState title={he.standards.empty} icon="📚" />}
          renderItem={({ item }) => (
            <View style={styles.group}>
              <Text style={styles.categoryHeader}>
                {he.standards.categories[item.category as keyof typeof he.standards.categories] ?? item.category}
              </Text>
              {item.items.map((standard) => (
                <TouchableOpacity
                  key={standard.id}
                  style={styles.standardCard}
                  onPress={() => {
                    // Pass selected standard back via router params
                    router.back();
                    // The parent screen can use a global event or store to receive selection
                    // For now we store in a shared module
                    require('../src/lib/utils/selectedStandard').setSelectedStandard(standard);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardTop}>
                    <Text style={styles.code}>{standard.code}</Text>
                    <Text style={styles.standardTitle}>{standard.title}</Text>
                  </View>
                  {standard.quoteText ? (
                    <Text style={styles.quotePreview} numberOfLines={3}>{standard.quoteText}</Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
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

  list: { padding: 16, gap: 20, paddingBottom: 32 },
  group: { gap: 8 },
  categoryHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    textAlign: 'right',
    paddingBottom: 4,
  },

  standardCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-end', gap: 10 },
  code: { fontSize: 12, color: Colors.textMuted, backgroundColor: Colors.surfaceElevated, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  standardTitle: { fontSize: 15, fontWeight: '600', color: Colors.text, flex: 1, textAlign: 'right' },
  quotePreview: { fontSize: 13, color: Colors.textSecondary, textAlign: 'right', lineHeight: 18 },
});
