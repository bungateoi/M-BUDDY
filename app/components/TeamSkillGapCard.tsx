import { StyleSheet, Text, View } from 'react-native';
import { Card } from './Card';
import { SkillRadarChart } from './SkillRadarChart';
import { colors, fontFamily, spacing } from './theme';
import type { SkillScore } from '../data/types';

export function TeamSkillGapCard({ skills }: { skills: SkillScore[] }) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>📊</Text>
        <Text style={styles.title}>Knowledge & Skill Gaps của team</Text>
      </View>

      <View style={styles.body}>
        <SkillRadarChart skills={skills} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xs, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 16 },
  title: { fontFamily: fontFamily.extraBold, fontSize: 14.5, color: colors.textPrimary },
  body: { alignItems: 'center' },
});
