import { StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, spacing2 } from './theme';

// Figma (node-id=30:1819) chỉ còn tiêu đề trên nền xanh — bỏ nút back/
// streak badge/mascot của bản cũ vì đã có "Trang chủ" ở thanh menu dưới để
// quay lại Home, không cần nút back riêng nữa.
export function MapHeader({ title }: { title: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing2.md },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 24, lineHeight: 32, color: colors2.white },
});
