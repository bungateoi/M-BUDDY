import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavBar, PracticeHistoryCard, cardShadow, colors, fontFamily, radii, spacing } from '../components';
import type { PracticeHistoryEntry } from '../data/types';
import { fetchPracticeHistory } from '../lib/authData';
import { useAppNavigation } from '../navigation/NavigationContext';

// Màn "Ôn tập" (ui-draft/man-lichsuluyentap.png) — lịch sử MỌI buổi role-play
// đã hoàn thành ở Map + Practice (xem RolePlayScreen.tsx#buildHistoryEntry,
// không có buổi luyện với khách hàng tự tạo theo tiêu chí). Bấm vào 1 thẻ ->
// đi thẳng vào đúng dữ liệu RoleplayResult đã lưu, tái dùng NGUYÊN VẸN màn
// Kết quả (ResultScreen) làm màn "Lịch sử chi tiết"
// (ui-draft/man-lichsuluyentap-chitiet.png.png).
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
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigate('home')} hitSlop={8} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Lịch sử luyện tập</Text>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={17} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm theo tên bài..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      {!history ? (
        <View style={styles.centerWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centerWrap}>
          <Text style={styles.emptyText}>
            {history.length === 0
              ? 'Chưa có lịch sử luyện tập nào — vào Map hoặc Practice để bắt đầu nhé!'
              : 'Không tìm thấy bài nào khớp từ khoá.'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {filtered.map((entry) => (
            <PracticeHistoryCard key={entry.id} entry={entry} onPress={() => handlePressEntry(entry)} />
          ))}
        </ScrollView>
      )}

      <BottomNavBar
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
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  headerTitle: { fontFamily: fontFamily.black, fontSize: 22, color: colors.textPrimary },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    ...cardShadow,
  },
  searchInput: { flex: 1, fontFamily: fontFamily.semiBold, fontSize: 13, color: colors.textPrimary, padding: 0 },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  emptyText: { fontFamily: fontFamily.semiBold, fontSize: 13.5, color: colors.textMuted, textAlign: 'center' },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: spacing.md },
});
