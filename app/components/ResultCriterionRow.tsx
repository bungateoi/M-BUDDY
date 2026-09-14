import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors2, fontFamily2, spacing2 } from './theme';

// Icon "Material" tải PNG nguyên trạng từ Figma (node-id=76-3940) — vài icon
// (People Alt, Person Search) ghép nhiều lớp vector con phức tạp, xuất PNG
// @3x rồi hiển thị co lại 20x20 vẫn nét, đơn giản/chắc chắn hơn dựng lại
// bằng tay từng lớp SVG con.
const ICONS = {
  people: require('../assets/v2/result2/icon-people.png'),
  file: require('../assets/v2/result2/icon-file.png'),
  face: require('../assets/v2/result2/icon-face.png'),
  warning: require('../assets/v2/result2/icon-warning.png'),
  search: require('../assets/v2/result2/icon-search.png'),
  reg: require('../assets/v2/result2/icon-reg.png'),
} satisfies Record<string, ImageSourcePropType>;

// data/scoreCriteriaMeta.ts đặt tên icon Ionicons (dữ liệu dùng chung cho cả
// bản UI cũ) — quy đổi sang đúng 6 icon PNG mới theo Figma, 1-1 với đúng thứ
// tự "Chi tiết đánh giá": people/reader/happy/shield-checkmark/search/locate.
const IONICON_TO_RESULT_ICON: Record<string, keyof typeof ICONS> = {
  people: 'people',
  reader: 'file',
  happy: 'face',
  'shield-checkmark': 'warning',
  search: 'search',
  locate: 'reg',
};

export function ResultCriterionRow({
  icon,
  label,
  score,
  maxScore,
  feedback,
}: {
  /** Tên icon Ionicons từ data (xem data/scoreCriteriaMeta.ts) — quy đổi nội
   * bộ sang icon PNG mới, ResultScreen không cần biết chi tiết này. */
  icon: string;
  label: string;
  score: number;
  maxScore: number;
  feedback: string;
}) {
  const ratio = maxScore > 0 ? Math.max(0, Math.min(1, score / maxScore)) : 0;
  const iconSource = ICONS[IONICON_TO_RESULT_ICON[icon] ?? 'people'];

  return (
    <View style={styles.wrap}>
      <View style={styles.topLine}>
        <Image source={iconSource} style={styles.icon} />
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.scoreText}>
          {score}/{maxScore}
        </Text>
      </View>

      <View style={styles.track}>
        <LinearGradient
          colors={[colors2.orange, colors2.yellow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${ratio * 100}%` }]}
        />
      </View>

      <Text style={styles.feedback}>{feedback}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing2.xs },
  topLine: { flexDirection: 'row', alignItems: 'center', gap: spacing2.xs },
  icon: { width: 20, height: 20 },
  label: { flex: 1, fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
  scoreText: { fontFamily: fontFamily2.displaySpeed, fontSize: 14, lineHeight: 20, color: colors2.white },
  track: { height: 8, borderRadius: 99, backgroundColor: colors2.cardOptionIdle, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
  feedback: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.whiteMuted },
});
