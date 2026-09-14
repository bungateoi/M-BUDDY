import { StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, spacing2 } from './theme';

// Figma (node-id=101-1661) chỉ còn tiêu đề "Lịch sử luyện tập" — giống hệt
// pattern MapHeader/PracticeHeader/LeaderboardHeader.
export function PracticeHistoryHeader() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title} numberOfLines={1}>
        Lịch sử luyện tập
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing2.md },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 24, lineHeight: 32, color: colors2.white },
});
