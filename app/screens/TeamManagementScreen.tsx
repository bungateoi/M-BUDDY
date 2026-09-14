import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, SafeAreaView, StyleSheet, View } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import {
  TeamManagementHeader,
  TeamSkillGapCard,
  TeamSearchFilterBar,
  TeamMemberTableHeader,
  TeamMemberTableBody,
  SimpleSelectModal,
  DateRangeCalendarModal,
  HomeBottomNavBar,
  colors2,
  radii2,
  spacing2,
  type SimpleSelectOption,
} from '../components';
import { SCORE_CRITERIA_META, averageSkillScore, buildSkillScoresFromRaw } from '../data';
import type { TeamMember } from '../data/types';
import { fetchMyTeam } from '../lib/authData';
import { useAuth } from '../lib/AuthContext';
import { useAppNavigation } from '../navigation/NavigationContext';

const AVERAGE_SORT_ID = 'average';

const SORT_OPTIONS: SimpleSelectOption[] = [
  { id: AVERAGE_SORT_ID, label: 'Điểm trung bình' },
  ...SCORE_CRITERIA_META.map((c) => ({ id: c.key, label: c.label })),
];

function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function fmtDM(d: Date): string {
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function fmtDMY(d: Date): string {
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function rangeLabel(start: Date, end: Date): string {
  return `${fmtDM(start)} - ${fmtDMY(end)}`;
}

/** Điểm trung bình cả team theo từng tiêu chí — cho radar "Knowledge & Skill Gaps". */
function averageTeamSkills(members: TeamMember[]) {
  if (members.length === 0) return buildSkillScoresFromRaw({});
  const raw: Record<string, number> = {};
  for (const c of SCORE_CRITERIA_META) {
    const total = members.reduce((sum, m) => sum + (m.scores[c.key] ?? 0), 0);
    raw[c.key] = total / members.length;
  }
  return buildSkillScoresFromRaw(raw);
}

export function TeamManagementScreen() {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  const [members, setMembers] = useState<TeamMember[] | null>(null);
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState(AVERAGE_SORT_ID);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [dateRangeModalOpen, setDateRangeModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState(() => {
    const start = startOfWeekMonday(new Date());
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { start, end };
  });
  // Đồng bộ cuộn ngang giữa hàng tiêu đề tiêu chí (ghim, đứng riêng nhánh
  // cây) và phần dữ liệu (cuộn cùng ScrollView dọc của cả màn) — trước đây 2
  // phần này nằm trong cùng 1 component nên tự đồng bộ được, giờ tách ra nên
  // cần ref dùng chung.
  const headerScrollRef = useRef<ScrollViewType>(null);

  useEffect(() => {
    fetchMyTeam()
      .then(setMembers)
      .catch(() => setMembers([]));
  }, []);

  const dateRangeLabel = rangeLabel(dateRange.start, dateRange.end);
  const teamSkills = useMemo(() => averageTeamSkills(members ?? []), [members]);
  const filterLabel = SORT_OPTIONS.find((o) => o.id === sortKey)?.label ?? 'Bộ lọc';

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = (members ?? [])
      .filter((m) => !q || m.name.toLowerCase().includes(q))
      .map((member) => ({ member, average: averageSkillScore(member.scores) }));
    return matched.sort((a, b) => {
      const va = sortKey === AVERAGE_SORT_ID ? a.average : a.member.scores[sortKey] ?? 0;
      const vb = sortKey === AVERAGE_SORT_ID ? b.average : b.member.scores[sortKey] ?? 0;
      return sortDirection === 'asc' ? va - vb : vb - va;
    });
  }, [members, query, sortKey, sortDirection]);

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <TeamManagementHeader
        subtitle={`${profile.branch || 'Chi nhánh'} · ${members?.length ?? 0} NV`}
        dateRangeLabel={dateRangeLabel}
        onBack={() => navigate('profile')}
        onPressDateRange={() => setDateRangeModalOpen(true)}
      />

      {!members ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors2.white} />
        </View>
      ) : (
        // stickyHeaderIndices={[1]} ghim ĐÚNG 1 khối con: thanh tìm kiếm +
        // hàng tiêu đề bảng — Knowledge & Skill Gaps (index 0) cuộn trôi bình
        // thường phía trên, các dòng thành viên (index 2) cũng cuộn bình
        // thường bên dưới, nhường diện tích thay vì bị đóng khung nhỏ hẹp.
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} stickyHeaderIndices={[1]}>
          <TeamSkillGapCard skills={teamSkills} />

          <View style={styles.stickyGroup}>
            <TeamSearchFilterBar
              query={query}
              onChangeQuery={setQuery}
              filterLabel={filterLabel}
              onPressFilter={() => setFilterModalOpen(true)}
              sortDirection={sortDirection}
              onToggleSortDirection={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
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

      <HomeBottomNavBar
        active="toi"
        onPressItem={(key) => {
          if (key === 'home') navigate('home');
          if (key === 'map') navigate('map');
          if (key === 'practice') navigate('practice');
          if (key === 'xephang') navigate('leaderboard');
          if (key === 'ontap') navigate('practiceHistory');
        }}
      />

      <SimpleSelectModal
        visible={filterModalOpen}
        title="Sắp xếp theo tiêu chí"
        options={SORT_OPTIONS}
        selectedId={sortKey}
        onSelect={setSortKey}
        onClose={() => setFilterModalOpen(false)}
      />

      <DateRangeCalendarModal
        visible={dateRangeModalOpen}
        initialStart={dateRange.start}
        initialEnd={dateRange.end}
        onConfirm={(start, end) => setDateRange({ start, end })}
        onClose={() => setDateRangeModalOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors2.black },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing2.md, paddingTop: spacing2.xs, paddingBottom: spacing2.xl, gap: spacing2.md },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  // Nền phải trùng màu nền trang (không trong suốt) — khi bị ghim, khối này
  // che lên nội dung đang cuộn bên dưới nó.
  stickyGroup: { backgroundColor: colors2.black, gap: spacing2.md, paddingBottom: spacing2.md },
  tableHeaderCard: { borderTopLeftRadius: radii2.card, borderTopRightRadius: radii2.card, overflow: 'hidden' },
  tableBodyCard: {
    backgroundColor: colors2.cardOptionIdle,
    borderBottomLeftRadius: radii2.card,
    borderBottomRightRadius: radii2.card,
    overflow: 'hidden',
  },
});
