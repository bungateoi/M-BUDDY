import { Pressable, StyleSheet, Text, View } from 'react-native';
import { buildSkillScoresFromRaw } from '../data/scoreCriteriaMeta';
import type { PracticeHistoryEntry } from '../data/types';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${min}`;
}

// Figma (node-id=101-1661, "Container") — thẻ nền #2E2E2E, tách riêng ngày
// và giờ bằng 1 dấu chấm tròn (thay vì gộp chung 1 chuỗi "dd/mm/yyyy | hh:mm"
// như bản cũ). Điểm số dùng font A4 Speed trắng/cam giống các màn khác đã
// đổi theo Figma mới (Home/Quiz/RolePlay/Result).
export function PracticeHistoryCard({ entry, onPress }: { entry: PracticeHistoryEntry; onPress: () => void }) {
  // shortLabel (vd "Hiểu KH", "Khai thác NC"...) — đúng bộ nhãn dùng chung
  // với radar chart ở Home/Phân tích chi tiết/Nhóm của tôi, tránh lệch nhãn.
  const skills = buildSkillScoresFromRaw(entry.skillScores);
  const leftCol = skills.slice(0, 3);
  const rightCol = skills.slice(3);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.titleLine} numberOfLines={1}>
            {entry.titleLine}
          </Text>
          <Text style={styles.subtitleLine} numberOfLines={1}>
            {entry.subtitleLine}
          </Text>
          <View style={styles.dateRow}>
            <Text style={styles.dateText}>{fmtDate(entry.createdAt)}</Text>
            <View style={styles.dot} />
            <Text style={styles.dateText}>{fmtTime(entry.createdAt)}</Text>
          </View>
        </View>
        <Text style={styles.scoreText}>
          {entry.totalScore}
          <Text style={styles.scoreMax}>/100</Text>
        </Text>
      </View>

      <View style={styles.skillBox}>
        <View style={styles.skillCol}>
          {leftCol.map((s) => (
            <Text key={s.key} style={styles.skillText}>
              {s.shortLabel}: {s.value}
            </Text>
          ))}
        </View>
        <View style={styles.skillCol}>
          {rightCol.map((s) => (
            <Text key={s.key} style={styles.skillText}>
              {s.shortLabel}: {s.value}
            </Text>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    padding: spacing2.md,
    gap: spacing2.xs,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing2.md },
  headerText: { flex: 1, gap: spacing2.xxs },
  titleLine: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.orange },
  subtitleLine: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing2.xs },
  dateText: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.whiteMuted },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors2.whiteMuted },
  scoreText: { fontFamily: fontFamily2.displaySpeed, fontSize: 16, lineHeight: 24, color: colors2.white },
  scoreMax: { color: colors2.orange },
  skillBox: {
    flexDirection: 'row',
    backgroundColor: colors2.whiteMuted,
    borderRadius: 2,
    padding: spacing2.xs,
  },
  skillCol: { flex: 1, gap: 4 },
  skillText: { fontFamily: fontFamily2.semiBold, fontSize: 12, lineHeight: 16, color: colors2.black },
});
