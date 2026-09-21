import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRoleplayAvatarSource } from '../data';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';
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
  /** true cho hạng 1 — nổi bật hơn các hạng còn lại. */
  highlighted?: boolean;
}) {
  const medalColor = MEDAL_COLOR[entry.rank];
  return (
    <View style={[styles.row, highlighted && styles.rowHighlighted]}>
      <View style={styles.rankWrap}>
        {showDropIndicator && <Ionicons name="arrow-down" size={13} color={colors2.red500} />}
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
    gap: spacing2.xs,
    paddingVertical: spacing2.xs,
    paddingHorizontal: spacing2.xs,
    borderRadius: radii2.card,
  },
  rowHighlighted: { backgroundColor: colors2.cardOptionIdle },
  rankWrap: { width: 30, flexDirection: 'row', alignItems: 'center', gap: 2, justifyContent: 'center' },
  rankNumber: { fontFamily: fontFamily2.semiBold, fontSize: 14, color: colors2.whiteMuted, width: 20, textAlign: 'center' },
  avatar: { width: 44, height: 44, borderRadius: radii2.pill },
  info: { flex: 1, gap: 2 },
  name: { fontFamily: fontFamily2.semiBold, fontSize: 13.5, color: colors2.white },
  xpText: { fontFamily: fontFamily2.semiBold, fontSize: 12, color: colors2.orange },
  streakText: { fontFamily: fontFamily2.semiBold, fontSize: 12, color: colors2.orange },
});
