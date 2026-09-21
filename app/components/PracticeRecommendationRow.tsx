import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

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
        <Ionicons name={icon as any} size={17} color={colors2.orange} />
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
    gap: spacing2.xs,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    padding: spacing2.xs,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors2.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 1 },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 12.5, color: colors2.white },
  subtitle: { fontFamily: fontFamily2.regular, fontSize: 10.5, color: colors2.whiteMuted },
  retryBtn: {
    backgroundColor: colors2.orange,
    borderRadius: radii2.pill,
    paddingHorizontal: spacing2.md,
    paddingVertical: 8,
  },
  retryText: { fontFamily: fontFamily2.semiBold, fontSize: 11.5, color: colors2.white },
});
