import { Image, StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';

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
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing2.xs },
  bubble: {
    flex: 1,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    borderBottomRightRadius: 4,
    padding: spacing2.md,
    gap: 2,
  },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 12, color: colors2.orange },
  message: { fontFamily: fontFamily2.semiBold, fontSize: 12.5, color: colors2.white, lineHeight: 18 },
  mascot: { width: 52, height: 60 },
});
