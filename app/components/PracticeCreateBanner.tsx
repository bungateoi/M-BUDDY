import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

const mascotSource = require('../assets/v2/practice2/mascot2.png');

// Nền cam của cả màn (PracticeScreen.tsx) đã lộ trực tiếp qua banner này —
// khác bản cũ (thẻ xanh đậm riêng) — nên bản thân banner giờ trong suốt,
// chỉ còn chữ + nút + mascot. Mascot ghim tuyệt đối, TRÀN XUỐNG dưới banner
// (cao hơn khối text) — khớp đúng Figma (node-id=67-883): "Box" danh sách
// bên dưới render SAU nên tự phủ lên phần mascot tràn ra đó, không cần
// overflow/zIndex thủ công.
export function PracticeCreateBanner({ onPress }: { onPress?: () => void }) {
  return (
    <View style={styles.banner}>
      <View style={styles.textCol}>
        <Text style={styles.title}>Tạo khách hàng của bạn</Text>
        <Text style={styles.desc}>Xây dựng chân dung khách hàng theo nhu cầu để luyện tập Role-Play.</Text>
      </View>

      <Pressable onPress={onPress} style={styles.ctaShadow}>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>Luyện tập</Text>
        </View>
      </Pressable>

      <Image source={mascotSource} style={styles.mascot} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { gap: spacing2.md, paddingHorizontal: spacing2.md },
  textCol: { gap: spacing2.xxs, width: 218 },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 18, lineHeight: 28, color: colors2.white },
  desc: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.white },
  // "Sticker shadow" — xem DailyChallengeCard.tsx cho giải thích kỹ thuật.
  ctaShadow: { alignSelf: 'flex-start', backgroundColor: colors2.shadowOrange, borderRadius: radii2.button, paddingBottom: 6 },
  cta: {
    backgroundColor: colors2.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii2.button,
    paddingHorizontal: spacing2.md,
    paddingVertical: spacing2.xs,
  },
  ctaText: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.black },
  mascot: { position: 'absolute', top: 4, right: -23, width: 177, height: 177 },
});
