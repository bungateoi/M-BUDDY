import { StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, spacing2 } from './theme';

// Figma (node-id=35:2188) chỉ còn tiêu đề "Luyện tập" trên nền xanh — bỏ
// streak badge/mascot của bản cũ, giống MapHeader.tsx.
export function PracticeHeader() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title} numberOfLines={1}>
        Luyện tập
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing2.md },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 24, lineHeight: 32, color: colors2.white },
});
