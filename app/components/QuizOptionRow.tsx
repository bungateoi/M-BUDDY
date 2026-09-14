import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CancelCircleFillIcon, CheckCircleFillIcon } from './icons2';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';
import type { QuizOptionId } from '../data/types';

export type QuizOptionVisualState = 'idle' | 'correct' | 'wrong';

export function QuizOptionRow({
  id,
  text,
  state,
  disabled,
  onPress,
}: {
  id: QuizOptionId;
  text: string;
  state: QuizOptionVisualState;
  disabled?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.row, state === 'correct' && styles.rowCorrect, state === 'wrong' && styles.rowWrong]}
    >
      <View
        style={[
          styles.badge,
          state === 'correct' && styles.badgeCorrect,
          state === 'wrong' && styles.badgeWrong,
        ]}
      >
        <Text style={styles.badgeText}>{id}</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
      {state === 'correct' && <CheckCircleFillIcon size={16} />}
      {state === 'wrong' && <CancelCircleFillIcon size={16} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.xs,
    borderRadius: radii2.card,
    padding: spacing2.md,
    backgroundColor: colors2.cardOptionIdle,
  },
  rowCorrect: { backgroundColor: colors2.green800 },
  rowWrong: { backgroundColor: colors2.red800 },
  badge: {
    width: 32,
    height: 32,
    borderRadius: radii2.pill,
    backgroundColor: colors2.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCorrect: { backgroundColor: colors2.green500 },
  badgeWrong: { backgroundColor: colors2.red500 },
  badgeText: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white, textAlign: 'center' },
  text: { flex: 1, fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
});
