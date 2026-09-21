import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CloseXIcon } from './icons2';
import { colors2, fontFamily2, spacing2 } from './theme';

// Top bar dùng chung cho các màn "gọi khách" mới: Ôn tập (node-id=69:1392),
// Role-play (node-id=76:3536) và Kết quả (node-id=76:3940) — cùng 1 bố cục
// hệt nhau (tiêu đề lớn + dòng phụ tuỳ chọn + nút đóng; màn Kết quả không có
// dòng phụ). KHÔNG dùng chung components/QuizHeader.tsx vì component đó còn
// được 6 màn quản trị khác (PersonaEdit, LeaderboardFull, Admin,
// CreateCustomer, ContentManagement, ProductEdit) dùng nguyên trạng làm
// header "back + tiêu đề" chung, không liên quan — sửa nó sẽ làm vỡ layout
// các màn đó. `subtitle` nhận thẳng chuỗi đã format sẵn (vd "Chặng 1 • Level
// 1" hoặc "Luyện tập") thay vì tách riêng chapterNumber/levelPosition, để
// dùng được cho cả trường hợp Practice/khách tự tạo (không có chặng/level).
export function QuizTopBar({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle?: string;
  onClose?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      <Pressable onPress={onClose} hitSlop={8}>
        <CloseXIcon size={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: spacing2.md, padding: spacing2.md },
  content: { flex: 1, gap: 0 },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 24, lineHeight: 32, color: colors2.white },
  subtitle: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.whiteMuted },
});
