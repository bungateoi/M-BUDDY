import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LightbulbIcon, KeyboardVoiceIcon, PhoneCallIcon } from './icons2';
import { colors2, fontFamily2, spacing2 } from './theme';

const BUTTON_SIZE = 80;

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
  /** true khi "Mẹo cho bạn" đang hiện — Figma không thiết kế riêng trạng thái
   * này, viền vàng khi bật là suy luận hợp lý theo màu nhấn sẵn có của app. */
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
          <LightbulbIcon size={48} />
        </View>
        <Text style={styles.label}>Gợi ý</Text>
      </Pressable>

      <Pressable onPress={onMicPress} disabled={micDisabled} style={styles.item}>
        <View style={[styles.micBtn, isRecording && styles.micBtnRecording, micDisabled && styles.micBtnDisabled]}>
          <KeyboardVoiceIcon size={48} />
        </View>
        <Text style={styles.label}>{micLabel}</Text>
      </Pressable>

      <Pressable onPress={onPressEnd} style={styles.item}>
        <View style={styles.endBtn}>
          <View style={styles.endIconWrap}>
            <PhoneCallIcon size={48} />
          </View>
        </View>
        <Text style={styles.label}>Kết thúc</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: spacing2.xl },
  item: { alignItems: 'center', gap: spacing2.xs, width: BUTTON_SIZE },
  sideBtn: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: colors2.cardOptionIdle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideBtnActive: { borderWidth: 2, borderColor: colors2.yellow },
  micBtn: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: colors2.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnRecording: { borderWidth: 2, borderColor: colors2.white },
  micBtnDisabled: { opacity: 0.5 },
  endBtn: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: colors2.red500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endIconWrap: { transform: [{ rotate: '135deg' }] },
  label: { fontFamily: fontFamily2.semiBold, fontSize: 12, lineHeight: 16, color: colors2.white, textAlign: 'center' },
});
