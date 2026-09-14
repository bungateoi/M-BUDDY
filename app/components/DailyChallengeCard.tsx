import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors2, fontFamily2, orangeGradient2, radii2, spacing2 } from './theme';

export function DailyChallengeCard({
  title,
  isNew,
  description,
  rewardXp,
  onPress,
}: {
  title: string;
  isNew?: boolean;
  description: string;
  rewardXp: number;
  onPress?: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>

      {/* "Sticker shadow" — 1 lớp nền đặc màu shadowOrange, dày 6px phía
          dưới, giả lập drop-shadow(0px 6px 0px) không có blur như Figma. */}
      <Pressable onPress={onPress} style={styles.ctaShadow}>
        <LinearGradient colors={orangeGradient2.colors} start={orangeGradient2.start} end={orangeGradient2.end} style={styles.cta}>
          <Text style={styles.ctaTitle}>Tham gia</Text>
          <Text style={styles.ctaReward}>+{rewardXp} XP</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.md,
    backgroundColor: colors2.black,
    borderWidth: 1,
    borderColor: colors2.cardOutline,
    borderRadius: radii2.card,
    padding: spacing2.md,
  },
  body: { flex: 1, gap: 2 },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 18, lineHeight: 28, color: colors2.white },
  desc: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.whiteMuted },
  ctaShadow: {
    backgroundColor: colors2.shadowOrange,
    borderRadius: radii2.button,
    paddingBottom: 6,
  },
  cta: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii2.button,
    paddingHorizontal: spacing2.md,
    paddingVertical: spacing2.xs,
  },
  ctaTitle: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
  ctaReward: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.white },
});
