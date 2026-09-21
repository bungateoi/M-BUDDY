import { Image, StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

const mascotSource = require('../assets/mascot.png');

// Figma (node-id=76:3536) không thiết kế riêng trạng thái "Mẹo cho bạn" hiện
// ra — recolor theo đúng bảng màu tối mới của cả màn (không bịa layout mới,
// chỉ đổi màu cho khớp nền đen thay vì nền cam nhạt cũ).
export function RolePlayTipCard({ tip }: { tip: string }) {
  return (
    <View style={styles.card}>
      <Image source={mascotSource} style={styles.mascot} resizeMode="contain" />
      <View style={styles.textCol}>
        <Text style={styles.title}>✨ Mẹo cho bạn</Text>
        <Text style={styles.tip}>{tip}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.sm,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    padding: spacing2.md,
  },
  mascot: { width: 36, height: 44 },
  textCol: { flex: 1, gap: 2 },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 13, color: colors2.yellow },
  tip: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.whiteMuted },
});
