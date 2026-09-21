import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SkillHexChart } from './SkillHexChart';
import { PersonalTeamTabs } from './PersonalTeamTabs';
import { ChevronRightIcon } from './icons2';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';
import type { SkillScore } from '../data/types';

export function SkillRadarCard({
  skills,
  onPressDetail,
  activeTab,
  onSelectPersonal,
  onSelectTeam,
}: {
  skills: SkillScore[];
  onPressDetail?: () => void;
  /** Chỉ truyền 3 prop tab này khi role='manager' (xem HomeScreen.tsx) — bỏ
   * trống thì không hiện tab "Cá nhân/Đội nhóm", đúng hành vi cũ cho nhân
   * viên thường (node-id=160-16417, tab chỉ dành cho trưởng nhóm). */
  activeTab?: 'personal' | 'team';
  onSelectPersonal?: () => void;
  onSelectTeam?: () => void;
}) {
  const showTabs = activeTab != null && onSelectPersonal != null && onSelectTeam != null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Kiến thức & Kỹ năng</Text>
        <Pressable onPress={onPressDetail} hitSlop={8} style={styles.detailBtn}>
          <Text style={styles.detailText}>Chi tiết</Text>
          <ChevronRightIcon size={24} />
        </Pressable>
      </View>

      {showTabs && (
        <PersonalTeamTabs active={activeTab} onSelectPersonal={onSelectPersonal} onSelectTeam={onSelectTeam} />
      )}

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
