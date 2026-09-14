import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StreakBadge } from './StreakBadge';
import { colors2, fontFamily2, spacing2 } from './theme';

const mascotSource = require('../assets/mascot.png');

// Header dùng chung cho các màn phụ/quản trị chưa có thiết kế Figma riêng
// (Tạo khách hàng, Bảng xếp hạng đầy đủ, Quản trị hệ thống, Quản trị hành
// trình & tri thức, Sửa sản phẩm/chặng) — chỉ đổi màu/font theo theme mới
// (colors2/fontFamily2), giữ nguyên bố cục cũ vì chưa có Figma cho các màn
// này.
export function QuizHeader({
  title,
  subtitle,
  streakDays,
  onBack,
}: {
  title: string;
  subtitle: string;
  streakDays: number;
  onBack?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} hitSlop={8} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={20} color={colors2.white} />
      </Pressable>
      <View style={styles.textCol}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.right}>
        <Image source={mascotSource} style={styles.mascot} resizeMode="contain" />
        <StreakBadge days={streakDays} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.xs,
    paddingHorizontal: spacing2.md,
    paddingTop: spacing2.xs,
    paddingBottom: spacing2.md,
    backgroundColor: colors2.black,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors2.cardOptionIdle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1, gap: 1 },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 16.5, color: colors2.white },
  subtitle: { fontFamily: fontFamily2.regular, fontSize: 11.5, color: colors2.whiteMuted },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mascot: { width: 32, height: 37 },
});
