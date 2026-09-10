import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, radii, spacing } from './theme';

function barColorFor(value: number): string {
  if (value >= 70) return colors.success;
  if (value >= 50) return colors.warning;
  return colors.error;
}

export function KnowledgeTopicRow({ icon, label, value }: { icon: string; label: string; value: number }) {
  const barColor = barColorFor(value);

  return (
    <View style={styles.row}>
      <View style={[styles.iconCircle, { backgroundColor: `${barColor}22` }]}>
        <Ionicons name={icon as any} size={16} color={barColor} />
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: barColor }]} />
        </View>
      </View>
      <Text style={[styles.valueText, { color: barColor }]}>{value}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 5 },
  label: { fontFamily: fontFamily.bold, fontSize: 12.5, color: colors.textPrimary },
  track: { height: 7, borderRadius: radii.pill, backgroundColor: colors.chipTrack, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radii.pill },
  valueText: { fontFamily: fontFamily.extraBold, fontSize: 13, width: 36, textAlign: 'right' },
});
