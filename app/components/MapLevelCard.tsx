import { StyleSheet, Text, View } from 'react-native';
import { cardShadow, colors, fontFamily, radii, spacing } from './theme';
import type { LevelStatus } from '../data/types';

export function MapLevelCard({
  status,
  positionInChapter,
  productName,
  maxWidth,
}: {
  status: LevelStatus;
  positionInChapter: number;
  productName: string;
  maxWidth: number;
}) {
  if (status === 'locked') {
    return (
      <View style={[styles.card, styles.cardLocked, { maxWidth }]}>
        <Text style={styles.titleLocked}>Level {positionInChapter}</Text>
        <Text style={styles.subtitleLocked}>Sắp mở khoá</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, { maxWidth }]}>
      <Text style={styles.title} numberOfLines={2}>
        Level {positionInChapter} • {productName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.sm,
    ...cardShadow,
  },
  cardLocked: { backgroundColor: '#FFFFFFCC', shadowOpacity: 0.04 },
  title: { fontFamily: fontFamily.extraBold, fontSize: 12.5, color: colors.textPrimary, lineHeight: 16 },
  titleLocked: { fontFamily: fontFamily.extraBold, fontSize: 12.5, color: colors.textMuted },
  subtitleLocked: { fontFamily: fontFamily.semiBold, fontSize: 11, color: colors.textMuted, marginTop: 2 },
});
