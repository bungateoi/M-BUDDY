import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, radii, spacing } from './theme';
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
        <Text style={[styles.badgeText, state !== 'idle' && styles.badgeTextActive]}>{id}</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
      {state === 'correct' && <Ionicons name="checkmark-circle" size={20} color={colors.success} />}
      {state === 'wrong' && <Ionicons name="close-circle" size={20} color={colors.error} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: '#EEE3D9',
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  rowCorrect: { borderColor: colors.success, backgroundColor: colors.successLight },
  rowWrong: { borderColor: colors.error, backgroundColor: colors.errorLight },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#EEE3D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCorrect: { backgroundColor: colors.success, borderColor: colors.success },
  badgeWrong: { backgroundColor: colors.error, borderColor: colors.error },
  badgeText: { fontFamily: fontFamily.extraBold, fontSize: 13, color: colors.textMuted },
  badgeTextActive: { color: colors.white },
  text: { flex: 1, fontFamily: fontFamily.bold, fontSize: 14, color: colors.textPrimary },
});
