import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontFamily, primaryGradient, radii, spacing } from '../components';
import { useAppNavigation } from '../navigation/NavigationContext';

const mascotSource = require('../assets/mascot-confident.png');

// Màn xác nhận trước khi vào bài kiểm tra "Học vượt" (ui-draft/man-hocvuot.png)
// — mở từ nút "Học vượt" ở Map. "Bắt đầu" vào THẲNG role-play của level mục
// tiêu (KHÔNG qua Ôn tập nhanh — đây là 1 bài kiểm tra để test-out, khác với
// luồng học bình thường); "Để sau" quay lại Map, không mất gì.
export function SkipAheadIntroScreen({ levelId }: { levelId?: string }) {
  const { navigate } = useAppNavigation();

  if (!levelId) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Chưa có dữ liệu học vượt.</Text>
          <Pressable onPress={() => navigate('map')} style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Về Map</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Image source={mascotSource} style={styles.mascot} resizeMode="contain" />
        <Text style={styles.title}>
          Hãy vượt qua bài kiểm tra{'\n'}để nhảy tới chặng này nhé!
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => navigate('roleplay', { levelId, isSkipAhead: true })}>
          <LinearGradient
            colors={primaryGradient.colors}
            start={primaryGradient.start}
            end={primaryGradient.end}
            style={styles.startButton}
          >
            <Text style={styles.startButtonText}>Bắt đầu</Text>
          </LinearGradient>
        </Pressable>
        <Pressable onPress={() => navigate('map')} style={styles.laterButton}>
          <Text style={styles.laterButtonText}>Để sau</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xl, paddingHorizontal: spacing.xxl },
  mascot: { width: 160, height: 160 },
  title: { fontFamily: fontFamily.extraBold, fontSize: 17, color: colors.textPrimary, textAlign: 'center', lineHeight: 24 },
  actions: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.md },
  startButton: { borderRadius: radii.pill, paddingVertical: spacing.md, alignItems: 'center' },
  startButtonText: { fontFamily: fontFamily.extraBold, fontSize: 15, color: colors.white },
  laterButton: { alignItems: 'center', paddingVertical: spacing.xs },
  laterButtonText: { fontFamily: fontFamily.extraBold, fontSize: 13.5, color: colors.primary },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, padding: spacing.xl },
  emptyText: { fontFamily: fontFamily.semiBold, fontSize: 14, color: colors.textMuted },
  emptyButton: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  emptyButtonText: { fontFamily: fontFamily.extraBold, fontSize: 13, color: colors.primary },
});
