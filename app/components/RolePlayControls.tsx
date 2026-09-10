import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { cardShadow, colors, fontFamily, primaryGradient, spacing } from './theme';

export function RolePlayControls({
  isRecording,
  micLabel,
  micDisabled,
  hintActive,
  onMicPress,
  onPressHint,
  onPressEnd,
}: {
  isRecording: boolean;
  micLabel: string;
  micDisabled?: boolean;
  /** true khi "Mẹo cho bạn" đang hiện — đổi màu nút Gợi ý để phản ánh trạng thái bật/tắt. */
  hintActive?: boolean;
  /** Bấm-để-bật/tắt (không phải giữ) — 1 lần bấm bắt đầu ghi âm, bấm lại để dừng. */
  onMicPress?: () => void;
  onPressHint?: () => void;
  onPressEnd?: () => void;
}) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onPressHint} style={styles.item}>
        <View style={[styles.sideBtn, hintActive && styles.sideBtnActive]}>
          <Ionicons name="bulb-outline" size={22} color={hintActive ? colors.white : colors.warning} />
        </View>
        <Text style={styles.label}>Gợi ý</Text>
      </Pressable>

      <Pressable onPress={onMicPress} disabled={micDisabled} style={styles.item}>
        <LinearGradient
          colors={primaryGradient.colors}
          start={primaryGradient.start}
          end={primaryGradient.end}
          style={[styles.micBtn, isRecording && styles.micBtnRecording, micDisabled && styles.micBtnDisabled]}
        >
          <Ionicons name={isRecording ? 'mic' : 'mic-outline'} size={30} color={colors.white} />
        </LinearGradient>
        <Text style={[styles.label, styles.micLabel]}>{micLabel}</Text>
      </Pressable>

      <Pressable onPress={onPressEnd} style={styles.item}>
        <View style={[styles.sideBtn, styles.endBtn]}>
          <Ionicons name="call" size={20} color={colors.white} style={styles.endIcon} />
        </View>
        <Text style={styles.label}>Kết thúc</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: spacing.xxl },
  item: { alignItems: 'center', gap: spacing.xs },
  sideBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  sideBtnActive: { backgroundColor: colors.warning },
  endBtn: { backgroundColor: colors.error },
  endIcon: { transform: [{ rotate: '135deg' }] },
  micBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C4460F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  micBtnRecording: { shadowOpacity: 0.55, shadowRadius: 22 },
  micBtnDisabled: { opacity: 0.5 },
  label: { fontFamily: fontFamily.semiBold, fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  micLabel: { maxWidth: 92 },
});
