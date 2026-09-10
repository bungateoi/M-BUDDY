import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radii, spacing } from './theme';
import type { RoleplayInsightTip } from '../data/types';

const studyingMascot = require('../assets/mascot-studying.png');

export function ResultInsightCard({
  summary,
  tips,
}: {
  summary: string;
  tips: RoleplayInsightTip[];
}) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Image source={studyingMascot} style={styles.mascot} resizeMode="contain" />
        <Text style={styles.title}>✨ M-BUDDY Insight</Text>
      </View>

      <Text style={styles.summary}>{summary}</Text>

      <View style={styles.tips}>
        {tips.map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <Text style={styles.tipIcon}>{tip.icon}</Text>
            <Text style={styles.tipText}>{tip.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primaryLight,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  mascot: { width: 40, height: 48 },
  title: { fontFamily: fontFamily.extraBold, fontSize: 15, color: colors.textPrimary },
  summary: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.textPrimary, lineHeight: 19 },
  tips: { gap: spacing.sm, marginTop: 2 },
  tipRow: { flexDirection: 'row', gap: 8 },
  tipIcon: { fontSize: 14 },
  tipText: { flex: 1, fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.textPrimary, lineHeight: 18 },
});
