import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cardShadow, colors, fontFamily, radii, spacing } from './theme';

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
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
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
        <Ionicons name="calendar-outline" size={14} color={colors.primary} />
        <Text style={styles.dateRangeText}>{dateRangeLabel}</Text>
        <Ionicons name="chevron-down" size={14} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  textCol: { flex: 1, gap: 1 },
  title: { fontFamily: fontFamily.extraBold, fontSize: 16.5, color: colors.textPrimary },
  subtitle: { fontFamily: fontFamily.semiBold, fontSize: 11.5, color: colors.textMuted },
  dateRangePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  dateRangeText: { fontFamily: fontFamily.bold, fontSize: 10.5, color: colors.primary },
});
