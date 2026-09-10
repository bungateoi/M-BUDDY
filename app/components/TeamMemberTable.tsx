import { forwardRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SCORE_CRITERIA_META } from '../data';
import type { TeamMember } from '../data/types';
import { colors, fontFamily, spacing } from './theme';

const NAME_COL_WIDTH = 132;
const CRITERION_COL_WIDTH = 68;
const AVG_COL_WIDTH = 64;
const HEADER_HEIGHT = 56;
const ROW_HEIGHT = 54;

const RANK_BADGE_COLOR: Record<number, string> = { 1: colors.primary, 2: '#A8B2BD', 3: '#C97A3D' };

export interface TeamTableRow {
  member: TeamMember;
  average: number;
}

function RankBadge({ rank }: { rank: number }) {
  const bg = RANK_BADGE_COLOR[rank];
  return (
    <View style={[styles.rankBadge, bg ? { backgroundColor: bg } : styles.rankBadgeDefault]}>
      <Text style={[styles.rankBadgeText, !bg && styles.rankBadgeTextDefault]}>{rank}</Text>
    </View>
  );
}

// Tách riêng khỏi TeamMemberTableBody để màn cha (TeamManagementScreen) ghim
// được nó cùng thanh tìm kiếm qua stickyHeaderIndices của ScrollView ngoài
// cùng — trong khi Knowledge & Skill Gaps phía trên vẫn cuộn trôi bình
// thường. `ref` là ScrollView ngang của phần tiêu đề tiêu chí — cha truyền
// xuống để đồng bộ theo cuộn ngang của body (xem TeamMemberTableBody).
export const TeamMemberTableHeader = forwardRef<ScrollView>(function TeamMemberTableHeader(_props, ref) {
  return (
    <View style={styles.headerRow}>
      <View style={[styles.nameCell, styles.headerNameCell]}>
        <Text style={styles.headerCellText}>Thành viên</Text>
      </View>
      <ScrollView ref={ref} horizontal scrollEnabled={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.dataRowLine}>
          {SCORE_CRITERIA_META.map((c) => (
            <View key={c.key} style={styles.criterionHeaderCell}>
              <Text style={styles.headerCellText} numberOfLines={2}>
                {c.label}
              </Text>
            </View>
          ))}
          <View style={styles.avgHeaderCell}>
            <Text style={styles.headerCellText} numberOfLines={2}>
              Trung bình
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

// Chỉ còn phần dữ liệu (cột tên cố định ngang + cột điểm cuộn ngang riêng) —
// KHÔNG còn tự cuộn dọc (bỏ ScrollView dọc trước đây bọc ngoài) vì giờ cuộn
// dọc do ScrollView ngoài cùng của màn hình đảm nhiệm, để có thể ghim phần
// tiêu đề + thanh tìm kiếm phía trên nó.
export function TeamMemberTableBody({
  rows,
  onScrollX,
}: {
  rows: TeamTableRow[];
  onScrollX: (x: number) => void;
}) {
  if (rows.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>Không tìm thấy thành viên phù hợp.</Text>
      </View>
    );
  }

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    onScrollX(e.nativeEvent.contentOffset.x);
  };

  return (
    <View style={styles.bodyRow}>
      <View>
        {rows.map(({ member }, index) => (
          <View key={member.id} style={styles.nameCell}>
            <RankBadge rank={index + 1} />
            <Text style={styles.memberName} numberOfLines={2}>
              {member.name}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal onScroll={handleScroll} scrollEventThrottle={16} showsHorizontalScrollIndicator={false}>
        <View>
          {rows.map(({ member, average }) => (
            <View key={member.id} style={styles.dataRowLine}>
              {SCORE_CRITERIA_META.map((c) => (
                <View key={c.key} style={styles.criterionCell}>
                  <Text style={styles.scoreText}>{member.scores[c.key] ?? '-'}</Text>
                </View>
              ))}
              <View style={styles.avgCell}>
                <Text style={styles.avgText}>{average}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', backgroundColor: colors.primaryLight, borderBottomWidth: 1, borderBottomColor: '#F1DCC9' },
  headerNameCell: { height: HEADER_HEIGHT, justifyContent: 'center', backgroundColor: colors.primaryLight },
  headerCellText: { fontFamily: fontFamily.extraBold, fontSize: 10.5, color: colors.textPrimary, textAlign: 'center' },
  bodyRow: { flexDirection: 'row' },
  dataRowLine: { flexDirection: 'row', height: ROW_HEIGHT },

  nameCell: {
    width: NAME_COL_WIDTH,
    height: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F1E7E0',
    borderRightWidth: 1,
    borderRightColor: '#F1E7E0',
    backgroundColor: colors.white,
  },
  rankBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeDefault: { backgroundColor: colors.background },
  rankBadgeText: { fontFamily: fontFamily.extraBold, fontSize: 10.5, color: colors.white },
  rankBadgeTextDefault: { color: colors.textMuted },
  memberName: { flex: 1, fontFamily: fontFamily.extraBold, fontSize: 13.5, color: colors.textPrimary },

  criterionHeaderCell: {
    width: CRITERION_COL_WIDTH,
    height: HEADER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: '#F1DCC9',
  },
  avgHeaderCell: {
    width: AVG_COL_WIDTH,
    height: HEADER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  criterionCell: {
    width: CRITERION_COL_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1E7E0',
    borderRightWidth: 1,
    borderRightColor: '#F1E7E0',
  },
  scoreText: { fontFamily: fontFamily.bold, fontSize: 14.5, color: colors.textPrimary },
  avgCell: {
    width: AVG_COL_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1E7E0',
    backgroundColor: colors.primaryLight,
  },
  avgText: { fontFamily: fontFamily.extraBold, fontSize: 15, color: colors.primary },

  emptyWrap: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.white },
  emptyText: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.textMuted },
});
