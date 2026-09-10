import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { LeaderboardHeader, BadgeTierCard, LeaderboardSection, BottomNavBar, colors, spacing } from '../components';
import { fetchLeaderboard } from '../lib/authData';
import { useAuth } from '../lib/AuthContext';
import type { LeaderboardEntry } from '../data/types';
import { useAppNavigation } from '../navigation/NavigationContext';

export function LeaderboardScreen() {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    fetchLeaderboard(20)
      .then(setEntries)
      .catch(() => setEntries([]));
  }, []);

  if (!profile) return null;

  const topFour = entries?.slice(0, 4) ?? [];
  const droppedRank = entries?.slice(10, 13) ?? [];

  return (
    <SafeAreaView style={styles.safe}>
      <LeaderboardHeader streakDays={profile.currentStreak} hasUnreadNotification={profile.hasUnreadNotification} />

      {!entries ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <BadgeTierCard xp={profile.xp} />

          <LeaderboardSection
            icon="🥇"
            title="Top 10 học viên"
            entries={topFour}
            highlightFirst
            onPressSeeAll={() => navigate('leaderboardFull')}
          />

          {droppedRank.length > 0 && (
            <LeaderboardSection
              icon="📉"
              title="Nhóm rớt hạng"
              entries={droppedRank}
              showDropIndicator
              footerNote="Cố lên! Bạn có thể quay lại top 10! 💪"
              onPressSeeAll={() => navigate('leaderboardFull')}
            />
          )}
        </ScrollView>
      )}

      <BottomNavBar
        active="xephang"
        onPressItem={(key) => {
          if (key === 'home') navigate('home');
          if (key === 'map') navigate('map');
          if (key === 'practice') navigate('practice');
          if (key === 'ontap') navigate('practiceHistory');
          if (key === 'toi') navigate('profile');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.md, paddingBottom: spacing.xxl },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
