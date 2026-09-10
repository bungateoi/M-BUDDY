import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, radii, spacing } from './theme';

export function PracticeRecommendationRow({
  icon,
  title,
  subtitle,
  onPressRetry,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPressRetry: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon as any} size={17} color="#D6336C" />
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <Pressable onPress={onPressRetry} style={styles.retryBtn}>
        <Text style={styles.retryText}>Luyện lại</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 1 },
  title: { fontFamily: fontFamily.extraBold, fontSize: 12.5, color: colors.textPrimary },
  subtitle: { fontFamily: fontFamily.semiBold, fontSize: 10.5, color: colors.textMuted },
  retryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  retryText: { fontFamily: fontFamily.extraBold, fontSize: 11.5, color: colors.white },
});
