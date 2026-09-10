import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { QuizOptionRow } from './QuizOptionRow';
import { QuizFeedbackBanner } from './QuizFeedbackBanner';
import { colors, fontFamily, primaryGradient, radii, spacing } from './theme';
import type { QuizOptionId, QuizQuestion } from '../data/types';

const studyingMascot = require('../assets/mascot-studying.png');

export function QuizQuestionCard({
  question,
  selectedOptionId,
  onSelectOption,
  onPressNext,
  isLastQuestion,
}: {
  question: QuizQuestion;
  selectedOptionId?: QuizOptionId;
  onSelectOption: (optionId: QuizOptionId) => void;
  onPressNext?: () => void;
  isLastQuestion: boolean;
}) {
  const answered = selectedOptionId != null;
  const isCorrect = answered && selectedOptionId === question.correctOptionId;

  return (
    <Card style={styles.card}>
      <View style={styles.intro}>
        <Image source={studyingMascot} style={styles.introMascot} resizeMode="contain" />
        <View style={styles.introBubble}>
          <Text style={styles.introTitle}>Câu hỏi</Text>
          <Text style={styles.introSubtitle}>Chọn đáp án đúng nhất nhé!</Text>
        </View>
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

      {answered && <QuizFeedbackBanner isCorrect={isCorrect} explanation={question.explanation} />}

      {answered && (
        <Pressable onPress={onPressNext}>
          <LinearGradient
            colors={primaryGradient.colors}
            start={primaryGradient.start}
            end={primaryGradient.end}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>{isLastQuestion ? 'Hoàn thành' : 'Câu tiếp theo'}</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </LinearGradient>
        </Pressable>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  intro: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  introMascot: { width: 48, height: 54 },
  introBubble: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 1,
  },
  introTitle: { fontFamily: fontFamily.extraBold, fontSize: 13, color: colors.primary },
  introSubtitle: { fontFamily: fontFamily.semiBold, fontSize: 11.5, color: colors.textMuted },
  question: { fontFamily: fontFamily.extraBold, fontSize: 17, color: colors.textPrimary, lineHeight: 24 },
  options: { gap: spacing.sm },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
  },
  nextButtonText: { color: colors.white, fontFamily: fontFamily.extraBold, fontSize: 15 },
});
