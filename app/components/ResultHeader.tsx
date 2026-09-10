import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StreakBadge } from './StreakBadge';
import { cardShadow, colors, fontFamily, spacing } from './theme';

export function ResultHeader({
  title,
  subtitle,
  streakDays,
  hasUnreadNotification,
  onBack,
}: {
  title: string;
  subtitle: string;
  streakDays: number;
  hasUnreadNotification?: boolean;
  onBack?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} hitSlop={8} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
      </Pressable>

      <View style={styles.textCol}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
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
  textCol: { flex: 1, alignItems: 'center', gap: 1 },
  title: { fontFamily: fontFamily.extraBold, fontSize: 16.5, color: colors.textPrimary },
  subtitle: { fontFamily: fontFamily.semiBold, fontSize: 11.5, color: colors.textMuted },
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
