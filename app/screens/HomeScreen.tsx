import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import {
  HomeHeader,
  StreakCard,
  SkillRadarCard,
  DailyChallengeCard,
  BottomNavBar,
  colors,
  spacing,
} from '../components';
import { getRoleplayAvatarSource, mockDailyChallenge } from '../data';
import { useAuth } from '../lib/AuthContext';
import { useAppNavigation } from '../navigation/NavigationContext';

export function HomeScreen() {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  if (!profile) return null;
  const user = profile;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HomeHeader
          avatarInitials={user.avatarInitials}
          avatarSource={getRoleplayAvatarSource(user.avatarKey as any)}
          streakDays={user.currentStreak}
          hasUnreadNotification={user.hasUnreadNotification}
          xp={user.xp}
          level={user.level}
          levelProgress={user.levelProgress}
        />

        <View style={styles.body}>
          <StreakCard
            currentStreak={user.currentStreak}
            longestStreak={user.longestStreak}
            weekProgress={user.weekProgress}
          />

          <SkillRadarCard skills={user.skills} onPressDetail={() => navigate('personalAnalysis')} />

          <DailyChallengeCard
            title={mockDailyChallenge.title}
            isNew={mockDailyChallenge.isNew}
            description={mockDailyChallenge.description}
            rewardXp={mockDailyChallenge.rewardXp}
            onPress={() => navigate('map')}
          />
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
  content: { paddingBottom: spacing.xl },
  body: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
    gap: spacing.md,
  },
});
