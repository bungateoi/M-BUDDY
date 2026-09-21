import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StreakBadge } from './StreakBadge';
import { colors2, fontFamily2, spacing2 } from './theme';

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
        <Ionicons name="arrow-back" size={20} color={colors2.white} />
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
    gap: spacing2.xs,
    paddingHorizontal: spacing2.md,
    paddingTop: spacing2.xs,
    paddingBottom: spacing2.md,
    backgroundColor: colors2.black,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors2.cardOptionIdle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1, gap: 1 },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 16.5, color: colors2.white },
  subtitle: { fontFamily: fontFamily2.regular, fontSize: 11, color: colors2.whiteMuted },
  mascot: { width: 34, height: 40 },
});
