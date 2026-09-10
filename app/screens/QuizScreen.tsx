import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  QuizHeader,
  QuizProgressBar,
  QuizQuestionCard,
  BottomNavBar,
  colors,
  fontFamily,
  spacing,
} from '../components';
import type { QuizSegmentState } from '../components/QuizProgressBar';
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

  let correctCount = 0;
  for (let i = 0; i < currentIndex; i++) {
    if (answers[questions[i].id] === questions[i].correctOptionId) correctCount++;
  }

  const segments: QuizSegmentState[] = questions.map((q, i) => {
    if (i < currentIndex) return answers[q.id] === q.correctOptionId ? 'correct' : 'wrong';
    if (i === currentIndex) return 'current';
    return 'upcoming';
  });

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
      <QuizHeader
        title="Ôn tập nhanh"
        subtitle={`Chặng ${level.chapterNumber} • Level ${getPositionInChapter(level.id)} • ${product.shortName ?? product.name}`}
        streakDays={profile.currentStreak}
        onBack={() => navigate('home')}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <QuizProgressBar segments={segments} />

        <Text style={styles.counter}>
          Câu {currentIndex + 1}/{questions.length}
          {currentIndex > 0 && (
            <Text style={styles.counterCorrect}>
              {'  •  ✓ '}
              {correctCount}/{currentIndex} đúng
            </Text>
          )}
        </Text>

        <QuizQuestionCard
          question={currentQuestion}
          selectedOptionId={selectedOptionId}
          onSelectOption={handleSelectOption}
          onPressNext={handleNext}
          isLastQuestion={isLastQuestion}
        />
      </ScrollView>

      <BottomNavBar
        active="map"
        onPressItem={(key) => {
          if (key === 'home') navigate('home');
          if (key === 'map') navigate('map');
          if (key === 'practice') navigate('practice');
          if (key === 'xephang') navigate('leaderboard');
          if (key === 'ontap') navigate('practiceHistory');
          if (key === 'toi') navigate('profile');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  scroll: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  counter: { fontFamily: fontFamily.bold, fontSize: 13, color: colors.textMuted },
  counterCorrect: { color: colors.success },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
  emptyText: { fontFamily: fontFamily.semiBold, fontSize: 14, color: colors.textMuted },
  emptyBackButton: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  emptyBackButtonText: { fontFamily: fontFamily.extraBold, fontSize: 13, color: colors.primary },
});
