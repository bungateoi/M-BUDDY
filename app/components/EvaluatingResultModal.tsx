import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, radii2, spacing2, webPhoneFrameMaxWidth } from './theme';

// Popup hiện ngay khi cuộc gọi kết thúc, lúc backend đang chấm điểm — buổi
// chấm điểm giờ chạy NGẦM (xem lib/scoringJobs.ts), không còn chặn màn hình
// tới khi xong như trước. "Đợi": ở lại đây, tự chuyển sang màn Kết quả ngay
// khi có điểm (xem RolePlayScreen.tsx#subscribeToJob). "Xem sau": về Home
// ngay, việc chấm điểm + lưu XP/lịch sử vẫn tiếp tục chạy ngầm, xem lại ở
// Ôn tập (thẻ "Đang đánh giá", PracticeHistoryScreen). Không cho tắt bằng
// backdrop/nút back — bắt buộc chọn 1 trong 2 hướng đi.
export function EvaluatingResultModal({
  visible,
  waiting,
  onPressWait,
  onPressViewLater,
}: {
  visible: boolean;
  waiting: boolean;
  onPressWait: () => void;
  onPressViewLater: () => void;
}) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={() => {}}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Đang đánh giá kết quả</Text>
          <Text style={styles.message}>
            Buổi luyện tập của bạn đang được chấm điểm, có thể mất một chút thời gian. Bạn có thể chờ ở đây hoặc quay
            về sau — kết quả sẽ có ở mục Ôn tập ngay khi xong.
          </Text>

          {waiting ? (
            <View style={styles.waitingRow}>
              <ActivityIndicator color={colors2.white} />
              <Text style={styles.waitingText}>Đang chờ kết quả...</Text>
            </View>
          ) : (
            <View style={styles.row}>
              <Pressable style={[styles.btn, styles.laterBtn]} onPress={onPressViewLater}>
                <Text style={styles.laterText}>Xem sau</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.waitBtn]} onPress={onPressWait}>
                <Text style={styles.waitText}>Đợi</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing2.md,
  },
  card: {
    width: '100%',
    maxWidth: Math.min(340, webPhoneFrameMaxWidth - spacing2.md * 2),
    backgroundColor: colors2.black,
    borderRadius: radii2.card,
    padding: spacing2.md,
    gap: spacing2.xs,
  },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 16, color: colors2.white },
  message: { fontFamily: fontFamily2.regular, fontSize: 13, color: colors2.whiteMuted, lineHeight: 19 },
  row: { flexDirection: 'row', gap: spacing2.xs, marginTop: spacing2.md },
  btn: { flex: 1, borderRadius: radii2.pill, paddingVertical: 12, alignItems: 'center' },
  laterBtn: { backgroundColor: colors2.cardOptionIdle },
  laterText: { fontFamily: fontFamily2.semiBold, fontSize: 13.5, color: colors2.white },
  waitBtn: { backgroundColor: colors2.orange },
  waitText: { fontFamily: fontFamily2.semiBold, fontSize: 13.5, color: colors2.white },
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing2.xs,
    marginTop: spacing2.md,
    paddingVertical: 12,
  },
  waitingText: { fontFamily: fontFamily2.semiBold, fontSize: 13.5, color: colors2.white },
});
