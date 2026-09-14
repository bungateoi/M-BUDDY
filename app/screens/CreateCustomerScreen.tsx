import { useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  QuizHeader,
  PersonaBuilderRow,
  CriterionPickerModal,
  CUSTOM_CHIP_LABEL,
  HomeBottomNavBar,
  colors2,
  fontFamily2,
  radii2,
  spacing2,
} from '../components';
import { personaBuilderCriteria } from '../data/personaBuilderOptions';
import { callGeneratePersona } from '../lib/ai';
import { useAuth } from '../lib/AuthContext';
import { showAlert } from '../lib/platformAlert';
import type { PersonaCriteriaInput, PersonaFieldAnswer } from '../data/types';
import { useAppNavigation } from '../navigation/NavigationContext';

function fieldSummaryParts(answer: PersonaFieldAnswer | undefined): string[] {
  if (!answer) return [];
  const parts = answer.selected.filter((s) => s !== CUSTOM_CHIP_LABEL);
  if (answer.custom.trim()) parts.push(answer.custom.trim());
  return parts;
}

export function CreateCustomerScreen() {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  const [answers, setAnswers] = useState<Record<string, PersonaFieldAnswer>>({});
  const [activeCriterionId, setActiveCriterionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCriterion = personaBuilderCriteria.find((c) => c.id === activeCriterionId);

  const setFieldAnswer = (fieldKey: string, answer: PersonaFieldAnswer) => {
    setAnswers((prev) => ({ ...prev, [fieldKey]: answer }));
  };

  const summaryFor = (criterionId: string): string | undefined => {
    const criterion = personaBuilderCriteria.find((c) => c.id === criterionId);
    if (!criterion) return undefined;
    const parts = criterion.fields.flatMap((f) => fieldSummaryParts(answers[f.key]));
    return parts.length ? parts.join(', ') : undefined;
  };

  const handleSubmit = async () => {
    const hasAnyAnswer = personaBuilderCriteria.some((c) => c.fields.some((f) => fieldSummaryParts(answers[f.key]).length > 0));
    if (!hasAnyAnswer) {
      showAlert('Chưa có tiêu chí nào', 'Chọn ít nhất vài tiêu chí (tuổi, nghề nghiệp, nhu cầu...) để AI tạo chân dung khách hàng sát thực tế hơn.');
      return;
    }

    const criteria: PersonaCriteriaInput = {
      age: fieldSummaryParts(answers.age)[0],
      gender: fieldSummaryParts(answers.gender)[0],
      occupation: fieldSummaryParts(answers.occupation)[0],
      income: fieldSummaryParts(answers.income)[0],
      region: fieldSummaryParts(answers.region)[0],
      needs: fieldSummaryParts(answers.needs),
      behavior: fieldSummaryParts(answers.behavior),
      painPoints: fieldSummaryParts(answers.painPoints),
      expectations: fieldSummaryParts(answers.expectations),
      motivation: fieldSummaryParts(answers.motivation),
      barrier: fieldSummaryParts(answers.barrier),
    };

    setIsSubmitting(true);
    try {
      const generatedCustomer = await callGeneratePersona(criteria);
      navigate('roleplay', { generatedCustomer });
    } catch {
      showAlert('Không tạo được chân dung khách hàng', 'Có lỗi kết nối tới AI, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <QuizHeader
        title="Tạo khách hàng theo tiêu chí"
        subtitle="Xây dựng chân dung khách hàng để luyện tập role-play"
        streakDays={profile.currentStreak}
        onBack={() => navigate('practice')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.rows}>
          {personaBuilderCriteria.map((criterion) => (
            <PersonaBuilderRow
              key={criterion.id}
              order={criterion.order}
              icon={criterion.icon}
              label={criterion.label}
              placeholder={criterion.placeholder}
              summary={summaryFor(criterion.id)}
              onPress={() => setActiveCriterionId(criterion.id)}
            />
          ))}
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>✨ Gợi ý</Text>
          <Text style={styles.tipText}>
            Điền càng chi tiết, AI sẽ tạo khách hàng càng sát thực tế, giúp buổi role-play hiệu quả hơn.
          </Text>
        </View>

        <Pressable onPress={handleSubmit} disabled={isSubmitting} style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}>
          {isSubmitting ? (
            <ActivityIndicator color={colors2.white} />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Tạo chân dung khách hàng</Text>
              <Ionicons name="arrow-forward" size={17} color={colors2.white} />
            </>
          )}
        </Pressable>
      </ScrollView>

      <HomeBottomNavBar active="practice" onPressItem={(key) => {
        if (key === 'home') navigate('home');
        if (key === 'practice') navigate('practice');
        if (key === 'xephang') navigate('leaderboard');
        if (key === 'ontap') navigate('practiceHistory');
        if (key === 'toi') navigate('profile');
      }} />

      {activeCriterion && (
        <CriterionPickerModal
          visible
          title={activeCriterion.label}
          fields={activeCriterion.fields}
          answers={answers}
          onChangeField={setFieldAnswer}
          onClose={() => setActiveCriterionId(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors2.black },
  content: { padding: spacing2.md, gap: spacing2.md, paddingBottom: spacing2.xl },
  rows: { gap: spacing2.xs },
  tipCard: {
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    padding: spacing2.md,
    gap: 2,
  },
  tipTitle: { fontFamily: fontFamily2.semiBold, fontSize: 12.5, color: colors2.orange },
  tipText: { fontFamily: fontFamily2.regular, fontSize: 11.5, color: colors2.whiteMuted, lineHeight: 16 },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors2.orange,
    borderRadius: radii2.pill,
    paddingVertical: spacing2.md,
  },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { fontFamily: fontFamily2.semiBold, fontSize: 14.5, color: colors2.white },
});
