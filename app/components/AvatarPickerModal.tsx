import { ActivityIndicator, Image, Modal, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, radii, spacing, webPhoneFrameMaxWidth } from './theme';

export interface AvatarOption {
  key: string;
  source: ImageSourcePropType;
}

export function AvatarPickerModal({
  visible,
  options,
  selectedKey,
  saving,
  onSelect,
  onClose,
}: {
  visible: boolean;
  options: AvatarOption[];
  selectedKey: string;
  saving?: boolean;
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropDismiss} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Chọn ảnh đại diện</Text>
            <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textPrimary} />
            </Pressable>
          </View>

          <View style={styles.grid}>
            {options.map((option) => {
              const selected = option.key === selectedKey;
              return (
                <Pressable
                  key={option.key}
                  disabled={saving}
                  onPress={() => onSelect(option.key)}
                  style={styles.cell}
                >
                  <View style={[styles.avatarRing, selected && styles.avatarRingSelected]}>
                    <Image source={option.source} style={styles.avatarImg} />
                    {selected && (
                      <View style={styles.checkBadge}>
                        {saving ? (
                          <ActivityIndicator size="small" color={colors.white} />
                        ) : (
                          <Ionicons name="checkmark" size={12} color={colors.white} />
                        )}
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const AVATAR_SIZE = 76;

const styles = StyleSheet.create({
  // alignItems:'center' + sheet có width/maxWidth — trên web, Modal portal
  // thẳng ra document.body (ngoài khung "phản chiếu điện thoại" bọc quanh
  // phần còn lại của app, xem App.tsx#WebPhoneFrame) nên nếu không giới hạn,
  // sheet sẽ kéo giãn full chiều rộng desktop thay vì thẳng hàng với khung.
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end', alignItems: 'center' },
  backdropDismiss: { ...StyleSheet.absoluteFill },
  sheet: {
    width: '100%',
    maxWidth: webPhoneFrameMaxWidth,
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingBottom: spacing.xl,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1E7E0',
  },
  sheetTitle: { fontFamily: fontFamily.extraBold, fontSize: 16, color: colors.textPrimary },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  cell: { alignItems: 'center' },
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRingSelected: { borderColor: colors.primary },
  avatarImg: { width: AVATAR_SIZE - 8, height: AVATAR_SIZE - 8, borderRadius: (AVATAR_SIZE - 8) / 2 },
  checkBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
