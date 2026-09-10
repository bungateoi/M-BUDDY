import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, radii, spacing, webPhoneFrameMaxWidth } from './theme';

export interface SimpleSelectOption {
  id: string;
  label: string;
}

export function SimpleSelectModal({
  visible,
  title,
  options,
  selectedId,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: SimpleSelectOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropDismiss} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textPrimary} />
            </Pressable>
          </View>
          <ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            {options.map((option) => {
              const selected = option.id === selectedId;
              return (
                <Pressable
                  key={option.id}
                  style={[styles.option, selected && styles.optionSelected]}
                  onPress={() => {
                    onSelect(option.id);
                    onClose();
                  }}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option.label}</Text>
                  {selected && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

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
    maxHeight: '70%',
    paddingBottom: spacing.lg,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetScroll: { paddingHorizontal: spacing.lg },
  sheetContent: { paddingTop: spacing.sm, paddingBottom: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  optionSelected: { backgroundColor: colors.primaryLight },
  optionText: { fontFamily: fontFamily.semiBold, fontSize: 14, color: colors.textPrimary },
  optionTextSelected: { fontFamily: fontFamily.extraBold, color: colors.primary },
});
