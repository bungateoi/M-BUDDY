import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily } from './theme';

const ITEMS = [
  { key: 'home', label: 'Home', icon: 'home-outline' },
  { key: 'map', label: 'Map', icon: 'map-outline' },
  { key: 'practice', label: 'Practice', icon: 'headset-outline' },
  { key: 'xephang', label: 'Xếp hạng', icon: 'trophy-outline' },
  { key: 'ontap', label: 'Ôn Tập', icon: 'book-outline' },
  { key: 'toi', label: 'Tôi', icon: 'person-outline' },
] as const;

export type BottomNavKey = (typeof ITEMS)[number]['key'];

export function BottomNavBar({
  active = 'home',
  onPressItem,
}: {
  active?: BottomNavKey;
  onPressItem?: (key: BottomNavKey) => void;
}) {
  return (
    <View style={styles.bar}>
      {ITEMS.map((item) => {
        const isActive = item.key === active;
        const iconName = isActive ? (item.icon.replace('-outline', '') as any) : item.icon;
        return (
          <Pressable key={item.key} style={styles.item} onPress={() => onPressItem?.(item.key)}>
            <Ionicons name={iconName} size={22} color={isActive ? colors.primary : colors.textMuted} />
            <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1E7E0',
  },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontFamily: fontFamily.semiBold, fontSize: 10, color: colors.textMuted },
  labelActive: { color: colors.primary, fontFamily: fontFamily.bold },
});
