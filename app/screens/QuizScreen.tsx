import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { QuizTopBar, QuizProgressBar, QuizQuestionCard, QuizBottomSheet, colors2, fontFamily2, spacing2 } from '../components';
import { getLevelById, getPersonaById, getProductById, getPositionInChapter, getQuizByLevelId } from '../data';
import type { QuizOptionId } from '../data/types';
import { useAuth } from '../lib/AuthContext';
import { useAppNavigation } from '../navigation/NavigationContext';

export function QuizScreen({ levelId = '2.3' }: { levelId?: string }) {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  const level = getLevelById(levelId);
  const persona = level ? getPersonaById(level.personaId) : undefined;
  const product = level ? getProductById(level.productId) : undefined;
  const questions = getQuizByLevelId(levelId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizOptionId>>({});

  if (!profile || !level || !persona || !product || questions.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Chưa có dữ liệu ôn tập cho level này.</Text>
          <Pressable onPress={() => navigate('map')} style={styles.emptyBackButton}>
            <Text style={styles.emptyBackButtonText}>Quay lại Map</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedOptionId = answers[currentQuestion.id];
  const isLastQuestion = currentIndex === questions.length - 1;
  const answered = selectedOptionId != null;
  const isCorrect = answered && selectedOptionId === currentQuestion.correctOptionId;

  const handleSelectOption = (optionId: QuizOptionId) => {
    if (selectedOptionId != null) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex((i) => i + 1);
    } else {
      navigate('roleplay', { levelId });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <QuizTopBar
        title={product.name}
        subtitle={`Chặng ${level.chapterNumber} • Level ${getPositionInChapter(level.id)}`}
        onClose={() => navigate('home')}
      />

      <QuizProgressBar total={questions.length} current={currentIndex} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <QuizQuestionCard
          question={currentQuestion}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          selectedOptionId={selectedOptionId}
          onSelectOption={handleSelectOption}
        />
      </ScrollView>

      {answered ? (
        <QuizBottomSheet
          isCorrect={isCorrect}
          explanation={currentQuestion.explanation}
          buttonLabel={isLastQuestion ? 'Gặp Khách hàng' : 'Câu tiếp theo'}
          onPressNext={handleNext}
        />
      ) : (
        <View style={styles.homeIndicatorArea}>
          <View style={styles.homeIndicator} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors2.orange },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing2.md,
    paddingTop: spacing2.md,
    paddingBottom: spacing2.lg,
  },
  homeIndicatorArea: { height: 34, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8 },
  homeIndicator: { width: 134, height: 5, borderRadius: 100, backgroundColor: colors2.white },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing2.xl, gap: spacing2.lg },
  emptyText: { fontFamily: fontFamily2.semiBold, fontSize: 14, color: colors2.white },
  emptyBackButton: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors2.white,
    paddingHorizontal: spacing2.lg,
    paddingVertical: spacing2.sm,
  },
  emptyBackButtonText: { fontFamily: fontFamily2.semiBold, fontSize: 13, color: colors2.white },
});
