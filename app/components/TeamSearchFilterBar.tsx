import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cardShadow, colors, fontFamily, radii, spacing } from './theme';

export function TeamSearchFilterBar({
  query,
  onChangeQuery,
  filterLabel,
  onPressFilter,
  sortDirection,
  onToggleSortDirection,
}: {
  query: string;
  onChangeQuery: (text: string) => void;
  filterLabel: string;
  onPressFilter: () => void;
  sortDirection: 'asc' | 'desc';
  onToggleSortDirection: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={17} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Tìm kiếm theo tên..."
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
      </View>

      <Pressable onPress={onPressFilter} style={styles.actionBtn}>
        <Ionicons name="filter" size={15} color={colors.textPrimary} />
        <Text style={styles.actionText} numberOfLines={1} ellipsizeMode="tail">
          {filterLabel}
        </Text>
      </Pressable>

      <Pressable onPress={onToggleSortDirection} style={styles.actionBtn}>
        <Ionicons name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} size={15} color={colors.textPrimary} />
        <Text style={styles.actionText} numberOfLines={1}>
          Sắp xếp
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: spacing.sm },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    ...cardShadow,
  },
  input: { flex: 1, fontFamily: fontFamily.semiBold, fontSize: 13, color: colors.textPrimary, padding: 0 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: 96,
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    ...cardShadow,
  },
  actionText: { flexShrink: 1, fontFamily: fontFamily.bold, fontSize: 11.5, color: colors.textPrimary },
});
