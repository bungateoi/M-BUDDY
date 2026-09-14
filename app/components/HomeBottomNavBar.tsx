import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NavIcon, type NavIconName } from './icons2';
import type { BottomNavKey } from './BottomNavBar';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

const VISIBLE_ITEMS: { key: BottomNavKey; label: string; icon: NavIconName }[] = [
  { key: 'home', label: 'Trang chủ', icon: 'home' },
  { key: 'map', label: 'Bản đồ', icon: 'map' },
  { key: 'practice', label: 'Luyện tập', icon: 'practice' },
  { key: 'xephang', label: 'Xếp hạng', icon: 'leaderboard' },
  { key: 'ontap', label: 'Ôn tập', icon: 'review' },
];

// Thanh menu nền trắng/icon cam (node-id=58:317 ở Home, dùng lại y hệt ở Map
// node-id=76:5842) — dùng cho các màn ĐÃ redesign theo giao diện mới. KHÔNG
// dùng chung với components/BottomNavBar.tsx (nền xanh đậm) vì component đó
// còn được các màn CHƯA redesign dùng nguyên trạng (Luyện tập, Xếp hạng,
// Profile, Quiz...) — chuyển màn nào sang thanh trắng này thì đổi luôn tên
// gọi ở màn đó, giữ nguyên tên component (dù còn ghi "Home" trong tên).
export function HomeBottomNavBar({
  active = 'home',
  onPressItem,
}: {
  active?: BottomNavKey;
  onPressItem?: (key: BottomNavKey) => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {VISIBLE_ITEMS.map((item) => {
          const isActive = item.key === active;
          const color = isActive ? colors2.orange : colors2.blackMuted;
          return (
            <Pressable key={item.key} style={styles.item} onPress={() => onPressItem?.(item.key)}>
              <NavIcon name={item.icon} size={24} color={color} />
              <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.homeIndicatorArea}>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors2.white,
    borderTopLeftRadius: radii2.navTop,
    borderTopRightRadius: radii2.navTop,
    overflow: 'hidden',
  },
  bar: {
    flexDirection: 'row',
    gap: spacing2.md,
    paddingTop: spacing2.xs,
    paddingHorizontal: spacing2.md,
  },
  item: { flex: 1, alignItems: 'center', gap: 5, paddingBottom: 4 },
  label: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.blackMuted, textAlign: 'center' },
  labelActive: { color: colors2.orange },
  homeIndicatorArea: { height: 34, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8 },
  homeIndicator: { width: 134, height: 5, borderRadius: 100, backgroundColor: colors2.cardOutline },
});
