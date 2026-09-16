import { useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { QuizTopBar, QuizProgressBar, QuizQuestionCard, QuizBottomSheet, colors2, fontFamily2, spacing2 } from '../components';
import { getLevelById, getPersonaById, getProductById, getPositionInChapter, getQuizByLevelId } from '../data';
import type { QuizOptionId } from '../data/types';
import { useAuth } from '../lib/AuthContext';
import { useAppNavigation, type ScreenName } from '../navigation/NavigationContext';

export function QuizScreen({ levelId = '2.3', backTo }: { levelId?: string; backTo?: ScreenName }) {
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
      navigate('roleplay', { levelId, backTo });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Image source={require('../assets/decor/quiz-flag-bg.png')} style={styles.flagBg} resizeMode="stretch" />
      <QuizTopBar
        title={product.name}
        subtitle={`Chặng ${level.chapterNumber} • Level ${getPositionInChapter(level.id)}`}
        onClose={() => navigate(backTo ?? 'map')}
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

// Hoạ tiết cờ đua kẻ ô caro ở nền (node-id=69:1392, con "Flag" 114:10782) —
// layer gốc trong Figma là hình xám/trắng (223 path Vector ghép lại), style
// thật sự là mix-blend-mode:screen + opacity:0.5 đè lên nền cam #FB6616 —
// 2 thuộc tính này RN không hỗ trợ ở runtime (không cross-platform), nên
// bake sẵn kết quả blend thành 1 ảnh PNG tĩnh (asset xám gốc lấy qua
// get_screenshot contentsOnly=true để không bị mix-blend-mode làm sai màu
// khi export, rồi tự tính công thức "screen" bằng tay lên nền cam). Kích
// thước/vị trí giữ nguyên đơn vị px gốc trong Figma (box 1160x580, đáy thò
// ra ngoài -103px, canh giữa theo chiều ngang — ảnh đã được kéo sẵn đúng
// 1160x580 khi bake, không cần resizeMode kéo giãn thêm ở runtime) — dùng
// left/marginLeft theo % thay vì trừ cứng theo bề ngang màn hình 390px gốc,
// để vẫn canh giữa đúng dù màn hình rộng khác (web giới hạn
// webPhoneFrameMaxWidth=480).
const FLAG_BG_W = 1160;
const FLAG_BG_H = 580;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors2.orange, overflow: 'hidden' },
  flagBg: {
    position: 'absolute',
    width: FLAG_BG_W,
    height: FLAG_BG_H,
    left: '50%',
    marginLeft: -FLAG_BG_W / 2,
    bottom: -103,
    pointerEvents: 'none',
  },
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
