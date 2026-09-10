import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radii, spacing } from './theme';

const studyingMascot = require('../assets/mascot-studying.png');

export function BuddySuggestionBubble({ message }: { message: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.bubble}>
        <Text style={styles.title}>Buddy gợi ý</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <Image source={studyingMascot} style={styles.mascot} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  bubble: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderBottomRightRadius: 4,
    padding: spacing.md,
    gap: 2,
  },
  title: { fontFamily: fontFamily.extraBold, fontSize: 12, color: colors.primary },
  message: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.textPrimary, lineHeight: 18 },
  mascot: { width: 52, height: 60 },
});
