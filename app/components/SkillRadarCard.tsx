import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SkillHexChart } from './SkillHexChart';
import { ChevronRightIcon } from './icons2';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';
import type { SkillScore } from '../data/types';

export function SkillRadarCard({
  skills,
  onPressDetail,
}: {
  skills: SkillScore[];
  onPressDetail?: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Kiến thức & Kỹ năng</Text>
        <Pressable onPress={onPressDetail} hitSlop={8} style={styles.detailBtn}>
          <Text style={styles.detailText}>Chi tiết</Text>
          <ChevronRightIcon size={24} />
        </Pressable>
      </View>

      <SkillHexChart skills={skills} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors2.black,
    borderWidth: 1,
    borderColor: colors2.cardOutline,
    borderRadius: radii2.card,
    padding: spacing2.md,
    gap: spacing2.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { flex: 1, fontFamily: fontFamily2.semiBold, fontSize: 16, lineHeight: 24, color: colors2.white },
  detailBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontFamily: fontFamily2.semiBold, fontSize: 16, lineHeight: 24, color: colors2.yellow },
});
