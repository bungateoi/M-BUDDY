import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  PersonalAnalysisHeader,
  Card,
  SkillRadarChart,
  KnowledgeTopicRow,
  PracticeRecommendationRow,
  BuddySuggestionBubble,
  BottomNavBar,
  colors,
  fontFamily,
  spacing,
} from '../components';
import { buildSkillInsightSummary, buildPracticeRecommendations, buildKnowledgeTopics } from '../data';
import type { PracticeHistoryEntry } from '../data/types';
import { fetchMyLevelProgress, fetchPracticeHistory } from '../lib/authData';
import { useAuth } from '../lib/AuthContext';
import { useAppNavigation } from '../navigation/NavigationContext';

export function PersonalAnalysisScreen() {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  const [levelProgress, setLevelProgress] = useState<Record<string, number> | null>(null);
  // Mặc định [] -> buildKnowledgeTopics tự trả về 0% cho mọi sản phẩm, đúng
  // hành vi mong muốn lúc chưa tải xong/chưa học gì — không cần loading
  // state riêng cho phần "Kiến thức theo chủ đề".
  const [practiceHistory, setPracticeHistory] = useState<PracticeHistoryEntry[]>([]);

  useEffect(() => {
    fetchMyLevelProgress()
      .then(setLevelProgress)
      .catch(() => setLevelProgress({}));
    fetchPracticeHistory()
      .then(setPracticeHistory)
      .catch(() => setPracticeHistory([]));
  }, []);

  const knowledgeTopics = useMemo(() => buildKnowledgeTopics(practiceHistory), [practiceHistory]);

  if (!profile) return null;
  const user = profile;
  const buddyName = user.fullName.trim().split(/\s+/).pop() ?? user.fullName;
  const weakestSkill = [...user.skills].sort((a, b) => a.value - b.value)[0];
  const practiceRecommendations = buildPracticeRecommendations(levelProgress ?? {});

  return (
    <SafeAreaView style={styles.safe}>
      <PersonalAnalysisHeader streakDays={user.currentStreak} onBack={() => navigate('home')} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.radarCard}>
          <Text style={styles.radarTitle}>Năng lực hiện tại</Text>
          <View style={styles.radarBody}>
            <SkillRadarChart skills={user.skills} centerLabel={{ value: user.overallSkillScore, caption: 'Tổng điểm' }} />
          </View>

          <View style={styles.insightBox}>
            <Text style={styles.insightText}>{buildSkillInsightSummary(user.skills)}</Text>
          </View>
        </Card>

        <Card style={styles.topicsCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📚</Text>
            <Text style={styles.sectionTitle}>Kiến thức theo chủ đề</Text>
          </View>
          <View style={styles.topicsList}>
            {knowledgeTopics.map((topic) => (
              <KnowledgeTopicRow key={topic.id} icon={topic.icon} label={topic.label} value={topic.value} />
            ))}
          </View>
        </Card>

        <View style={styles.recommendCard}>
          <BuddySuggestionBubble
            message={`${buddyName} ơi, cùng cải thiện kỹ năng ${weakestSkill.label} để tăng tỷ lệ chốt sale nhé!`}
          />

          <View style={styles.recommendList}>
            {practiceRecommendations.length === 0 ? (
              <Text style={styles.recommendEmptyText}>
                {levelProgress === null
                  ? 'Đang tải gợi ý...'
                  : 'Hãy bắt đầu khám phá Map để M-Buddy hiểu bạn hơn và đưa ra gợi ý phù hợp nhé!'}
              </Text>
            ) : (
              practiceRecommendations.map((item) => (
                <PracticeRecommendationRow
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                  onPressRetry={() => navigate('quiz', { levelId: item.levelId })}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <BottomNavBar
        active="home"
        onPressItem={(key) => {
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
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.xxl, gap: spacing.md },

  radarCard: { alignItems: 'stretch', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  radarTitle: { fontFamily: fontFamily.extraBold, fontSize: 14.5, color: colors.textPrimary, textAlign: 'center' },
  radarBody: { alignItems: 'center' },
  insightBox: { backgroundColor: colors.primaryLight, borderRadius: 16, padding: spacing.md, marginTop: spacing.xs },
  insightText: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.textPrimary, lineHeight: 19 },

  topicsCard: { gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionIcon: { fontSize: 16 },
  sectionTitle: { fontFamily: fontFamily.extraBold, fontSize: 14.5, color: colors.textPrimary },
  topicsList: { gap: spacing.md },

  recommendCard: { backgroundColor: colors.primaryLight, borderRadius: 20, padding: spacing.md, gap: spacing.md },
  recommendList: { gap: spacing.sm },
  recommendEmptyText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12.5,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
