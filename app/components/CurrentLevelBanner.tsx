import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontFamily, primaryGradient, radii, spacing } from './theme';

const mascotSource = require('../assets/mascot-confident.png');

export function CurrentLevelBanner({
  chapterNumber,
  levelPosition,
  productName,
  personaName,
}: {
  chapterNumber: number;
  /** Bỏ trống (cùng productName) để hiện bản gọn "Chặng N - Persona" —
   * dùng làm banner cố định (sticky) đầu màn Map, không gắn với 1 level
   * cụ thể. */
  levelPosition?: number;
  productName?: string;
  /** Chỉ dùng ở chế độ gọn (levelPosition/productName bỏ trống). */
  personaName?: string;
}) {
  const isCompact = levelPosition === undefined || productName === undefined;
  return (
    <LinearGradient
      colors={primaryGradient.colors}
      start={primaryGradient.start}
      end={primaryGradient.end}
      style={styles.banner}
    >
      <Image source={mascotSource} style={styles.mascot} resizeMode="contain" />
      <Text style={styles.sparkle}>✨</Text>
      <View style={styles.textCol}>
        {isCompact ? (
          <>
            <Text style={styles.label}>Chặng {chapterNumber}</Text>
            <Text style={styles.compactValue} numberOfLines={2}>
              {personaName}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.label}>
              Chặng {chapterNumber}, level {levelPosition}:
            </Text>
            <Text style={styles.value} numberOfLines={1}>
              {productName}
            </Text>
          </>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 108,
    borderRadius: radii.xl,
    paddingLeft: 132,
    paddingRight: spacing.lg,
    shadowColor: '#C4460F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },
  mascot: {
    position: 'absolute',
    left: -10,
    bottom: -12,
    width: 148,
    height: 168,
  },
  sparkle: {
    position: 'absolute',
    left: 116,
    top: 20,
    fontSize: 16,
    color: colors.white,
  },
  textCol: { flex: 1, gap: 2 },
  label: { fontFamily: fontFamily.semiBold, fontSize: 13.5, color: 'rgba(255,255,255,0.92)' },
  value: { fontFamily: fontFamily.extraBold, fontSize: 22, color: colors.white },
  // Tên persona dài hơn tên sản phẩm nhiều ("Người đa nghi / từng bị lừa"...)
  // nên dùng cỡ nhỏ hơn value để hạn chế bị cắt bớt (numberOfLines=1).
  compactValue: { fontFamily: fontFamily.extraBold, fontSize: 17, color: colors.white },
});
