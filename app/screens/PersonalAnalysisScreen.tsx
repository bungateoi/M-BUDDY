import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PersonalTeamTabs, SkillHexCard, colors2, fontFamily2, radii2, spacing2 } from '../components';
import { buildSkillInsightSummary, buildPracticeRecommendations, buildKnowledgeTopics } from '../data';
import type { PracticeHistoryEntry } from '../data/types';
import { fetchMyLevelProgress, fetchPracticeHistory } from '../lib/authData';
import { useAuth } from '../lib/AuthContext';
import { useAppNavigation } from '../navigation/NavigationContext';

const insightBg = require('../assets/decor/insight-flag-bg.png');

// Redesign theo Figma node-id=160-16508 ("Kiến thức và Kỹ năng" > Cá nhân) —
// khác bản cũ (header có mascot/streak riêng, card "Kiến thức theo chủ đề"
// dùng icon tròn, card gợi ý luyện tập kèm BuddySuggestionBubble): giờ dùng
// đúng bố cục Figma — top bar đơn giản (back + tiêu đề), tab Cá nhân/Đội
// nhóm (CHỈ role='manager'), radar hex tối giống Home, khối nhận xét nền cờ
// đua, "Chủ đề cần cải thiện" (level đã học nhưng điểm thấp, kèm nút Luyện
// lại) và "Tất cả các chủ đề" (progress bar mọi sản phẩm).
export function PersonalAnalysisScreen() {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  const [levelProgress, setLevelProgress] = useState<Record<string, number> | null>(null);
  // Mặc định [] -> buildKnowledgeTopics tự trả về 0% cho mọi sản phẩm, đúng
  // hành vi mong muốn lúc chưa tải xong/chưa học gì.
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
  const isManager = user.role === 'manager';
  const practiceRecommendations = buildPracticeRecommendations(levelProgress ?? {});

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigate('home')} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors2.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Kiến thức & Kỹ năng</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isManager && (
          <PersonalTeamTabs active="personal" onSelectPersonal={() => {}} onSelectTeam={() => navigate('teamAnalysis')} />
        )}

        <SkillHexCard skills={user.skills} />

        <View style={styles.insightCard}>
          <Image source={insightBg} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={styles.insightOverlay} />
          <Text style={styles.insightText}>{buildSkillInsightSummary(user.skills)}</Text>
        </View>

        {practiceRecommendations.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Chủ đề cần cải thiện</Text>
            <View style={styles.improveList}>
              {practiceRecommendations.map((item) => (
                <View key={item.id} style={styles.improveRow}>
                  <View style={styles.improveInfo}>
                    <Text style={styles.improveTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.improveSubtitle}>{item.subtitle}</Text>
                  </View>
                  <Pressable
                    style={styles.retryBtn}
                    onPress={() => navigate('quiz', { levelId: item.levelId, backTo: 'personalAnalysis' })}
                  >
                    <Text style={styles.retryText}>Luyện lại</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tất cả các chủ đề</Text>
          <View style={styles.topicList}>
            {knowledgeTopics.map((topic) => (
              <View key={topic.id} style={styles.topicRow}>
                <View style={styles.topicHeaderRow}>
                  <Text style={styles.topicLabel} numberOfLines={1}>
                    {topic.label}
                  </Text>
                  <Text style={styles.topicValue}>{topic.value}%</Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, topic.value))}%` }]} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.homeIndicatorArea}>
        <View style={styles.homeIndicator} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors2.black },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing2.md, padding: spacing2.md },
  headerTitle: { flex: 1, textAlign: 'center', fontFamily: fontFamily2.semiBold, fontSize: 24, color: colors2.white },
  headerSpacer: { width: 24 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing2.md, paddingBottom: spacing2.xl, gap: spacing2.md },

  insightCard: {
    borderWidth: 1,
    borderColor: colors2.white,
    borderRadius: radii2.card,
    padding: spacing2.md,
    overflow: 'hidden',
    shadowColor: colors2.white,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  insightOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(34,34,34,0.8)' },
  insightText: { fontFamily: fontFamily2.regular, fontSize: 14, lineHeight: 20, color: colors2.white },

  card: { backgroundColor: colors2.cardOptionIdle, borderRadius: radii2.card, padding: spacing2.md, gap: spacing2.md },
  cardTitle: { fontFamily: fontFamily2.semiBold, fontSize: 16, lineHeight: 24, color: colors2.white },

  improveList: { gap: spacing2.md },
  improveRow: { flexDirection: 'row', alignItems: 'center', gap: spacing2.md },
  improveInfo: { flex: 1, gap: 2 },
  improveTitle: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
  improveSubtitle: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.whiteMuted },
  retryBtn: {
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
  retryText: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.black },

  topicList: { gap: spacing2.sm },
  topicRow: { gap: spacing2.xs },
  topicHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing2.xs },
  topicLabel: { flex: 1, fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
  topicValue: { fontFamily: fontFamily2.displaySpeed, fontSize: 14, color: colors2.white },
  track: { height: 8, borderRadius: 99, backgroundColor: colors2.black, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99, backgroundColor: colors2.orange },

  homeIndicatorArea: { height: 34, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8 },
  homeIndicator: { width: 134, height: 5, borderRadius: 100, backgroundColor: colors2.white },
});
