import { StyleSheet, Text, View } from 'react-native';
import { cardShadow, colors, fontFamily, radii, spacing } from './theme';

export function StreakBadge({ days }: { days: number }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.fire}>🔥</Text>
      <Text style={styles.count}>{days}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 6,
    ...cardShadow,
  },
  fire: { fontSize: 15 },
  count: { fontFamily: fontFamily.extraBold, fontSize: 15, color: colors.textPrimary },
});
