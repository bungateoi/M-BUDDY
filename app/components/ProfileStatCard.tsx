import { StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

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
  card: { flex: 1, borderRadius: radii2.card, padding: spacing2.xs, gap: 2 },
  icon: { fontSize: 15, marginBottom: 2 },
  label: { fontFamily: fontFamily2.semiBold, fontSize: 10.5, color: colors2.whiteMuted },
  value: { fontFamily: fontFamily2.semiBold, fontSize: 15 },
  sublabel: { fontFamily: fontFamily2.regular, fontSize: 9, color: colors2.whiteMuted },
});
