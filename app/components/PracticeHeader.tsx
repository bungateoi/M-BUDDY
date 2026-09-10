import { Image, StyleSheet, Text, View } from 'react-native';
import { StreakBadge } from './StreakBadge';
import { colors, fontFamily, spacing } from './theme';

const mascotSource = require('../assets/mascot.png');

export function PracticeHeader({ streakDays }: { streakDays: number }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.textCol}>
        <Text style={styles.title}>Practice</Text>
        <Text style={styles.subtitle}>
          Luyện tập <Text style={styles.subtitleAccent}>role-play</Text> cùng khách hàng
        </Text>
      </View>
      <View style={styles.right}>
        <Image source={mascotSource} style={styles.mascot} resizeMode="contain" />
        <StreakBadge days={streakDays} />
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
  textCol: { flexShrink: 1, gap: 2 },
  title: { fontFamily: fontFamily.black, fontSize: 24, color: colors.textPrimary },
  subtitle: { fontFamily: fontFamily.semiBold, fontSize: 13, color: colors.textMuted },
  subtitleAccent: { fontFamily: fontFamily.extraBold, color: colors.primary },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  mascot: { width: 44, height: 50 },
});
