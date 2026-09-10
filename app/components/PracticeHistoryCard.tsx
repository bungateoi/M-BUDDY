import { Pressable, StyleSheet, Text, View } from 'react-native';
import { buildSkillScoresFromRaw } from '../data/scoreCriteriaMeta';
import type { PracticeHistoryEntry } from '../data/types';
import { cardShadow, colors, fontFamily, radii, spacing } from './theme';

function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} | ${hh}:${min}`;
}

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
          <Text style={styles.dateText}>{fmtDateTime(entry.createdAt)}</Text>
        </View>
        <View style={styles.scoreWrap}>
          <Text style={styles.scoreValue}>{entry.totalScore}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
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
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
    ...cardShadow,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  headerText: { flex: 1, gap: 2 },
  titleLine: { fontFamily: fontFamily.extraBold, fontSize: 14, color: colors.primary },
  subtitleLine: { fontFamily: fontFamily.bold, fontSize: 13.5, color: colors.textPrimary },
  dateText: { fontFamily: fontFamily.semiBold, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  scoreWrap: { flexDirection: 'row', alignItems: 'baseline' },
  scoreValue: { fontFamily: fontFamily.black, fontSize: 26, color: colors.primary },
  scoreMax: { fontFamily: fontFamily.bold, fontSize: 13, color: colors.primary },
  skillBox: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: radii.md,
    padding: spacing.sm,
  },
  skillCol: { flex: 1, gap: 4 },
  skillText: { fontFamily: fontFamily.semiBold, fontSize: 11.5, color: colors.textPrimary },
});
