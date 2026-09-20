import { useMemo, useRef, useState, useEffect } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  PersonalTeamTabs,
  SkillHexCard,
  TeamSearchFilterBar,
  TeamMemberTableHeader,
  TeamMemberTableBody,
  TeamSortModal,
  colors2,
  fontFamily2,
  radii2,
  spacing2,
  type TeamSortCriterionOption,
} from '../components';
import { averageSkillScore, averageTeamSkills } from '../data';
import type { TeamMember } from '../data/types';
import { fetchMyTeam } from '../lib/authData';
import { useAuth } from '../lib/AuthContext';
import { useAppNavigation } from '../navigation/NavigationContext';

const NAME_CRITERION_ID = 'name';
const AVERAGE_CRITERION_ID = 'average';

const CRITERIA_OPTIONS: TeamSortCriterionOption[] = [
  { id: NAME_CRITERION_ID, label: 'Tên thành viên' },
  { id: AVERAGE_CRITERION_ID, label: 'Điểm trung bình' },
  { id: 'customer_understanding', label: 'Điểm Hiểu Khách hàng' },
  { id: 'knowledge', label: 'Điểm Kiến thức sản phẩm' },
  { id: 'communication', label: 'Điểm Giao tiếp' },
  { id: 'objection_handling', label: 'Điểm Xử lý từ chối' },
  { id: 'insight_discovery', label: 'Điểm Khai thác nhu cầu' },
  { id: 'closing', label: 'Điểm chốt Sale' },
];

// Màn "Kiến thức và Kỹ năng" > tab Đội nhóm (node-id=160-16803) — CHỈ dành
// cho role='manager' (trưởng nhóm), vào từ tab ở Home hoặc từ
// PersonalAnalysisScreen. Dữ liệu/bảng thành viên dùng lại NGUYÊN VẸN
// fetchMyTeam()/TeamMemberTableHeader/TeamMemberTableBody đã có sẵn ở
// TeamManagementScreen.tsx (màn "Nhóm của tôi") — chỉ khác bộ lọc/sắp xếp
// dùng TeamSortModal mới (node-id=161-17398, gộp tiêu chí + chiều sắp xếp
// trong 1 sheet) thay vì SimpleSelectModal + nút đảo chiều rời rạc.
export function TeamAnalysisScreen() {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  const [members, setMembers] = useState<TeamMember[] | null>(null);
  const [query, setQuery] = useState('');
  const [criterion, setCriterion] = useState(NAME_CRITERION_ID);
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const headerScrollRef = useRef<ScrollViewType>(null);

  useEffect(() => {
    fetchMyTeam()
      .then(setMembers)
      .catch(() => setMembers([]));
  }, []);

  const teamSkills = useMemo(() => averageTeamSkills(members ?? []), [members]);
  const filterLabel = CRITERIA_OPTIONS.find((o) => o.id === criterion)?.label ?? 'Bộ lọc';

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = (members ?? [])
      .filter((m) => !q || m.name.toLowerCase().includes(q))
      .map((member) => ({ member, average: averageSkillScore(member.scores) }));
    return matched.sort((a, b) => {
      if (criterion === NAME_CRITERION_ID) {
        const cmp = a.member.name.localeCompare(b.member.name, 'vi');
        return direction === 'asc' ? cmp : -cmp;
      }
      const va = criterion === AVERAGE_CRITERION_ID ? a.average : a.member.scores[criterion] ?? 0;
      const vb = criterion === AVERAGE_CRITERION_ID ? b.average : b.member.scores[criterion] ?? 0;
      return direction === 'asc' ? va - vb : vb - va;
    });
  }, [members, query, criterion, direction]);

  // Chỉ trưởng nhóm mới vào được màn này — cùng cách gác role của các màn
  // quản trị khác (xem AdminScreen.tsx), tránh trắng màn hình nếu lỡ vào từ
  // link cũ sau khi bị đổi role.
  if (!profile || profile.role !== 'manager') return null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigate('home')} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors2.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Kiến thức & Kỹ năng</Text>
        <View style={styles.headerSpacer} />
      </View>

      {!members ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors2.white} />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          stickyHeaderIndices={[2]}
          showsVerticalScrollIndicator={false}
        >
          <PersonalTeamTabs active="team" onSelectPersonal={() => navigate('personalAnalysis')} onSelectTeam={() => {}} />

          <SkillHexCard skills={teamSkills} />

          <View style={styles.stickyGroup}>
            <Text style={styles.memberCountTitle}>Thành viên ({members.length})</Text>
            <TeamSearchFilterBar
              query={query}
              onChangeQuery={setQuery}
              filterLabel={filterLabel}
              onPressFilter={() => setSortModalOpen(true)}
              sortDirection={direction}
              onToggleSortDirection={() => setDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
            />
            <View style={styles.tableHeaderCard}>
              <TeamMemberTableHeader ref={headerScrollRef} />
            </View>
          </View>

          <View style={styles.tableBodyCard}>
            <TeamMemberTableBody
              rows={rows}
              onScrollX={(x) => headerScrollRef.current?.scrollTo({ x, animated: false })}
            />
          </View>
        </ScrollView>
      )}

      <View style={styles.homeIndicatorArea}>
        <View style={styles.homeIndicator} />
      </View>

      <TeamSortModal
        visible={sortModalOpen}
        criteriaOptions={CRITERIA_OPTIONS}
        nameCriterionId={NAME_CRITERION_ID}
        criterion={criterion}
        direction={direction}
        onApply={(nextCriterion, nextDirection) => {
          setCriterion(nextCriterion);
          setDirection(nextDirection);
        }}
        onClose={() => setSortModalOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors2.black },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing2.md, padding: spacing2.md },
  headerTitle: { flex: 1, textAlign: 'center', fontFamily: fontFamily2.semiBold, fontSize: 24, color: colors2.white },
  headerSpacer: { width: 24 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing2.md, paddingBottom: spacing2.xl, gap: spacing2.md },
  // Nền phải trùng màu nền trang (không trong suốt) — khi bị ghim, khối này
  // che lên nội dung đang cuộn bên dưới nó (giống TeamManagementScreen.tsx).
  stickyGroup: { backgroundColor: colors2.black, gap: spacing2.md, paddingBottom: spacing2.md },
  memberCountTitle: { fontFamily: fontFamily2.semiBold, fontSize: 16, lineHeight: 24, color: colors2.white },
  tableHeaderCard: { borderTopLeftRadius: radii2.card, borderTopRightRadius: radii2.card, overflow: 'hidden' },
  tableBodyCard: {
    backgroundColor: colors2.cardOptionIdle,
    borderBottomLeftRadius: radii2.card,
    borderBottomRightRadius: radii2.card,
    overflow: 'hidden',
  },
  homeIndicatorArea: { height: 34, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8 },
  homeIndicator: { width: 134, height: 5, borderRadius: 100, backgroundColor: colors2.white },
});
