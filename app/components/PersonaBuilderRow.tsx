import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cardShadow, colors, fontFamily, radii, spacing } from './theme';

export function PersonaBuilderRow({
  order,
  icon,
  label,
  summary,
  placeholder,
  onPress,
}: {
  order: number;
  icon: string;
  label: string;
  summary?: string;
  placeholder: string;
  onPress?: () => void;
}) {
  const isFilled = Boolean(summary);
  return (
    <Pressable onPress={onPress} style={[styles.row, isFilled && styles.rowFilled]}>
      <View style={[styles.iconCircle, isFilled && styles.iconCircleFilled]}>
        <Ionicons name={icon as any} size={18} color={isFilled ? colors.white : colors.primary} />
      </View>
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{order}</Text>
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.value, isFilled && styles.valueFilled]} numberOfLines={1}>
        {summary ?? placeholder}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...cardShadow,
  },
  rowFilled: { borderColor: colors.primary },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleFilled: { backgroundColor: colors.primary },
  numberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { fontFamily: fontFamily.bold, fontSize: 10.5, color: colors.textMuted },
  label: { fontFamily: fontFamily.extraBold, fontSize: 13.5, color: colors.textPrimary },
  value: { flex: 1, textAlign: 'right', fontFamily: fontFamily.semiBold, fontSize: 12, color: colors.textMuted },
  valueFilled: { color: colors.primary, fontFamily: fontFamily.bold },
});
