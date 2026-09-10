import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { LeaderboardEntryRow } from './LeaderboardEntryRow';
import { colors, fontFamily, spacing } from './theme';
import type { LeaderboardEntry } from '../data/types';

export function LeaderboardSection({
  icon,
  title,
  entries,
  showDropIndicator,
  highlightFirst,
  footerNote,
  onPressSeeAll,
}: {
  icon: string;
  title: string;
  entries: LeaderboardEntry[];
  showDropIndicator?: boolean;
  highlightFirst?: boolean;
  footerNote?: string;
  onPressSeeAll?: () => void;
}) {
  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>{icon}</Text>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <Pressable onPress={onPressSeeAll} style={styles.seeAllBtn} hitSlop={6}>
          <Text style={styles.seeAllText}>Xem tất cả</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.list}>
        {entries.map((entry, index) => (
          <View key={entry.rank}>
            <LeaderboardEntryRow
              entry={entry}
              showDropIndicator={showDropIndicator}
              highlighted={highlightFirst && index === 0}
            />
            {index < entries.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {footerNote && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>{footerNote}</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.lg, gap: spacing.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerIcon: { fontSize: 15 },
  headerTitle: { fontFamily: fontFamily.extraBold, fontSize: 14, color: colors.textPrimary },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { fontFamily: fontFamily.bold, fontSize: 12.5, color: colors.primary },
  list: { gap: 0 },
  divider: { height: 1, backgroundColor: '#F5EBE3', marginVertical: 2 },
  footer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  footerText: { fontFamily: fontFamily.bold, fontSize: 12, color: colors.primary, textAlign: 'center' },
});
