import { useMemo, useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {
  PracticeHistoryHeader,
  PracticeSearchBar,
  PracticeHistoryCard,
  HomeBottomNavBar,
  colors2,
  fontFamily2,
  radii2,
  spacing2,
} from '../components';
import type { PracticeHistoryEntry } from '../data/types';
import { fetchPracticeHistory } from '../lib/authData';
import { useAppNavigation } from '../navigation/NavigationContext';

// Màn "Ôn tập" (node-id=101-1661, "Lịch sử luyện tập") — lịch sử MỌI buổi
// role-play đã hoàn thành ở Map + Practice (xem RolePlayScreen.tsx#buildHistoryEntry,
// không có buổi luyện với khách hàng tự tạo theo tiêu chí). Bấm vào 1 thẻ ->
// đi thẳng vào đúng dữ liệu RoleplayResult đã lưu, tái dùng NGUYÊN VẸN màn
// Kết quả (ResultScreen) làm màn "Lịch sử chi tiết".
export function PracticeHistoryScreen() {
  const { navigate } = useAppNavigation();
  const [history, setHistory] = useState<PracticeHistoryEntry[] | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchPracticeHistory()
      .then(setHistory)
      .catch(() => setHistory([]));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history ?? [];
    return (history ?? []).filter(
      (item) => item.titleLine.toLowerCase().includes(q) || item.subtitleLine.toLowerCase().includes(q)
    );
  }, [history, query]);

  const handlePressEntry = (entry: PracticeHistoryEntry) => {
    navigate('result', {
      levelId: entry.levelId,
      practiceCustomerId: entry.practiceCustomerId,
      roleplayResult: entry.result,
    });
  };

  return (
    <View style={styles.root}>
      {/* SafeAreaView riêng chỉ bọc phần cam đầu màn — tự nhận inset TRÊN
          (notch/status bar). Tách khỏi SafeAreaView phía dưới (bọc thanh
          menu) để mỗi phần tự lấy đúng màu nền theo inset của MÌNH — xem
          PracticeScreen.tsx/LeaderboardScreen.tsx cho cùng pattern. */}
      <SafeAreaView style={styles.topSafe}>
        <PracticeHistoryHeader />
      </SafeAreaView>

      {/* Khối đen bo tròn 2 góc trên, phủ hết phần còn lại của màn — đúng
          pattern "card nổi trên nền cam" đã dùng ở Luyện tập/Xếp hạng. */}
      <View style={styles.box}>
        {/* Ô tìm kiếm đứng NGOÀI FlatList — cố định, không cuộn theo — chỉ
            phần danh sách lịch sử bên dưới mới cuộn (giống PracticeScreen). */}
        <View style={styles.fixedHeader}>
          <PracticeSearchBar value={query} onChangeText={setQuery} placeholder="Tìm theo tên bài luyện tập" />
        </View>

        {!history ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator color={colors2.white} />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.centerWrap}>
            <Text style={styles.emptyText}>
              {history.length === 0
                ? 'Chưa có lịch sử luyện tập nào — vào Bản đồ hoặc Luyện tập để bắt đầu nhé!'
                : 'Không tìm thấy bài nào khớp từ khoá.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <PracticeHistoryCard entry={item} onPress={() => handlePressEntry(item)} />
            )}
            ItemSeparatorComponent={() => <View style={{ height: spacing2.md }} />}
          />
        )}
      </View>

      {/* SafeAreaView riêng cho thanh menu — chạm mép dưới cùng nên tự nhận
          inset DƯỚI (home indicator), tô đen trùng màu "Box" thay vì màu cam
          của phần trên. */}
      <SafeAreaView style={styles.bottomSafe}>
        <HomeBottomNavBar
          active="ontap"
          onPressItem={(key) => {
            if (key === 'home') navigate('home');
            if (key === 'map') navigate('map');
            if (key === 'practice') navigate('practice');
            if (key === 'xephang') navigate('leaderboard');
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
  box: {
    flex: 1,
    marginTop: spacing2.md,
    backgroundColor: colors2.black,
    borderTopLeftRadius: radii2.navTop,
    borderTopRightRadius: radii2.navTop,
  },
  fixedHeader: { paddingHorizontal: spacing2.md, paddingTop: spacing2.lg, paddingBottom: spacing2.md },
  list: { flex: 1 },
  listContent: { paddingHorizontal: spacing2.md, paddingBottom: spacing2.md },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing2.lg },
  emptyText: { fontFamily: fontFamily2.semiBold, fontSize: 13.5, color: colors2.whiteMuted, textAlign: 'center' },
});
