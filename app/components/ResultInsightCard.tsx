import { StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';
import type { RoleplayInsightTip } from '../data/types';

// Figma mới (node-id=76-3940) bỏ hẳn icon mascot ở tiêu đề — chỉ còn chữ
// "M-BUDDY Insight" trên nền thẻ đen, khác bản cũ (icon + "✨ M-BUDDY Insight").
export function ResultInsightCard({
  summary,
  tips,
}: {
  summary: string;
  tips: RoleplayInsightTip[];
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>M-BUDDY Insight</Text>

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
    backgroundColor: colors2.black,
    borderWidth: 1,
    borderColor: colors2.cardOutline,
    borderRadius: radii2.card,
    padding: spacing2.md,
    gap: spacing2.md,
  },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 16, lineHeight: 24, color: colors2.white },
  summary: { fontFamily: fontFamily2.regular, fontSize: 14, lineHeight: 20, color: colors2.white },
  tips: { gap: spacing2.sm },
  tipRow: { flexDirection: 'row', gap: spacing2.xs },
  tipIcon: { fontSize: 14 },
  tipText: { flex: 1, fontFamily: fontFamily2.regular, fontSize: 14, lineHeight: 20, color: colors2.white },
});
