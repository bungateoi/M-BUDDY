import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radii, spacing } from './theme';

const mascotSource = require('../assets/mascot.png');

export function RolePlayTipCard({ tip }: { tip: string }) {
  return (
    <View style={styles.card}>
      <Image source={mascotSource} style={styles.mascot} resizeMode="contain" />
      <View style={styles.textCol}>
        <Text style={styles.title}>✨ Mẹo cho bạn</Text>
        <Text style={styles.tip}>{tip}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radii.xl,
    padding: spacing.md,
  },
  mascot: { width: 36, height: 44 },
  textCol: { flex: 1, gap: 2 },
  title: { fontFamily: fontFamily.extraBold, fontSize: 12.5, color: colors.primary },
  tip: { fontFamily: fontFamily.semiBold, fontSize: 11, color: colors.textMuted, lineHeight: 15 },
});
