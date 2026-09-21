import { StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, spacing2 } from './theme';

// Figma (node-id=35:2700) chỉ còn tiêu đề "Xếp hạng" — bỏ streak/notification
// của bản cũ, giống MapHeader/PracticeHeader.
export function LeaderboardHeader() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title} numberOfLines={1}>
        Xếp hạng
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing2.md },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 24, lineHeight: 32, color: colors2.white },
});
