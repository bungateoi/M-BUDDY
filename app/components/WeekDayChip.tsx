import { StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2 } from './theme';
import { StreakFireIcon, StreakLockedIcon } from './icons2';
import type { WeekDayProgress } from '../data/types';

export function WeekDayChip({ day }: { day: WeekDayProgress }) {
  const isDone = day.status === 'completed' || day.status === 'today';

  return (
    <View style={styles.wrap}>
      {isDone ? <StreakFireIcon boxSize={32} /> : <StreakLockedIcon size={32} />}
      <Text style={styles.label}>{day.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', gap: 4 },
  label: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.white, textAlign: 'center' },
});
