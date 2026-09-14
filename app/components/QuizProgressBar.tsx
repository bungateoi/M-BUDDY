import { StyleSheet, View } from 'react-native';
import { ProgressCornerDecor } from './icons2';
import { colors2 } from './theme';

// Thiết kế mới (node-id=69:2253) đơn giản hơn hẳn bản cũ: KHÔNG còn phân
// biệt màu đúng/sai trên từng thanh — mỗi câu đã qua chỉ tô đặc 1 thanh
// vàng (tính dồn theo `current`), thanh hiện tại + các câu chưa tới vẫn đen.
// Đúng/sai của câu đã trả lời được thể hiện ở đáp án + banner phía dưới,
// không lặp lại ở đây nữa.
export function QuizProgressBar({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.wrap}>
      <ProgressCornerDecor />
      <View style={styles.track}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={[styles.segment, i < current ? styles.segmentFilled : styles.segmentUpcoming]} />
        ))}
      </View>
      <ProgressCornerDecor />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors2.black },
  track: { flex: 1, flexDirection: 'row', height: 16 },
  segment: { flex: 1, height: 16, borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.5)' },
  segmentFilled: { backgroundColor: colors2.yellow },
  segmentUpcoming: { backgroundColor: colors2.black },
});
