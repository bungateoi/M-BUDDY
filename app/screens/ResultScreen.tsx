import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  QuizTopBar,
  ResultSummaryCard,
  ResultCriterionRow,
  ResultInsightCard,
  ConversationHistoryModal,
  colors2,
  fontFamily2,
  radii2,
  spacing2,
} from '../components';
import { ArrowRightStraightIcon, RefreshIcon } from '../components/icons2';
import { getRoleplayResultByLevelId } from '../data';
import type { GeneratedCustomerPersona } from '../data/types';
import { useAuth } from '../lib/AuthContext';
import { useAppNavigation, type ScreenName } from '../navigation/NavigationContext';

export function ResultScreen({
  levelId,
  practiceCustomerId,
  generatedCustomer,
  backTo,
}: {
  levelId?: string;
  practiceCustomerId?: string;
  generatedCustomer?: GeneratedCustomerPersona;
  /** Màn quay về khi bấm nút đóng (X) — Map nếu đang học 1 level, Practice
   * nếu "Chinh phục"/"Thiết lập", Ôn tập nếu xem lại 1 mục lịch sử, xem
   * NavigationContext.tsx. */
  backTo?: ScreenName;
}) {
  const { navigate, params } = useAppNavigation();
  const { profile } = useAuth();
  const [showHistory, setShowHistory] = useState(false);
  // Ưu tiên điểm THẬT vừa nhận từ backend (RolePlayScreen truyền qua
  // navigate('result', { levelId, roleplayResult })); fallback về mock nếu
  // không có (vd. vào thẳng màn Kết quả để xem UI khi dev) — chỉ có mock cho
  // các level cố định trong Map, không có cho hồ sơ khách hàng thật.
  const result = params.roleplayResult ?? (levelId ? getRoleplayResultByLevelId(levelId) : undefined);
  const retryParams = {
    ...(levelId ? { levelId } : practiceCustomerId ? { practiceCustomerId } : { generatedCustomer }),
    backTo,
  };

  if (!result || !profile) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.retryText}>Chưa có dữ liệu kết quả cho level này.</Text>
          <Pressable onPress={() => navigate('home')} style={styles.emptyButton}>
            <Text style={styles.retryText}>Về Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <QuizTopBar title="Về đích" onClose={() => navigate(backTo ?? 'home')} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {params.unlockedChaptersUpTo != null && (
          <View style={styles.unlockBanner}>
            <Text style={styles.unlockBannerText}>
              🎉 Đạt yêu cầu học vượt — đã mở khoá chặng 1–{params.unlockedChaptersUpTo}!
            </Text>
          </View>
        )}

        <ResultSummaryCard
          totalScore={result.totalScore}
          maxTotalScore={result.maxTotalScore}
          summary={result.summary}
          onPressHistory={() => setShowHistory(true)}
        />

        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Chi tiết đánh giá</Text>
          <View style={styles.criteriaList}>
            {result.criteria.map((c) => (
              <ResultCriterionRow
                key={c.key}
                icon={c.icon}
                label={c.label}
                score={c.score}
                maxScore={c.maxScore}
                feedback={c.feedback}
              />
            ))}
          </View>
        </View>

        <ResultInsightCard summary={result.insightSummary} tips={result.insightTips} />

        <View style={styles.actionsRow}>
          <Pressable style={styles.retryButton} onPress={() => navigate('roleplay', retryParams)}>
            <Text style={styles.retryText}>Luyện tập lại</Text>
            <RefreshIcon size={20} />
          </Pressable>
          <Pressable style={styles.continueButton} onPress={() => navigate('home')}>
            <Text style={styles.continueText}>Tiếp tục học</Text>
            <ArrowRightStraightIcon size={20} />
          </Pressable>
        </View>
      </ScrollView>

      <ConversationHistoryModal
        visible={showHistory}
        transcript={result.transcript ?? []}
        onClose={() => setShowHistory(false)}
      />
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
    gap: spacing2.md,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing2.lg, padding: spacing2.xl },
  emptyButton: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors2.white,
    paddingHorizontal: spacing2.lg,
    paddingVertical: spacing2.sm,
  },
  unlockBanner: { backgroundColor: colors2.green800, borderRadius: radii2.card, padding: spacing2.md },
  unlockBannerText: { fontFamily: fontFamily2.semiBold, fontSize: 13, color: colors2.white, textAlign: 'center' },
  detailCard: {
    backgroundColor: colors2.black,
    borderWidth: 1,
    borderColor: colors2.cardOutline,
    borderRadius: radii2.card,
    padding: spacing2.md,
    gap: spacing2.md,
  },
  sectionTitle: { fontFamily: fontFamily2.semiBold, fontSize: 16, lineHeight: 24, color: colors2.white },
  criteriaList: { gap: spacing2.sm },
  actionsRow: { flexDirection: 'row', gap: spacing2.md },
  // "Sticker shadow" cứng (0px 6px 0px cam) — giống hệt DailyChallengeCard CTA.
  retryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors2.white,
    borderRadius: radii2.button,
    paddingHorizontal: spacing2.md,
    paddingVertical: spacing2.xs,
    shadowColor: colors2.shadowOrange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  retryText: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.black },
  continueButton: {
    flex: 1,
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
  continueText: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.black },
});
