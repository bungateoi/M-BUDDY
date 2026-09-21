import { Image, StyleSheet, Text, View } from 'react-native';
import { QuizOptionRow } from './QuizOptionRow';
import { SpeedMarkDecor } from './icons2';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';
import type { QuizOptionId, QuizQuestion } from '../data/types';

const studyingMascot = require('../assets/mascot-studying.png');

// Đã bỏ hẳn banner kết quả + nút "Câu tiếp theo" (chuyển ra
// QuizBottomSheet.tsx, hiện như 1 sheet trắng cố định dưới đáy màn thay vì
// nằm trong card — đúng thiết kế mới node-id=69:1815/69:1946).
export function QuizQuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
}: {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedOptionId?: QuizOptionId;
  onSelectOption: (optionId: QuizOptionId) => void;
}) {
  const answered = selectedOptionId != null;

  return (
    <View style={styles.card}>
      <View style={styles.intro}>
        <Image source={studyingMascot} style={styles.introMascot} resizeMode="contain" />
        <View style={styles.introTextCol}>
          <Text style={styles.introTitle}>
            Câu {currentIndex + 1}/{totalQuestions}
          </Text>
          <Text style={styles.introSubtitle}>Chọn đáp án đúng nhất nhé !</Text>
        </View>
        <SpeedMarkDecor />
      </View>

      <Text style={styles.question}>{question.question}</Text>

      <View style={styles.options}>
        {question.options.map((option) => {
          let state: 'idle' | 'correct' | 'wrong' = 'idle';
          if (answered) {
            if (option.id === question.correctOptionId) state = 'correct';
            else if (option.id === selectedOptionId) state = 'wrong';
          }
          return (
            <QuizOptionRow
              key={option.id}
              id={option.id}
              text={option.text}
              state={state}
              disabled={answered}
              onPress={() => onSelectOption(option.id)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors2.black,
    borderRadius: radii2.card,
    padding: spacing2.md,
    gap: spacing2.md,
  },
  intro: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing2.xxs },
  introMascot: { width: 40, height: 40 },
  introTextCol: { flex: 1, gap: spacing2.xxs },
  introTitle: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
  introSubtitle: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.whiteMuted },
  question: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
  options: { gap: spacing2.xs },
});
