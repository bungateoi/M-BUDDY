import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StreakBadge } from './StreakBadge';
import { cardShadow, colors, fontFamily, spacing } from './theme';

const mascotSource = require('../assets/mascot.png');

export function PersonalAnalysisHeader({
  streakDays,
  onBack,
}: {
  streakDays: number;
  onBack?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} hitSlop={8} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
      </Pressable>

      <View style={styles.textCol}>
        <Text style={styles.title} numberOfLines={1}>
          Phân tích chi tiết
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          Personalized Learning Intelligence
        </Text>
      </View>

      <Image source={mascotSource} style={styles.mascot} resizeMode="contain" />
      <StreakBadge days={streakDays} />
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
  textCol: { flex: 1, gap: 1 },
  title: { fontFamily: fontFamily.extraBold, fontSize: 16.5, color: colors.textPrimary },
  subtitle: { fontFamily: fontFamily.semiBold, fontSize: 11, color: colors.textMuted },
  mascot: { width: 34, height: 40 },
});
