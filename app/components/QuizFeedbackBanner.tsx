import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, radii, spacing } from './theme';

const celebrateMascot = require('../assets/mascot-celebrate.png');
const confidentMascot = require('../assets/mascot-confident.png');

export function QuizFeedbackBanner({
  isCorrect,
  explanation,
}: {
  isCorrect: boolean;
  explanation: string;
}) {
  return (
    <View style={[styles.wrap, isCorrect ? styles.wrapCorrect : styles.wrapWrong]}>
      <View style={styles.textCol}>
        <View style={styles.titleRow}>
          <Ionicons
            name={isCorrect ? 'checkmark-circle' : 'close-circle'}
            size={16}
            color={isCorrect ? colors.success : colors.error}
          />
          <Text style={[styles.title, { color: isCorrect ? colors.success : colors.error }]}>
            {isCorrect ? 'Chính xác! ✨' : 'Chưa đúng'}
          </Text>
        </View>
        <Text style={[styles.explanation, { color: isCorrect ? '#1F8A4C' : '#B8323E' }]}>{explanation}</Text>
      </View>
      <Image
        source={isCorrect ? celebrateMascot : confidentMascot}
        style={styles.mascot}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  wrapCorrect: { backgroundColor: colors.successLight },
  wrapWrong: { backgroundColor: colors.errorLight },
  textCol: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontFamily: fontFamily.extraBold, fontSize: 14 },
  explanation: { fontFamily: fontFamily.semiBold, fontSize: 12, lineHeight: 17 },
  mascot: { width: 56, height: 66 },
});
