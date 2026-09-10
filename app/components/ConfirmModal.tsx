import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radii, spacing, webPhoneFrameMaxWidth } from './theme';

/** Modal xác nhận 2 nút (Huỷ / Xác nhận) — dùng trước 1 thao tác chậm/khó
 * hoàn tác, vd "Quản trị hành trình & tri thức" xác nhận trước khi sinh lại
 * nội dung bằng AI. Alert.alert 2 nút không dùng được vì react-native-web
 * là no-op hoàn toàn trên web (xem lib/platformAlert.ts). */
export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Huỷ',
  loading = false,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropDismiss} onPress={loading ? undefined : onCancel} />
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.row}>
            <Pressable style={[styles.btn, styles.cancelBtn]} onPress={onCancel} disabled={loading}>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.confirmBtn]} onPress={onConfirm} disabled={loading}>
              {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.confirmText}>{confirmLabel}</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  backdropDismiss: { ...StyleSheet.absoluteFill },
  card: {
    width: '100%',
    maxWidth: Math.min(340, webPhoneFrameMaxWidth - spacing.xl * 2),
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  title: { fontFamily: fontFamily.extraBold, fontSize: 16, color: colors.textPrimary },
  message: { fontFamily: fontFamily.semiBold, fontSize: 13, color: colors.textMuted, lineHeight: 19 },
  row: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  btn: { flex: 1, borderRadius: radii.pill, paddingVertical: 12, alignItems: 'center' },
  cancelBtn: { backgroundColor: colors.background },
  cancelText: { fontFamily: fontFamily.extraBold, fontSize: 13.5, color: colors.textPrimary },
  confirmBtn: { backgroundColor: colors.primary },
  confirmText: { fontFamily: fontFamily.extraBold, fontSize: 13.5, color: colors.white },
});
