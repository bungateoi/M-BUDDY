import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import { ChevronRightIcon, StarFillIcon } from './icons2';
import { getRoleplayAvatarSource } from '../data';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';
import type { LeaderboardEntry } from '../data/types';

// Hàng xếp hạng RIÊNG cho màn Xếp hạng (node-id=35:2700) — KHÔNG dùng chung
// với components/LeaderboardEntryRow.tsx (bản cũ, nền trắng) vì component đó
// còn được LeaderboardFullScreen.tsx dùng nguyên trạng — sửa nó sẽ làm hỏng
// màn đó trước khi tới lượt redesign. Mỗi hàng ở đây là 1 card riêng bo góc
// (không còn gộp chung 1 Card lớn + divider như bản cũ).
function LeaderboardTopRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rank}>{entry.rank}</Text>
      <View style={styles.identity}>
        <Avatar
          initials={entry.name.slice(0, 1).toUpperCase()}
          avatarSource={getRoleplayAvatarSource(entry.avatarKey as any)}
          size={36}
        />
        <Text style={styles.name} numberOfLines={1}>
          {entry.name}
        </Text>
      </View>
      <View style={styles.xpPill}>
        <StarFillIcon size={16} />
        <Text style={styles.xpText}>{entry.xp.toLocaleString('vi-VN')} XP</Text>
      </View>
    </View>
  );
}

export function LeaderboardSection({
  title,
  entries,
  footerNote,
  onPressSeeAll,
}: {
  icon?: string;
  title: string;
  entries: LeaderboardEntry[];
  showDropIndicator?: boolean;
  highlightFirst?: boolean;
  footerNote?: string;
  onPressSeeAll?: () => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Pressable onPress={onPressSeeAll} style={styles.seeAllBtn} hitSlop={6}>
          <Text style={styles.seeAllText}>Xem tất cả</Text>
          <ChevronRightIcon size={24} />
        </Pressable>
      </View>

      <View style={styles.list}>
        {entries.map((entry) => (
          <LeaderboardTopRow key={entry.rank} entry={entry} />
        ))}
      </View>

      {footerNote && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>{footerNote}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing2.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { flex: 1, fontFamily: fontFamily2.semiBold, fontSize: 16, lineHeight: 24, color: colors2.white },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seeAllText: { fontFamily: fontFamily2.semiBold, fontSize: 16, lineHeight: 24, color: colors2.yellow },
  list: { gap: spacing2.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.xs,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    padding: spacing2.md,
  },
  rank: { width: 20, textAlign: 'center', fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
  identity: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing2.xs, minWidth: 0 },
  name: { flex: 1, fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
  xpPill: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radii2.pill },
  xpText: { fontFamily: fontFamily2.display, fontSize: 14, lineHeight: 20, color: colors2.white },
  footer: {
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    paddingVertical: spacing2.xs,
    paddingHorizontal: spacing2.md,
  },
  footerText: { fontFamily: fontFamily2.semiBold, fontSize: 12, lineHeight: 16, color: colors2.yellow, textAlign: 'center' },
});
