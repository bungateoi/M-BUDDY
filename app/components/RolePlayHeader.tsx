import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StreakBadge } from './StreakBadge';
import { cardShadow, colors, fontFamily, radii, spacing } from './theme';

export function RolePlayHeader({
  titleLine,
  objective,
  streakDays,
  hasUnreadNotification,
  onBack,
}: {
  /** Dòng trên của pill, vd "Chặng 2 • Level 3" (Map) hoặc "Luyện tập" (Practice). */
  titleLine: string;
  objective: string;
  streakDays: number;
  hasUnreadNotification?: boolean;
  onBack?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} hitSlop={8} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
      </Pressable>

      <View style={styles.pill}>
        <Text style={styles.pillText} numberOfLines={1}>
          {titleLine}
        </Text>
        <Text style={styles.pillObjective} numberOfLines={1}>
          🎯 {objective}
        </Text>
      </View>

      <View style={styles.right}>
        <StreakBadge days={streakDays} />
        <View style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={18} color={colors.textPrimary} />
          {hasUnreadNotification && <View style={styles.dot} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  pill: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    gap: 1,
  },
  pillText: { fontFamily: fontFamily.bold, fontSize: 11.5, color: colors.textMuted },
  pillObjective: { fontFamily: fontFamily.extraBold, fontSize: 12.5, color: colors.textPrimary },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
});
