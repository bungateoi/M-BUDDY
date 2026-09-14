import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

export function TeamManagementHeader({
  subtitle,
  dateRangeLabel,
  onBack,
  onPressDateRange,
}: {
  subtitle: string;
  dateRangeLabel: string;
  onBack?: () => void;
  onPressDateRange: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} hitSlop={8} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors2.white} />
        </Pressable>
        <View style={styles.textCol}>
          <Text style={styles.title} numberOfLines={1}>
            Nhóm của tôi
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>

      <Pressable onPress={onPressDateRange} style={styles.dateRangePill}>
        <Ionicons name="calendar-outline" size={14} color={colors2.orange} />
        <Text style={styles.dateRangeText}>{dateRangeLabel}</Text>
        <Ionicons name="chevron-down" size={14} color={colors2.orange} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing2.xs,
    paddingHorizontal: spacing2.md,
    paddingTop: spacing2.xs,
    paddingBottom: spacing2.md,
    backgroundColor: colors2.black,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing2.xs, flex: 1 },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors2.cardOptionIdle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1, gap: 1 },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 16.5, color: colors2.white },
  subtitle: { fontFamily: fontFamily2.regular, fontSize: 11.5, color: colors2.whiteMuted },
  dateRangePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: colors2.orange,
    borderRadius: radii2.pill,
    paddingHorizontal: spacing2.xs,
    paddingVertical: 7,
  },
  dateRangeText: { fontFamily: fontFamily2.semiBold, fontSize: 10.5, color: colors2.orange },
});
