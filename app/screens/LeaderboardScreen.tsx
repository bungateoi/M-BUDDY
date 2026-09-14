import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { LeaderboardHeader, BadgeTierCard, LeaderboardSection, HomeBottomNavBar, colors2, radii2, spacing2 } from '../components';
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
    // Nền cam ĐẶC (không còn gradient như bản cũ) — khớp Figma mới
    // (node-id=67-1049), giống hệt nền các màn Home/Map/Luyện tập khác.
    <View style={styles.root}>
      {/* SafeAreaView riêng chỉ bọc phần cam đầu màn — tự nhận inset TRÊN
          (notch/status bar). Tách khỏi SafeAreaView phía dưới (bọc thanh
          menu) để mỗi phần tự lấy đúng màu nền theo inset của MÌNH, tránh
          dải cam bị lộ ở lề dưới cùng — nơi đáng lẽ phải là màu đen trùng
          với "Box" danh sách bên dưới (xem PracticeScreen.tsx cho pattern
          gốc, đã áp dụng y hệt ở đây). */}
      <SafeAreaView style={styles.topSafe}>
        <LeaderboardHeader />
        <View style={styles.heroBody}>
          <BadgeTierCard xp={profile.xp} />
        </View>
      </SafeAreaView>

      {/* Khối đen bo tròn 2 góc trên, phủ hết phần còn lại của màn — đúng
          pattern "card nổi trên nền cam" đã dùng ở Home/Map/Luyện tập. */}
      <View style={styles.box}>
        {!entries ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={colors2.white} />
          </View>
        ) : (
          <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <LeaderboardSection
              title="Top 10 học viên"
              entries={topFour}
              onPressSeeAll={() => navigate('leaderboardFull')}
            />

            {droppedRank.length > 0 && (
              <LeaderboardSection
                title="Nhóm rớt hạng"
                entries={droppedRank}
                showDropIndicator
                footerNote="Cố lên! Bạn có thể quay lại top 10! 💪"
                onPressSeeAll={() => navigate('leaderboardFull')}
              />
            )}
          </ScrollView>
        )}
      </View>

      {/* SafeAreaView riêng cho thanh menu — chạm mép dưới cùng nên tự nhận
          inset DƯỚI (home indicator), tô đen trùng màu "Box" thay vì màu cam
          của phần trên. */}
      <SafeAreaView style={styles.bottomSafe}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  // Nền cam ở root (không phải đen) để lộ đúng 2 góc bo tròn của "box" đen
  // bên dưới — xem giải thích chi tiết ở PracticeScreen.tsx (cùng pattern).
  root: { flex: 1, backgroundColor: colors2.orange },
  topSafe: { backgroundColor: colors2.orange },
  bottomSafe: { backgroundColor: colors2.black },
  heroBody: { paddingHorizontal: spacing2.md, paddingBottom: spacing2.md },
  box: {
    flex: 1,
    backgroundColor: colors2.black,
    borderTopLeftRadius: radii2.navTop,
    borderTopRightRadius: radii2.navTop,
  },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  content: { padding: spacing2.md, gap: spacing2.lg },
});
