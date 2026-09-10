import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StreakBadge } from './StreakBadge';
import { cardShadow, colors, fontFamily, spacing } from './theme';

const mascotSource = require('../assets/mascot.png');

export function QuizHeader({
  title,
  subtitle,
  streakDays,
  onBack,
}: {
  title: string;
  subtitle: string;
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
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
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
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F1E7E0',
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
  subtitle: { fontFamily: fontFamily.semiBold, fontSize: 11.5, color: colors.textMuted },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mascot: { width: 32, height: 37 },
});
