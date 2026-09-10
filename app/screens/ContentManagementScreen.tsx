import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavBar, QuizHeader, cardShadow, colors, fontFamily, radii, spacing } from '../components';
import { personas, products } from '../data';
import { useAuth } from '../lib/AuthContext';
import { useAppNavigation } from '../navigation/NavigationContext';

type Tab = 'products' | 'personas';

function productHiddenLabel(p: (typeof products)[number]): string {
  if (p.isHidden) return 'Ẩn tất cả';
  const n = p.hiddenChapterNumbers?.length ?? 0;
  if (n > 0) return `Ẩn ${n} chặng`;
  return 'Hiện';
}

export function ContentManagementScreen() {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>('products');
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...products]
      .sort((a, b) => a.order - b.order)
      .filter((p) => !q || p.name.toLowerCase().includes(q));
  }, [query]);

  const filteredPersonas = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...personas]
      .sort((a, b) => a.chapterNumber - b.chapterNumber)
      .filter((p) => !q || p.name.toLowerCase().includes(q));
  }, [query]);

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <QuizHeader
        title="Quản trị hành trình & tri thức"
        subtitle={`${products.length} sản phẩm · ${personas.length} chặng`}
        streakDays={profile.currentStreak}
        onBack={() => navigate('profile')}
      />

      <View style={styles.tabRow}>
        <Pressable style={[styles.tab, tab === 'products' && styles.tabActive]} onPress={() => setTab('products')}>
          <Text style={[styles.tabText, tab === 'products' && styles.tabTextActive]}>Sản phẩm</Text>
        </Pressable>
        <Pressable style={[styles.tab, tab === 'personas' && styles.tabActive]} onPress={() => setTab('personas')}>
          <Text style={[styles.tabText, tab === 'personas' && styles.tabTextActive]}>Chặng</Text>
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={17} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm theo tên..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable
          style={styles.addBtn}
          onPress={() => (tab === 'products' ? navigate('productEdit', {}) : navigate('personaEdit', {}))}
        >
          <Ionicons name="add-circle" size={18} color={colors.primary} />
          <Text style={styles.addBtnText}>{tab === 'products' ? 'Thêm sản phẩm mới' : 'Thêm chặng mới'}</Text>
        </Pressable>

        {tab === 'products'
          ? filteredProducts.map((p) => (
              <Pressable key={p.id} style={styles.row} onPress={() => navigate('productEdit', { productId: p.id })}>
                <View style={styles.rowText}>
                  <Text style={styles.rowName} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text
                    style={[styles.rowStatus, (p.isHidden || (p.hiddenChapterNumbers?.length ?? 0) > 0) && styles.rowStatusHidden]}
                    numberOfLines={1}
                  >
                    {productHiddenLabel(p)}
                  </Text>
                </View>
                <Ionicons name="create-outline" size={18} color={colors.textMuted} />
              </Pressable>
            ))
          : filteredPersonas.map((p) => (
              <Pressable key={p.id} style={styles.row} onPress={() => navigate('personaEdit', { personaId: p.id })}>
                <View style={styles.rowText}>
                  <Text style={styles.rowName} numberOfLines={1}>
                    Chặng {p.chapterNumber} — {p.name}
                  </Text>
                  <Text style={[styles.rowStatus, p.isHidden && styles.rowStatusHidden]} numberOfLines={1}>
                    {p.isHidden ? 'Ẩn' : 'Hiện'}
                  </Text>
                </View>
                <Ionicons name="create-outline" size={18} color={colors.textMuted} />
              </Pressable>
            ))}

        {(tab === 'products' ? filteredProducts : filteredPersonas).length === 0 && (
          <Text style={styles.emptyText}>Không tìm thấy kết quả phù hợp.</Text>
        )}
      </ScrollView>

      <BottomNavBar
        active="toi"
        onPressItem={(key) => {
          if (key === 'home') navigate('home');
          if (key === 'map') navigate('map');
          if (key === 'practice') navigate('practice');
          if (key === 'xephang') navigate('leaderboard');
          if (key === 'ontap') navigate('practiceHistory');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  tabRow: { flexDirection: 'row', gap: spacing.sm, marginHorizontal: spacing.xl, marginTop: spacing.sm },
  tab: { flex: 1, paddingVertical: 10, borderRadius: radii.pill, alignItems: 'center', backgroundColor: colors.white },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontFamily: fontFamily.extraBold, fontSize: 13, color: colors.textMuted },
  tabTextActive: { color: colors.white },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    ...cardShadow,
  },
  searchInput: { flex: 1, fontFamily: fontFamily.semiBold, fontSize: 13, color: colors.textPrimary, padding: 0 },
  content: { padding: spacing.xl, gap: spacing.sm, paddingBottom: spacing.xxl },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xs,
  },
  addBtnText: { fontFamily: fontFamily.extraBold, fontSize: 13.5, color: colors.primary },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...cardShadow,
  },
  rowText: { flex: 1, gap: 2 },
  rowName: { fontFamily: fontFamily.extraBold, fontSize: 14, color: colors.textPrimary },
  rowStatus: { fontFamily: fontFamily.semiBold, fontSize: 11.5, color: colors.success },
  rowStatusHidden: { color: colors.error },
  emptyText: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
