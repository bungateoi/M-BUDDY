import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, spacing2 } from './theme';

// Thanh tab "Cá nhân/Đội nhóm" (node-id=160-16417/160-16508/160-16803) —
// CHỈ hiện với role='manager' (trưởng nhóm): dùng ở thẻ "Kiến thức & Kỹ
// năng" màn Home, đầu màn Phân tích cá nhân, và đầu màn Phân tích đội nhóm.
// Nhân viên thường không có tab này ở bất kỳ đâu — luôn chỉ thấy dữ liệu
// cá nhân, xem HomeScreen.tsx/PersonalAnalysisScreen.tsx/TeamAnalysisScreen.tsx.
export function PersonalTeamTabs({
  active,
  onSelectPersonal,
  onSelectTeam,
}: {
  active: 'personal' | 'team';
  onSelectPersonal: () => void;
  onSelectTeam: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Pressable
        style={[styles.segment, active === 'personal' && styles.segmentActive]}
        onPress={onSelectPersonal}
      >
        <Text style={[styles.text, active === 'personal' && styles.textActive]}>Cá nhân</Text>
      </Pressable>
      <Pressable style={[styles.segment, active === 'team' && styles.segmentActive]} onPress={onSelectTeam}>
        <Text style={[styles.text, active === 'team' && styles.textActive]}>Đội nhóm</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors2.cardOptionIdle,
    borderWidth: 1,
    borderColor: colors2.white,
    borderRadius: 8,
    padding: 2,
    width: '100%',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing2.md,
    paddingVertical: spacing2.xs,
    borderRadius: 6,
  },
  segmentActive: { backgroundColor: colors2.yellow },
  text: { fontFamily: fontFamily2.semiBold, fontSize: 12, lineHeight: 16, color: colors2.white },
  textActive: { color: colors2.black },
});
