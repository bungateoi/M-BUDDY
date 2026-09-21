import { StyleSheet, View } from 'react-native';
import { SkillHexChart } from './SkillHexChart';
import { colors2, radii2, spacing2 } from './theme';
import type { SkillScore } from '../data/types';

// Khung thẻ tối bọc SkillHexChart, dùng CHUNG giữa màn Phân tích cá nhân và
// màn Phân tích đội nhóm (node-id=160-16508/160-16803) — 2 màn này hiện
// đúng 1 kiểu thẻ radar giống hệt nhau (khác SkillRadarCard ở Home, vốn còn
// có thêm tiêu đề + nút "Chi tiết" riêng, xem SkillRadarCard.tsx).
export function SkillHexCard({ skills }: { skills: SkillScore[] }) {
  return (
    <View style={styles.card}>
      <SkillHexChart skills={skills} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    padding: spacing2.md,
    width: '100%',
    alignItems: 'center',
  },
});
