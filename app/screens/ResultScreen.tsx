import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  ResultHeader,
  ResultSummaryCard,
  ResultCriterionRow,
  ResultInsightCard,
  ConversationHistorySection,
  BottomNavBar,
  colors,
  fontFamily,
  primaryGradient,
  radii,
  spacing,
} from '../components';
import { getRoleplayResultByLevelId } from '../data';
import type { GeneratedCustomerPersona } from '../data/types';
import { useAuth } from '../lib/AuthContext';
import { useAppNavigation } from '../navigation/NavigationContext';

export function ResultScreen({
  levelId,
  practiceCustomerId,
  generatedCustomer,
}: {
  levelId?: string;
  practiceCustomerId?: string;
  generatedCustomer?: GeneratedCustomerPersona;
}) {
  const { navigate, params } = useAppNavigation();
  const { profile } = useAuth();
  // Ưu tiên điểm THẬT vừa nhận từ backend (RolePlayScreen truyền qua
  // navigate('result', { levelId, roleplayResult })); fallback về mock nếu
  // không có (vd. vào thẳng màn Kết quả để xem UI khi dev) — chỉ có mock cho
  // các level cố định trong Map, không có cho hồ sơ khách hàng thật.
  const result = params.roleplayResult ?? (levelId ? getRoleplayResultByLevelId(levelId) : undefined);
  const retryParams = levelId ? { levelId } : practiceCustomerId ? { practiceCustomerId } : { generatedCustomer };
  const bottomNavActive = levelId ? 'map' : 'practice';

  if (!result || !profile) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.retryText}>Chưa có dữ liệu kết quả cho level này.</Text>
          <Pressable onPress={() => navigate('home')} style={styles.retryButton}>
            <Text style={styles.retryText}>Về Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ResultHeader
        title="Kết quả luyện tập"
        subtitle="Bạn đã hoàn thành role-play!"
        streakDays={profile.currentStreak}
        hasUnreadNotification={profile.hasUnreadNotification}
        onBack={() => navigate('home')}
      />

      <View style={styles.historyWrap}>
        <ConversationHistorySection transcript={result.transcript ?? []} sellerAvatarKey={profile.avatarKey} />
      </View>

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
          ratingLabel={result.ratingLabel}
          summary={result.summary}
        />

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
          <ResultCriterionRow
            icon="star"
            label="Tổng điểm"
            score={result.totalScore}
            maxScore={result.maxTotalScore}
            feedback={result.summary}
            ratingLabel={result.ratingLabel}
            isTotal
          />
        </View>

        <ResultInsightCard summary={result.insightSummary} tips={result.insightTips} />

        <View style={styles.actionsRow}>
          <Pressable style={styles.retryButton} onPress={() => navigate('roleplay', retryParams)}>
            <Ionicons name="refresh" size={16} color={colors.primary} />
            <Text style={styles.retryText}>Luyện lại</Text>
          </Pressable>
          <Pressable style={styles.continueWrap} onPress={() => navigate('home')}>
            <LinearGradient
              colors={primaryGradient.colors}
              start={primaryGradient.start}
              end={primaryGradient.end}
              style={styles.continueButton}
            >
              <Text style={styles.continueText}>Tiếp tục học</Text>
              <Ionicons name="arrow-forward" size={17} color={colors.white} />
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>

      <BottomNavBar
        active={bottomNavActive}
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
  historyWrap: { backgroundColor: colors.background, paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  scroll: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, padding: spacing.xl },
  unlockBanner: { backgroundColor: colors.successLight, borderRadius: radii.lg, padding: spacing.md },
  unlockBannerText: { fontFamily: fontFamily.extraBold, fontSize: 13, color: colors.success, textAlign: 'center' },
  sectionTitle: { fontFamily: fontFamily.extraBold, fontSize: 16, color: colors.textPrimary, marginBottom: -spacing.sm },
  criteriaList: { gap: spacing.sm },
  actionsRow: { flexDirection: 'row', gap: spacing.sm },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  retryText: { fontFamily: fontFamily.extraBold, fontSize: 14, color: colors.primary },
  continueWrap: { flex: 1 },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
  },
  continueText: { fontFamily: fontFamily.extraBold, fontSize: 14, color: colors.white },
});
