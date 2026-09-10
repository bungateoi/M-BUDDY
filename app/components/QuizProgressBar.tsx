import { StyleSheet, View } from 'react-native';
import { colors, radii } from './theme';

export type QuizSegmentState = 'correct' | 'wrong' | 'current' | 'upcoming';

export function QuizProgressBar({ segments }: { segments: QuizSegmentState[] }) {
  return (
    <View style={styles.row}>
      {segments.map((state, i) => (
        <View key={i} style={[styles.segment, SEGMENT_STYLE[state]]} />
      ))}
    </View>
  );
}

const SEGMENT_STYLE = StyleSheet.create({
  correct: { backgroundColor: colors.success },
  wrong: { backgroundColor: colors.error },
  current: { backgroundColor: colors.primary },
  upcoming: { backgroundColor: colors.chipTrack },
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 7, borderRadius: radii.pill },
});
