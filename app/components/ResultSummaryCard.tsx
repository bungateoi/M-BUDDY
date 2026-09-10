import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { colors, fontFamily, radii, spacing } from './theme';

const celebrateMascot = require('../assets/mascot-celebrate.png');

export function ResultSummaryCard({
  totalScore,
  maxTotalScore,
  ratingLabel,
  summary,
}: {
  totalScore: number;
  maxTotalScore: number;
  ratingLabel: string;
  summary: string;
}) {
  return (
    <Card style={styles.card}>
      <Image source={celebrateMascot} style={styles.mascot} resizeMode="contain" />

      <View style={styles.textCol}>
        <Text style={styles.label}>Tổng điểm</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.score}>{totalScore}</Text>
          <Text style={styles.maxScore}>/{maxTotalScore}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{ratingLabel}</Text>
        </View>
        <Text style={styles.summary}>{summary}</Text>
      </View>

      <View style={styles.medalCircle}>
        <Ionicons name="ribbon" size={32} color={colors.primary} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  mascot: { width: 58, height: 70 },
  textCol: { flex: 1, gap: 4 },
  label: { fontFamily: fontFamily.bold, fontSize: 13, color: colors.textMuted },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline' },
  score: { fontFamily: fontFamily.black, fontSize: 34, color: colors.primary },
  maxScore: { fontFamily: fontFamily.extraBold, fontSize: 16, color: colors.textMuted },
  ratingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    marginTop: 2,
  },
  ratingText: { color: colors.white, fontFamily: fontFamily.extraBold, fontSize: 11.5 },
  summary: { fontFamily: fontFamily.semiBold, fontSize: 11.5, color: colors.textMuted, lineHeight: 16, marginTop: 2 },
  medalCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
