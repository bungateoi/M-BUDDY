import { StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

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
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.pill,
    paddingHorizontal: spacing2.md,
    paddingVertical: spacing2.xs,
    gap: 6,
  },
  fire: { fontSize: 15 },
  count: { fontFamily: fontFamily2.semiBold, fontSize: 15, color: colors2.white },
});
