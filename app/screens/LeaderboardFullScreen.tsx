import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { QuizHeader, LeaderboardEntryRow, HomeBottomNavBar, colors2, radii2, spacing2 } from '../components';
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
          <ActivityIndicator color={colors2.white} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            {entries.map((entry, index) => (
              <View key={entry.rank}>
                <LeaderboardEntryRow entry={entry} highlighted={entry.rank === 1} />
                {index < entries.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <HomeBottomNavBar
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
  safe: { flex: 1, backgroundColor: colors2.black },
  content: { padding: spacing2.md, paddingBottom: spacing2.xl },
  card: { backgroundColor: colors2.cardOptionIdle, borderRadius: radii2.card, padding: spacing2.md },
  divider: { height: 1, backgroundColor: colors2.black, marginVertical: 2 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
