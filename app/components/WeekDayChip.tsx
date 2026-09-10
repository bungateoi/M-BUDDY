import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, radii } from './theme';
import type { WeekDayProgress } from '../data/types';

export function WeekDayChip({ day }: { day: WeekDayProgress }) {
  const isToday = day.status === 'today';
  const isDone = day.status === 'completed' || isToday;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.chip,
          isDone && styles.chipDone,
          isToday && styles.chipToday,
          day.status === 'locked' && styles.chipLocked,
        ]}
      >
        {day.status === 'locked' ? (
          <Ionicons name="lock-closed" size={14} color="rgba(255,255,255,0.75)" />
        ) : isDone ? (
          <Text style={styles.fire}>🔥</Text>
        ) : null}
      </View>
      <Text style={[styles.label, isToday && styles.labelToday]}>{day.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 6 },
  chip: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  chipDone: { backgroundColor: 'rgba(255,255,255,0.3)' },
  chipToday: {
    backgroundColor: colors.white,
    shadowColor: '#5A2200',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
  },
  chipLocked: { backgroundColor: 'rgba(0,0,0,0.14)' },
  fire: { fontSize: 17 },
  label: { fontFamily: fontFamily.bold, fontSize: 11.5, color: 'rgba(255,255,255,0.85)' },
  labelToday: { color: colors.white },
});
