import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRightIcon } from './icons2';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

const cardBg = require('../assets/v2/home2/streak-card-bg.png');
const victoryMascot = require('../assets/v2/result2/victory-mascot.png');

export function ResultSummaryCard({
  totalScore,
  maxTotalScore,
  summary,
  onPressHistory,
}: {
  totalScore: number;
  maxTotalScore: number;
  /** Không còn dùng ratingLabel riêng (bản Figma mới bỏ badge xếp loại ở
   * card này) — vẫn hiện ở ResultCriterionRow#isTotal cho hàng tổng, nhưng
   * card tổng quan này giờ chỉ còn số điểm to + mô tả. */
  summary: string;
  onPressHistory?: () => void;
}) {
  return (
    // "Sticker shadow" trắng đặc 4px, không blur — giống hệt StreakCard ở Home.
    <View style={styles.shadowWrap}>
      <ImageBackground source={cardBg} style={styles.card} imageStyle={styles.cardImage} resizeMode="cover">
        <View style={[StyleSheet.absoluteFill, styles.overlay]} />

        <View style={styles.row}>
          <Image source={victoryMascot} style={styles.mascot} resizeMode="contain" />
          <View style={styles.textCol}>
            <Text style={styles.label}>Tổng điểm</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.score}>{totalScore}</Text>
              <Text style={styles.maxScore}>/{maxTotalScore}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.summary}>{summary}</Text>

        <Pressable style={styles.historyCard} onPress={onPressHistory}>
          <Text style={styles.historyLabel}>Lịch sử hội thoại</Text>
          <ChevronRightIcon size={24} />
        </Pressable>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: { backgroundColor: colors2.white, borderRadius: radii2.card, paddingBottom: 4 },
  card: {
    borderRadius: radii2.card,
    borderWidth: 1,
    borderColor: colors2.white,
    overflow: 'hidden',
    padding: spacing2.md,
    gap: spacing2.md,
  },
  cardImage: { borderRadius: radii2.card },
  // Lớp phủ tối rgba(34,34,34,0.8) — đậm hơn StreakCard ở Home (0.64) vì nền
  // ảnh ở đây chỉ là điểm nhấn góc, chữ cần nổi rõ hơn.
  overlay: { backgroundColor: 'rgba(34,34,34,0.8)' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing2.md },
  mascot: { width: 100, height: 77 },
  textCol: { flex: 1, gap: spacing2.xs },
  label: { fontFamily: fontFamily2.semiBold, fontSize: 12, lineHeight: 16, color: colors2.white },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline' },
  score: { fontFamily: fontFamily2.displaySpeed, fontSize: 48, lineHeight: 48, color: colors2.orange },
  maxScore: { fontFamily: fontFamily2.displaySpeed, fontSize: 24, lineHeight: 24, color: colors2.white },
  summary: { fontFamily: fontFamily2.regular, fontSize: 14, lineHeight: 20, color: colors2.white },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.md,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    padding: spacing2.md,
  },
  historyLabel: { flex: 1, fontFamily: fontFamily2.semiBold, fontSize: 16, lineHeight: 24, color: colors2.white },
});
