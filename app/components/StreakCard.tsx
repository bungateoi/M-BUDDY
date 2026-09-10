import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontFamily, primaryGradient, radii, spacing } from './theme';
import { WeekDayChip } from './WeekDayChip';
import type { WeekDayProgress } from '../data/types';

export function StreakCard({
  currentStreak,
  longestStreak,
  weekProgress,
}: {
  currentStreak: number;
  longestStreak: number;
  weekProgress: WeekDayProgress[];
}) {
  return (
    <LinearGradient
      colors={primaryGradient.colors}
      start={primaryGradient.start}
      end={primaryGradient.end}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.streakInfo}>
          <View style={styles.iconCircle}>
            <Text style={styles.fireBig}>🔥</Text>
          </View>
          <View>
            <Text style={styles.streakCount}>{currentStreak} ngày</Text>
            <Text style={styles.streakLabel}>chuỗi học liên tiếp</Text>
          </View>
        </View>
        <View style={styles.recordBox}>
          <Text style={styles.recordLabel}>Kỷ lục</Text>
          <Text style={styles.recordValue}>{longestStreak} ngày</Text>
        </View>
      </View>

      <View style={styles.weekRow}>
        {weekProgress.map((day) => (
          <WeekDayChip key={day.label} day={day} />
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: '#C4460F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 6,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streakInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireBig: { fontSize: 24 },
  streakCount: { fontFamily: fontFamily.extraBold, fontSize: 21, color: colors.white },
  streakLabel: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: 'rgba(255,255,255,0.9)' },
  recordBox: { alignItems: 'flex-end' },
  recordLabel: { fontFamily: fontFamily.semiBold, fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  recordValue: { fontFamily: fontFamily.extraBold, fontSize: 17, color: colors.white },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
