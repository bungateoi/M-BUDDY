import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { QuizHeader, Card, LeaderboardEntryRow, BottomNavBar, colors, spacing } from '../components';
import { fetchLeaderboard } from '../lib/authData';
import { useAuth } from '../lib/AuthContext';
import type { LeaderboardEntry } from '../data/types';
import { useAppNavigation } from '../navigation/NavigationContext';

export function LeaderboardFullScreen() {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    fetchLeaderboard(100)
      .then(setEntries)
      .catch(() => setEntries([]));
  }, []);

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <QuizHeader
        title="Bảng xếp hạng đầy đủ"
        subtitle={`${entries?.length ?? 0} học viên`}
        streakDays={profile.currentStreak}
        onBack={() => navigate('leaderboard')}
      />

      {!entries ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            {entries.map((entry, index) => (
              <View key={entry.rank}>
                <LeaderboardEntryRow entry={entry} highlighted={entry.rank === 1} />
                {index < entries.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </Card>
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
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  card: { padding: spacing.md },
  divider: { height: 1, backgroundColor: '#F5EBE3', marginVertical: 2 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
