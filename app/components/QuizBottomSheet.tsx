import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRightStraightIcon, CancelCircleFillIcon, CheckCircleFillIcon } from './icons2';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

// Thay thế HOÀN TOÀN QuizFeedbackBanner.tsx (nền màu nhạt, nằm trong card) +
// nút "Câu tiếp theo" từng nằm trong QuizQuestionCard.tsx — thiết kế mới
// (node-id=69:1815/69:1946) gộp cả 2 thành 1 sheet TRẮNG cố định dưới đáy
// màn, thay hẳn vị trí thanh menu dưới (Quiz không có BottomNavBar).
export function QuizBottomSheet({
  isCorrect,
  explanation,
  buttonLabel,
  onPressNext,
}: {
  isCorrect: boolean;
  explanation: string;
  buttonLabel: string;
  onPressNext?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.content}>
        <View style={styles.feedback}>
          <View style={styles.titleRow}>
            {isCorrect ? <CheckCircleFillIcon size={20} /> : <CancelCircleFillIcon size={20} />}
            <Text style={[styles.title, { color: isCorrect ? colors2.green500 : colors2.red500 }]}>
              {isCorrect ? 'Chính xác!' : 'Chưa đúng!'}
            </Text>
          </View>
          <Text style={styles.explanation}>{explanation}</Text>
        </View>

        <Pressable onPress={onPressNext} style={styles.button}>
          <Text style={styles.buttonText}>{buttonLabel}</Text>
          <ArrowRightStraightIcon size={20} />
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors2.white,
    borderTopLeftRadius: radii2.navTop,
    borderTopRightRadius: radii2.navTop,
    overflow: 'hidden',
  },
  content: { paddingHorizontal: spacing2.md, paddingTop: spacing2.md, paddingBottom: spacing2.xs, gap: spacing2.md },
  feedback: { gap: spacing2.xs },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing2.xxs },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20 },
  explanation: { fontFamily: fontFamily2.regular, fontSize: 14, lineHeight: 20, color: colors2.black },
  // "Sticker shadow" cứng 0px 6px 0px cam, giống hệt DailyChallengeCard CTA.
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing2.xs,
    backgroundColor: colors2.yellow,
    borderRadius: radii2.button,
    paddingHorizontal: spacing2.md,
    paddingVertical: spacing2.xs,
    shadowColor: colors2.shadowOrange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  buttonText: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.black },
});
