import { StyleSheet, Text, View } from 'react-native';
import { StreakBadge } from './StreakBadge';
import { NotificationBell } from './NotificationBell';
import { colors, fontFamily, spacing } from './theme';

export function LeaderboardHeader({
  streakDays,
  hasUnreadNotification,
}: {
  streakDays: number;
  hasUnreadNotification?: boolean;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Xếp hạng</Text>
        <Text style={styles.trophy}>🏆</Text>
      </View>
      <View style={styles.right}>
        <StreakBadge days={streakDays} />
        <NotificationBell hasUnread={hasUnreadNotification} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { fontFamily: fontFamily.black, fontSize: 26, color: colors.textPrimary },
  trophy: { fontSize: 22 },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
