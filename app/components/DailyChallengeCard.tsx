import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontFamily, primaryGradient, radii, spacing } from './theme';

const mascotSource = require('../assets/mascot-confident.png');

export function DailyChallengeCard({
  title,
  isNew,
  description,
  rewardXp,
  onPress,
}: {
  title: string;
  isNew: boolean;
  description: string;
  rewardXp: number;
  onPress?: () => void;
}) {
  return (
    <View style={styles.card}>
      <Image source={mascotSource} style={styles.mascot} resizeMode="contain" />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {isNew && (
            <LinearGradient colors={primaryGradient.colors} start={primaryGradient.start} end={primaryGradient.end} style={styles.badge}>
              <Text style={styles.badgeText}>Mới</Text>
            </LinearGradient>
          )}
        </View>
        <Text style={styles.desc}>{description}</Text>
      </View>
      <View style={styles.cta}>
        <Pressable onPress={onPress}>
          <LinearGradient colors={primaryGradient.colors} start={primaryGradient.start} end={primaryGradient.end} style={styles.button}>
            <Text style={styles.buttonIcon}>🎁</Text>
            <Text style={styles.buttonText}>Tham gia</Text>
          </LinearGradient>
        </Pressable>
        <Text style={styles.reward}>🔥 +{rewardXp} XP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radii.xl,
    padding: spacing.md,
  },
  mascot: { width: 42, height: 52 },
  body: { flex: 1, gap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  title: { fontFamily: fontFamily.extraBold, fontSize: 13.5, color: colors.textPrimary },
  badge: {
    borderRadius: radii.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: { color: colors.white, fontFamily: fontFamily.bold, fontSize: 9.5 },
  desc: { fontFamily: fontFamily.semiBold, fontSize: 10.5, color: colors.textMuted, lineHeight: 14 },
  cta: { alignItems: 'center', gap: 5 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  buttonIcon: { fontSize: 12 },
  buttonText: { color: colors.white, fontFamily: fontFamily.extraBold, fontSize: 11.5 },
  reward: { fontFamily: fontFamily.bold, fontSize: 10, color: colors.primary },
});
