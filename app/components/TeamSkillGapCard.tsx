import { StyleSheet, Text, View } from 'react-native';
import { SkillRadarChart } from './SkillRadarChart';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';
import type { SkillScore } from '../data/types';

export function TeamSkillGapCard({ skills }: { skills: SkillScore[] }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>📊</Text>
        <Text style={styles.title}>Knowledge & Skill Gaps của team</Text>
      </View>

      <View style={styles.body}>
        <SkillRadarChart skills={skills} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    gap: spacing2.xs,
    paddingHorizontal: spacing2.md,
    paddingVertical: spacing2.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { fontSize: 16 },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 14.5, color: colors2.white },
  body: { alignItems: 'center' },
});
