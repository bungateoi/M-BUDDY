import { StyleSheet, Text, View } from 'react-native';
import { fontFamily, radii, spacing } from './theme';

export function ProfileStatCard({
  icon,
  label,
  value,
  sublabel,
  bg,
  valueColor,
}: {
  icon: string;
  label: string;
  value: string;
  sublabel: string;
  bg: string;
  valueColor: string;
}) {
  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.sublabel} numberOfLines={1}>
        {sublabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: radii.lg, padding: spacing.sm, gap: 2 },
  icon: { fontSize: 15, marginBottom: 2 },
  label: { fontFamily: fontFamily.bold, fontSize: 10.5, color: '#6B6558' },
  value: { fontFamily: fontFamily.extraBold, fontSize: 15 },
  sublabel: { fontFamily: fontFamily.semiBold, fontSize: 9, color: '#8A8577' },
});
