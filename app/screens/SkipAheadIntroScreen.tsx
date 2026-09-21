import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, radii2, spacing2 } from '../components';
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
        <Pressable
          onPress={() => navigate('roleplay', { levelId, isSkipAhead: true, backTo: 'map' })}
          style={styles.startButton}
        >
          <Text style={styles.startButtonText}>Bắt đầu</Text>
        </Pressable>
        <Pressable onPress={() => navigate('map')} style={styles.laterButton}>
          <Text style={styles.laterButtonText}>Để sau</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors2.black },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing2.lg, paddingHorizontal: spacing2.xl },
  mascot: { width: 160, height: 160 },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 17, color: colors2.white, textAlign: 'center', lineHeight: 24 },
  actions: { paddingHorizontal: spacing2.md, paddingBottom: spacing2.xl, gap: spacing2.md },
  startButton: { borderRadius: radii2.pill, paddingVertical: spacing2.md, alignItems: 'center', backgroundColor: colors2.orange },
  startButtonText: { fontFamily: fontFamily2.semiBold, fontSize: 15, color: colors2.white },
  laterButton: { alignItems: 'center', paddingVertical: spacing2.xs },
  laterButtonText: { fontFamily: fontFamily2.semiBold, fontSize: 13.5, color: colors2.orange },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing2.lg, padding: spacing2.md },
  emptyText: { fontFamily: fontFamily2.semiBold, fontSize: 14, color: colors2.whiteMuted },
  emptyButton: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors2.orange,
    paddingHorizontal: spacing2.lg,
    paddingVertical: spacing2.xs,
  },
  emptyButtonText: { fontFamily: fontFamily2.semiBold, fontSize: 13, color: colors2.orange },
});
