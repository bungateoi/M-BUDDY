import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { cardShadow, colors, fontFamily, primaryGradient, radii, spacing } from './theme';

function formatXp(xp: number) {
  return xp.toLocaleString('vi-VN');
}

export function XPLevelRow({
  xp,
  level,
  levelProgress,
}: {
  xp: number;
  level: number;
  levelProgress: number;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.card, styles.xpCard]}>
        <Ionicons name="star" size={17} color={colors.warning} />
        <Text style={styles.text}>{formatXp(xp)} XP</Text>
      </View>
      <View style={[styles.card, styles.levelCard]}>
        <View style={styles.levelHeader}>
          <Ionicons name="ribbon" size={17} color={colors.primary} />
          <Text style={styles.text}>Lv. {level}</Text>
        </View>
        <View style={styles.track}>
          <LinearGradient
            colors={primaryGradient.colors}
            start={primaryGradient.start}
            end={primaryGradient.end}
            style={[styles.fill, { width: `${Math.round(levelProgress * 100)}%` }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...cardShadow,
  },
  xpCard: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  levelCard: { flex: 1, gap: 6, justifyContent: 'center' },
  levelHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  text: { fontFamily: fontFamily.extraBold, fontSize: 13.5, color: colors.textPrimary },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.chipTrack,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
