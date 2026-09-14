import { StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, radii2 } from './theme';
import { StarFillIcon, AwardIcon } from './icons2';

function formatXp(xp: number) {
  return xp.toLocaleString('vi-VN');
}

// Thiết kế mới (Figma Homepage) chỉ hiện 2 pill XP/Level, không có thanh
// tiến độ — `levelProgress` vẫn nhận để không đổi props HomeHeader truyền
// xuống, nhưng không còn render ra UI (xem HomeHeader.tsx).
export function XPLevelRow({ xp, level }: { xp: number; level: number; levelProgress?: number }) {
  return (
    <View style={styles.row}>
      <View style={styles.pill}>
        <StarFillIcon size={16} />
        <Text style={styles.text}>{formatXp(xp)} XP</Text>
      </View>
      <View style={styles.pill}>
        <AwardIcon size={16} />
        <Text style={styles.text}>Level {level}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors2.black,
    borderRadius: radii2.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: { fontFamily: fontFamily2.displaySpeed, fontSize: 14, lineHeight: 20, color: colors2.white },
});
