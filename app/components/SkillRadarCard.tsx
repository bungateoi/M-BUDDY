import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { SkillRadarChart } from './SkillRadarChart';
import { colors, fontFamily, spacing } from './theme';
import type { SkillScore } from '../data/types';

export function SkillRadarCard({
  skills,
  onPressDetail,
}: {
  skills: SkillScore[];
  onPressDetail?: () => void;
}) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brain}>🧠</Text>
          <Text style={styles.title}>Kiến thức & Kỹ năng</Text>
        </View>
        <Pressable onPress={onPressDetail} hitSlop={8} style={styles.detailBtn}>
          <Text style={styles.detailText}>Xem chi tiết</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <SkillRadarChart skills={skills} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xs, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brain: { fontSize: 18 },
  title: { fontFamily: fontFamily.extraBold, fontSize: 16, color: colors.textPrimary },
  detailBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  detailText: { fontFamily: fontFamily.bold, fontSize: 12.5, color: colors.primary },
  body: { alignItems: 'center' },
});
