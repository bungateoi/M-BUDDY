import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

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
        <Ionicons name={icon as any} size={18} color={isFilled ? colors2.white : colors2.orange} />
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
      <Ionicons name="chevron-forward" size={16} color={colors2.whiteMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.xs,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: spacing2.md,
    paddingVertical: spacing2.md,
  },
  rowFilled: { borderColor: colors2.orange },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors2.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleFilled: { backgroundColor: colors2.orange },
  numberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors2.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { fontFamily: fontFamily2.semiBold, fontSize: 10.5, color: colors2.whiteMuted },
  label: { fontFamily: fontFamily2.semiBold, fontSize: 13.5, color: colors2.white },
  value: { flex: 1, textAlign: 'right', fontFamily: fontFamily2.regular, fontSize: 12, color: colors2.whiteMuted },
  valueFilled: { color: colors2.orange, fontFamily: fontFamily2.semiBold },
});
