import { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {
  PracticeHeader,
  PracticeCreateBanner,
  PracticeSearchBar,
  PracticeCustomerRow,
  PracticeCustomerDetail,
  HomeBottomNavBar,
  colors2,
  fontFamily2,
  radii2,
  spacing2,
} from '../components';
import { customerProfiles, searchCustomerProfiles } from '../data';
import { useAuth } from '../lib/AuthContext';
import { useAppNavigation } from '../navigation/NavigationContext';

export function PracticeScreen() {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const results = searchCustomerProfiles(query);
  const selectedCustomer = selectedCustomerId
    ? customerProfiles.find((c) => c.id === selectedCustomerId)
    : undefined;

  const startPractice = (customerId: string) => {
    navigate('roleplay', { practiceCustomerId: customerId });
  };

  if (selectedCustomer) {
    return (
      <PracticeCustomerDetail
        customer={selectedCustomer}
        onBack={() => setSelectedCustomerId(null)}
        onPressPractice={() => startPractice(selectedCustomer.id)}
      />
    );
  }

  if (!profile) return null;

  return (
    <View style={styles.root}>
      {/* SafeAreaView riêng chỉ bọc phần cam đầu màn — tự nhận inset TRÊN
          (notch/status bar) vì đây là view chạm mép trên cùng. Tách khỏi
          SafeAreaView phía dưới (bọc thanh menu) để mỗi phần tự lấy đúng màu
          nền theo inset của MÌNH, tránh dải cam bị lộ ở lề dưới cùng — nơi
          đáng lẽ phải là màu đen trùng với "Box" danh sách bên dưới. */}
      <SafeAreaView style={styles.topSafe}>
        <PracticeHeader />
        <PracticeCreateBanner onPress={() => navigate('createCustomer')} />
      </SafeAreaView>

      {/* Khối đen bo tròn 2 góc trên, phủ hết phần còn lại của màn — che đúng
          phần dưới của mascot tràn ra từ PracticeCreateBanner (xem giải
          thích ở component đó), khớp Figma (node-id=67-883, "Box"). */}
      <View style={styles.box}>
        {/* Tiêu đề + ô tìm kiếm đứng NGOÀI FlatList — cố định, không cuộn
            theo — chỉ phần danh sách khách hàng bên dưới mới cuộn. */}
        <View style={styles.fixedHeader}>
          <Text style={styles.listTitle}>Danh sách khách hàng</Text>
          <PracticeSearchBar value={query} onChangeText={setQuery} />
        </View>
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PracticeCustomerRow
              customer={item}
              onPress={() => setSelectedCustomerId(item.id)}
              onPressPractice={() => startPractice(item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: spacing2.md }} />}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>Không tìm thấy khách hàng phù hợp.</Text>
            </View>
          }
        />
      </View>

      {/* SafeAreaView riêng cho thanh menu — chạm mép dưới cùng nên tự nhận
          inset DƯỚI (home indicator), tô đen trùng màu "Box" thay vì màu cam
          của phần trên. */}
      <SafeAreaView style={styles.bottomSafe}>
        <HomeBottomNavBar
          active="practice"
          onPressItem={(key) => {
            if (key === 'home') navigate('home');
            if (key === 'map') navigate('map');
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
  // Nền cam ở đây (không phải đen) để lộ đúng 2 góc bo tròn của "box" đen
  // bên dưới — box chỉ đen bên trong phần thân nó, phần bị "cắt góc" bo
  // tròn phải thấy được nền cam phía sau mới ra hiệu ứng bo góc (nếu root
  // cũng đen thì góc bo tròn bị "biến mất" vì trùng màu). Dải cam ở lề dưới
  // cùng vẫn được che đúng bởi bottomSafe (đen, xem bên dưới).
  root: { flex: 1, backgroundColor: colors2.orange },
  topSafe: { backgroundColor: colors2.orange },
  bottomSafe: { backgroundColor: colors2.black },
  box: {
    flex: 1,
    // Khoảng hở nhỏ với banner phía trên (thay vì dính sát nút "Luyện tập")
    // — che vẫn đủ phần mascot tràn ra, chỉ lộ thêm chút phần chân mascot.
    marginTop: spacing2.md,
    backgroundColor: colors2.black,
    borderTopLeftRadius: radii2.navTop,
    borderTopRightRadius: radii2.navTop,
  },
  fixedHeader: {
    gap: spacing2.md,
    paddingHorizontal: spacing2.md,
    paddingTop: spacing2.lg,
    paddingBottom: spacing2.md,
  },
  list: { flex: 1 },
  listContent: { paddingHorizontal: spacing2.md, paddingBottom: spacing2.md },
  listTitle: { fontFamily: fontFamily2.semiBold, fontSize: 16, lineHeight: 24, color: colors2.white },
  emptyList: { paddingVertical: spacing2.lg, alignItems: 'center' },
  emptyText: { fontFamily: fontFamily2.semiBold, fontSize: 13, color: colors2.whiteMuted },
});
