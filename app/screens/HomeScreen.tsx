import { useState } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import {
  HomeHeader,
  StreakCard,
  SkillRadarCard,
  DailyChallengeCard,
  HomeBottomNavBar,
  colors2,
  spacing2,
} from '../components';
import { getRoleplayAvatarSource, mockDailyChallenge } from '../data';
import { useAuth } from '../lib/AuthContext';
import { useAppNavigation } from '../navigation/NavigationContext';

const raceBg = require('../assets/v2/home2/race-bg.png');
// Ảnh gốc (node-id=58:317) xuất @2x đúng khổ frame Figma 390x844 -> tỉ lệ
// thật 780/1688. Khoá đúng tỉ lệ này (thay vì "cover" cho cả flex:1 cao bao
// nhiêu cũng được) để mascot LUÔN nằm đúng vị trí — ngay sau khối "0 XP/
// Level 1", gọn phía trên card chuỗi ngày — bất kể máy nào cao/thấp khác
// 844px (trước đó "cover" kéo giãn theo chiều cao thật của mỗi máy làm
// mascot bị lệch/cắt sai chỗ).
const RACE_BG_ASPECT = 780 / 1688;

// `SafeAreaView` của react-native core CHỈ có tác dụng trên iOS — trên
// Android nó không chừa khoảng trống cho status bar (dự án chưa cài
// react-native-safe-area-context để lấy inset thật), còn trên web thì không
// có notch/status bar giả lập nào cả. Vì mascot ở đây được ghim tuyệt đối từ
// y=0 vật lý của màn hình (đúng như Figma coi status bar là 1 phần của
// frame, cao 47px), thiếu khoảng chừa này sẽ đẩy toàn bộ header + card chuỗi
// ngày lên sát mép trên, che mất phần lớn mascot. Bù thủ công: Android lấy
// đúng chiều cao status bar thật của máy, web dùng lại đúng số 47 của Figma
// (không có chrome thật để đo), iOS giữ nguyên vì SafeAreaView đã tự lo đúng.
const TOP_INSET_FALLBACK =
  Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 24) : Platform.OS === 'web' ? 47 : 0;

export function HomeScreen() {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  // Đo width THẬT của khung chứa (không dùng useWindowDimensions — trên web,
  // WebPhoneFrame giới hạn width hiển thị ≤ webPhoneFrameMaxWidth, còn
  // useWindowDimensions trả về width cả cửa sổ trình duyệt, sai khổ). Từ đó
  // tính height bằng đúng tỉ lệ ảnh gốc (px cụ thể, không dùng CSS
  // "aspectRatio" trên absolute view — tránh rủi ro sai khác giữa các nền
  // tảng) để mascot luôn hiện đúng khổ, không bị kéo/cắt lệch theo chiều cao
  // thật của từng máy.
  const [bgWidth, setBgWidth] = useState(0);
  const handleBgLayout = (e: LayoutChangeEvent) => setBgWidth(e.nativeEvent.layout.width);

  if (!profile) return null;
  const user = profile;

  return (
    <View style={styles.bg} onLayout={handleBgLayout}>
      {bgWidth > 0 && (
        <Image
          source={raceBg}
          style={[styles.bgImage, { width: bgWidth, height: bgWidth / RACE_BG_ASPECT }]}
          resizeMode="cover"
        />
      )}
      <SafeAreaView style={[styles.safe, { paddingTop: TOP_INSET_FALLBACK }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <HomeHeader
            name={user.fullName}
            avatarInitials={user.avatarInitials}
            avatarSource={getRoleplayAvatarSource(user.avatarKey as any)}
            streakDays={user.currentStreak}
            hasUnreadNotification={user.hasUnreadNotification}
            xp={user.xp}
            level={user.level}
            levelProgress={user.levelProgress}
            onPressAvatar={() => navigate('profile')}
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
        <HomeBottomNavBar
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
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors2.orange },
  bgImage: { position: 'absolute', top: 0, left: 0 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: spacing2.lg },
  body: { paddingHorizontal: spacing2.md, gap: spacing2.md },
});
