import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { cardShadow, colors, fontFamily, primaryGradient, radii, spacing } from './theme';

export function ResultCriterionRow({
  icon,
  label,
  score,
  maxScore,
  feedback,
  ratingLabel,
  isTotal,
}: {
  icon: string;
  label: string;
  score: number;
  maxScore: number;
  feedback: string;
  /** Chỉ dùng khi isTotal — hiện badge xếp loại thay vì thanh tiến độ. */
  ratingLabel?: string;
  isTotal?: boolean;
}) {
  const ratio = maxScore > 0 ? Math.max(0, Math.min(1, score / maxScore)) : 0;

  return (
    <View style={[styles.row, isTotal && styles.rowTotal]}>
      <View style={[styles.iconCircle, isTotal && styles.iconCircleTotal]}>
        <Ionicons name={icon as any} size={18} color={colors.primary} />
      </View>

      <View style={styles.body}>
        <View style={styles.topLine}>
          <Text style={[styles.label, isTotal && styles.labelTotal]} numberOfLines={1}>
            {label}
          </Text>
          <Text style={styles.scoreText}>
            {score}/{maxScore}
          </Text>
        </View>

        {isTotal ? (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{ratingLabel}</Text>
          </View>
        ) : (
          <View style={styles.track}>
            <LinearGradient
              colors={primaryGradient.colors}
              start={primaryGradient.start}
              end={primaryGradient.end}
              style={[styles.fill, { width: `${ratio * 100}%` }]}
            />
          </View>
        )}

        <Text style={styles.feedback}>{feedback}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...cardShadow,
  },
  rowTotal: { backgroundColor: colors.primaryLight, shadowOpacity: 0 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleTotal: { backgroundColor: colors.white },
  body: { flex: 1, gap: 6 },
  topLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  label: { flex: 1, fontFamily: fontFamily.extraBold, fontSize: 13.5, color: colors.textPrimary },
  labelTotal: { fontSize: 14.5 },
  scoreText: { fontFamily: fontFamily.black, fontSize: 15, color: colors.primary },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.chipTrack, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  ratingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  ratingText: { color: colors.white, fontFamily: fontFamily.extraBold, fontSize: 11 },
  feedback: { fontFamily: fontFamily.semiBold, fontSize: 11.5, color: colors.textMuted, lineHeight: 16 },
});
