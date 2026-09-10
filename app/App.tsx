import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import { webPhoneFrameMaxWidth } from './components/theme';
import { NavigationProvider, useAppNavigation } from './navigation/NavigationContext';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { HomeScreen } from './screens/HomeScreen';
import { MapScreen } from './screens/MapScreen';
import { QuizScreen } from './screens/QuizScreen';
import { RolePlayScreen } from './screens/RolePlayScreen';
import { ResultScreen } from './screens/ResultScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { CreateCustomerScreen } from './screens/CreateCustomerScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { LeaderboardFullScreen } from './screens/LeaderboardFullScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LoginScreen } from './screens/LoginScreen';
import { TeamManagementScreen } from './screens/TeamManagementScreen';
import { PersonalAnalysisScreen } from './screens/PersonalAnalysisScreen';
import { AdminScreen } from './screens/AdminScreen';
import { SkipAheadIntroScreen } from './screens/SkipAheadIntroScreen';
import { PracticeHistoryScreen } from './screens/PracticeHistoryScreen';
import { ContentManagementScreen } from './screens/ContentManagementScreen';
import { ProductEditScreen } from './screens/ProductEditScreen';
import { PersonaEditScreen } from './screens/PersonaEditScreen';
import { hydrateContentFromBackend } from './lib/contentData';

function RootNavigator() {
  const { screen, params } = useAppNavigation();

  switch (screen) {
    case 'map':
      return <MapScreen />;
    case 'practice':
      return <PracticeScreen />;
    case 'createCustomer':
      return <CreateCustomerScreen />;
    case 'leaderboard':
      return <LeaderboardScreen />;
    case 'leaderboardFull':
      return <LeaderboardFullScreen />;
    case 'profile':
      return <ProfileScreen />;
    case 'teamManagement':
      return <TeamManagementScreen />;
    case 'personalAnalysis':
      return <PersonalAnalysisScreen />;
    case 'admin':
      return <AdminScreen />;
    case 'skipAheadIntro':
      return <SkipAheadIntroScreen levelId={params.levelId} />;
    case 'practiceHistory':
      return <PracticeHistoryScreen />;
    case 'contentManagement':
      return <ContentManagementScreen />;
    case 'productEdit':
      return <ProductEditScreen productId={params.productId} />;
    case 'personaEdit':
      return <PersonaEditScreen personaId={params.personaId} />;
    case 'quiz':
      return <QuizScreen levelId={params.levelId ?? '2.3'} />;
    case 'roleplay':
      return (
        <RolePlayScreen
          levelId={params.levelId}
          practiceCustomerId={params.practiceCustomerId}
          generatedCustomer={params.generatedCustomer}
          isSkipAhead={params.isSkipAhead}
        />
      );
    case 'result':
      return (
        <ResultScreen
          levelId={params.levelId}
          practiceCustomerId={params.practiceCustomerId}
          generatedCustomer={params.generatedCustomer}
        />
      );
    case 'home':
    default:
      return <HomeScreen />;
  }
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFBF8', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color="#FF671F" />
    </View>
  );
}

// Có session nhưng KHÔNG tải được profiles row tương ứng — vd. bảng
// profiles/trigger chưa được tạo (migration SQL chưa chạy), hoặc lỗi mạng.
// Trước đây rơi vào trường hợp này thì màn hình trắng trơn (mọi screen đều
// `if (!profile) return null`) — giờ báo lỗi rõ + cho đăng xuất để thoát ra.
function ProfileLoadErrorScreen({ onSignOut }: { onSignOut: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFBF8', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: '#2D2D2D', textAlign: 'center' }}>Không tải được hồ sơ</Text>
      <Text style={{ fontSize: 13, color: '#8A8A8A', textAlign: 'center', lineHeight: 19 }}>
        Tài khoản đã đăng nhập nhưng chưa có dữ liệu hồ sơ tương ứng trong database — thường do database chưa được
        khởi tạo (chạy supabase/migrations/0001_init.sql) hoặc tài khoản được tạo trước khi khởi tạo database.
      </Text>
      <Pressable onPress={onSignOut} style={{ backgroundColor: '#FF671F', borderRadius: 999, paddingVertical: 12, paddingHorizontal: 24 }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Đăng xuất</Text>
      </Pressable>
    </View>
  );
}

// Trên web (desktop, cửa sổ trình duyệt rộng), app vốn thiết kế cho màn
// hình điện thoại nên bị kéo giãn ngang trông rất lạ mắt — bọc app trong 1
// khung dọc rộng tối đa webPhoneFrameMaxWidth (components/theme.ts, dùng
// chung với các Modal — xem SimpleSelectModal.tsx...), căn giữa, y hệt kiểu
// "phản chiếu điện thoại lên máy tính" (scrcpy/QuickTime). Không ảnh hưởng
// gì trên native (app thật) hay khi mở link ngay trên trình duyệt điện
// thoại thật (màn hình vốn đã hẹp hơn max-width nên khung này coi như không
// tồn tại).
function WebPhoneFrame({ children }: { children: ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;
  return (
    <View style={webFrameStyles.outer}>
      <View style={webFrameStyles.inner}>{children}</View>
    </View>
  );
}

const webFrameStyles = StyleSheet.create({
  outer: { flex: 1, alignItems: 'center', backgroundColor: '#1C1C1E' },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: webPhoneFrameMaxWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
});

// Cổng đăng nhập DUY NHẤT cho cả app — chưa có session -> luôn thấy
// LoginScreen (1 NavigationProvider riêng, tách biệt); có session -> vào
// thẳng luồng bình thường qua RootNavigator (NavigationProvider khác, luôn
// bắt đầu ở 'home'). Đăng nhập/đăng xuất thành công tự đổi session
// (AuthProvider), tự chuyển 2 nhánh này qua lại — không cần tự navigate().
function AuthGate() {
  const { session, profile, loading, signOut } = useAuth();
  // Nạp nội dung nghiệp vụ (sản phẩm/chặng/level/quiz) thật từ Supabase,
  // thay seed tĩnh trong app/data/*.ts — CHỈ sau khi có profile (RLS 4 bảng
  // này yêu cầu role 'authenticated'), 1 lần/lượt đăng nhập. Xem
  // app/lib/contentData.ts#hydrateContentFromBackend.
  const [contentHydrated, setContentHydrated] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setContentHydrated(false);
    hydrateContentFromBackend().finally(() => setContentHydrated(true));
  }, [profile?.userId]);

  if (loading) return <LoadingScreen />;

  if (!session) {
    return (
      <NavigationProvider>
        <LoginScreen />
      </NavigationProvider>
    );
  }

  if (!profile) {
    return <ProfileLoadErrorScreen onSignOut={signOut} />;
  }

  if (!contentHydrated) return <LoadingScreen />;

  return (
    <NavigationProvider>
      <RootNavigator />
    </NavigationProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#FFFBF8' }} />;
  }

  return (
    <WebPhoneFrame>
      <AuthProvider>
        <AuthGate />
        <StatusBar style="dark" />
      </AuthProvider>
    </WebPhoneFrame>
  );
}
