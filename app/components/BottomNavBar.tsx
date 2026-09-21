import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NavIcon, type NavIconName } from './icons2';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

const VISIBLE_ITEMS: { key: 'home' | 'map' | 'practice' | 'xephang' | 'ontap'; label: string; icon: NavIconName }[] = [
  { key: 'home', label: 'Trang chủ', icon: 'home' },
  { key: 'map', label: 'Bản đồ', icon: 'map' },
  { key: 'practice', label: 'Luyện tập', icon: 'practice' },
  { key: 'xephang', label: 'Xếp hạng', icon: 'leaderboard' },
  { key: 'ontap', label: 'Ôn tập', icon: 'review' },
];

// "Tôi" KHÔNG hiện trên thanh menu (đúng Figma — chỉ 5 mục): màn Tôi giờ
// vào bằng cách bấm avatar ở HomeHeader, không qua thanh menu dưới nữa.
// Vẫn giữ "toi" trong type BottomNavKey vì rất nhiều màn khác (Profile,
// Admin, TeamManagement, ContentManagement, PersonaEdit, ProductEdit...)
// đang dùng active="toi" hoặc onPressItem kiểm tra key==='toi' để điều
// hướng sang Profile — xoá khỏi type sẽ làm vỡ toàn bộ các màn đó.
export type BottomNavKey = (typeof VISIBLE_ITEMS)[number]['key'] | 'toi';

export function BottomNavBar({
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
          const color = isActive ? colors2.white : colors2.whiteMuted;
          return (
            <Pressable key={item.key} style={styles.item} onPress={() => onPressItem?.(item.key)}>
              <NavIcon name={item.icon} size={24} color={color} />
              <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors2.blueDark,
    borderTopWidth: 2,
    borderTopColor: colors2.navBorder,
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
  label: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.whiteMuted, textAlign: 'center' },
  labelActive: { color: colors2.white },
});
