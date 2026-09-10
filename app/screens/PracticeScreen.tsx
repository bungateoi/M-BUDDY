import { useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {
  PracticeHeader,
  PracticeCreateBanner,
  PracticeSearchBar,
  PracticeCustomerRow,
  PracticeCustomerDetail,
  BottomNavBar,
  colors,
  fontFamily,
  radii,
  spacing,
} from '../components';
import { customerProfiles, searchCustomerProfiles } from '../data';
import { useAuth } from '../lib/AuthContext';
import { useAppNavigation } from '../navigation/NavigationContext';

const mascotSource = require('../assets/mascot-confident.png');

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
    <SafeAreaView style={styles.safe}>
      <PracticeHeader streakDays={profile.currentStreak} />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <PracticeCreateBanner onPress={() => navigate('createCustomer')} />
            <PracticeSearchBar value={query} onChangeText={setQuery} />
          </View>
        }
        renderItem={({ item }) => (
          <PracticeCustomerRow
            customer={item}
            onPress={() => setSelectedCustomerId(item.id)}
            onPressPractice={() => startPractice(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>Không tìm thấy khách hàng phù hợp.</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.tipCard}>
            <Image source={mascotSource} style={styles.tipMascot} resizeMode="contain" />
            <View style={styles.tipTextCol}>
              <Text style={styles.tipTitle}>🎯 Gợi ý luyện tập mỗi ngày</Text>
              <Text style={styles.tipText}>Chọn 1 khách hàng để luyện tập role-play và nâng cao kỹ năng tư vấn!</Text>
            </View>
          </View>
        }
      />

      <BottomNavBar
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
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  listContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  listHeader: { gap: spacing.md, marginBottom: spacing.md },
  emptyList: { paddingVertical: spacing.xxl, alignItems: 'center' },
  emptyText: { fontFamily: fontFamily.semiBold, fontSize: 13, color: colors.textMuted },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  tipMascot: { width: 40, height: 48 },
  tipTextCol: { flex: 1, gap: 2 },
  tipTitle: { fontFamily: fontFamily.extraBold, fontSize: 12.5, color: colors.primary },
  tipText: { fontFamily: fontFamily.semiBold, fontSize: 11, color: colors.textMuted, lineHeight: 15 },
});
