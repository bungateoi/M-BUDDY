import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

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
        <Ionicons name="search" size={17} color={colors2.whiteMuted} />
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Tìm kiếm theo tên..."
          placeholderTextColor={colors2.whiteMuted}
          style={styles.input}
        />
      </View>

      <Pressable onPress={onPressFilter} style={styles.actionBtn}>
        <Ionicons name="filter" size={15} color={colors2.white} />
        <Text style={styles.actionText} numberOfLines={1} ellipsizeMode="tail">
          {filterLabel}
        </Text>
      </Pressable>

      <Pressable onPress={onToggleSortDirection} style={styles.actionBtn}>
        <Ionicons name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} size={15} color={colors2.white} />
        <Text style={styles.actionText} numberOfLines={1}>
          Sắp xếp
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: spacing2.xs },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.xs,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.pill,
    paddingHorizontal: spacing2.md,
    paddingVertical: 10,
  },
  input: { flex: 1, fontFamily: fontFamily2.regular, fontSize: 13, color: colors2.white, padding: 0 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: 96,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.pill,
    paddingHorizontal: spacing2.xs,
    paddingVertical: 10,
  },
  actionText: { flexShrink: 1, fontFamily: fontFamily2.semiBold, fontSize: 11.5, color: colors2.white },
});
