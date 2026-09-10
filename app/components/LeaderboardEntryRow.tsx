import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleplayAvatarSource } from '../data';
import { colors, fontFamily, radii, spacing } from './theme';
import type { LeaderboardEntry } from '../data/types';

const MEDAL_COLOR: Record<number, string> = { 1: '#F5A623', 2: '#A8B2BD', 3: '#C97A3D' };

export function LeaderboardEntryRow({
  entry,
  showDropIndicator,
  highlighted,
}: {
  entry: LeaderboardEntry;
  /** true ở "Nhóm rớt hạng" — thêm mũi tên đỏ trước hạng để nhấn mạnh vừa tụt hạng. */
  showDropIndicator?: boolean;
  /** true cho hạng 1 — nền be nổi bật như ui-draft/man-xephang.png. */
  highlighted?: boolean;
}) {
  const medalColor = MEDAL_COLOR[entry.rank];
  return (
    <View style={[styles.row, highlighted && styles.rowHighlighted]}>
      <View style={styles.rankWrap}>
        {showDropIndicator && <Ionicons name="arrow-down" size={13} color={colors.error} />}
        {medalColor ? (
          <Ionicons name="medal" size={22} color={medalColor} />
        ) : (
          <Text style={styles.rankNumber}>{entry.rank}</Text>
        )}
      </View>

      <Image source={getRoleplayAvatarSource(entry.avatarKey as any)} style={styles.avatar} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {entry.name}
        </Text>
        <Text style={styles.xpText}>
          🔥 {entry.xp.toLocaleString('vi-VN')} XP
        </Text>
      </View>

      <Text style={styles.streakText}>🔥 {entry.streakDays} ngày</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
  },
  rowHighlighted: { backgroundColor: colors.primaryLight },
  rankWrap: { width: 30, flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'center' },
  rankNumber: { fontFamily: fontFamily.extraBold, fontSize: 14, color: colors.textMuted, width: 20, textAlign: 'center' },
  avatar: { width: 44, height: 44, borderRadius: radii.pill },
  info: { flex: 1, gap: 2 },
  name: { fontFamily: fontFamily.extraBold, fontSize: 13.5, color: colors.textPrimary },
  xpText: { fontFamily: fontFamily.bold, fontSize: 12, color: colors.primary },
  streakText: { fontFamily: fontFamily.bold, fontSize: 12, color: colors.primary },
});
