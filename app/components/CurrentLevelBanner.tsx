import { StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

export function CurrentLevelBanner({
  chapterNumber,
  levelPosition,
  productName,
  personaName,
}: {
  chapterNumber: number;
  /** Bỏ trống (cùng productName) để hiện bản gọn "Chặng N - Persona" —
   * dùng làm banner cố định (sticky) đầu màn Map, không gắn với 1 level
   * cụ thể. Đúng chế độ Figma (node-id=30:1819, "Level Box") hiển thị. */
  levelPosition?: number;
  productName?: string;
  /** Chỉ dùng ở chế độ gọn (levelPosition/productName bỏ trống). */
  personaName?: string;
}) {
  const isCompact = levelPosition === undefined || productName === undefined;
  return (
    <View style={styles.banner}>
      {isCompact ? (
        <>
          <Text style={styles.label}>Chặng {chapterNumber}</Text>
          <Text style={styles.value} numberOfLines={2}>
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
  );
}

const styles = StyleSheet.create({
  // "Sticker shadow" cứng (0px 4px 0px white, không blur) — dùng shadowOffset
  // lớn + shadowOpacity=1 + shadowRadius=0 để mô phỏng đúng kiểu Figma (drop-
  // shadow phẳng) thay vì shadow mờ mặc định. Bản Figma mới (node-id=76-5842)
  // đổi viền/bóng từ cam sang TRẮNG (trước dùng shadowOrange/offset 6, xem
  // git blame) — khớp cùng ngôn ngữ "sticker trắng" với StreakCard ở Home.
  banner: {
    backgroundColor: colors2.orange,
    borderWidth: 1,
    borderColor: colors2.white,
    borderRadius: radii2.card,
    padding: spacing2.md,
    gap: 0,
    shadowColor: colors2.white,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  label: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.whiteMuted },
  value: { fontFamily: fontFamily2.semiBold, fontSize: 16, lineHeight: 24, color: colors2.white },
});
