import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';
import type { CustomerProfile, CustomerSegment } from '../data/types';

// Màu tag theo đúng Figma (Secondary/Green, Secondary/Yellow) — "Priority"
// không xuất hiện trong frame này (chỉ có ví dụ Mass/Affluent) nên dùng màu
// trung tính (trắng/chữ xanh đậm) thay vì bịa 1 màu mới không có nguồn.
const SEGMENT_BG: Record<CustomerSegment, string> = {
  Mass: colors2.tagGreen,
  Affluent: colors2.tagYellow,
  Priority: colors2.white,
};

export function PracticeCustomerRow({
  customer,
  onPress,
  onPressPractice,
}: {
  customer: CustomerProfile;
  onPress?: () => void;
  onPressPractice?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {customer.name}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{customer.age} tuổi</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText} numberOfLines={1}>
            {customer.occupation}
          </Text>
        </View>
        <View style={styles.tagRow}>
          <View style={[styles.segmentBadge, { backgroundColor: SEGMENT_BG[customer.segment] }]}>
            <Text style={styles.segmentText}>{customer.segment}</Text>
          </View>
          <Text style={styles.needsText} numberOfLines={1}>
            {customer.needsShort}
          </Text>
        </View>
      </View>

      <Pressable onPress={onPressPractice} style={styles.ctaShadow} hitSlop={6}>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>Luyện tập</Text>
        </View>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.md,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    padding: spacing2.md,
  },
  info: { flex: 1, gap: spacing2.xs },
  name: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing2.xs },
  metaText: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.whiteMuted, flexShrink: 1 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors2.whiteMuted },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  segmentBadge: { borderRadius: 2, paddingHorizontal: 4 },
  segmentText: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.black },
  needsText: { flex: 1, fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.white },
  ctaShadow: { backgroundColor: colors2.shadowOrange, borderRadius: radii2.button, paddingBottom: 6 },
  cta: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii2.button,
    paddingHorizontal: spacing2.md,
    paddingVertical: spacing2.xs,
    backgroundColor: colors2.yellow,
  },
  ctaText: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.black },
});
