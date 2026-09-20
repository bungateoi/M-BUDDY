import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors2, fontFamily2, radii2, spacing2, webPhoneFrameMaxWidth } from './theme';

export interface TeamSortCriterionOption {
  id: string;
  label: string;
}

// Bottom sheet "Sắp xếp" cho màn Phân tích đội nhóm (node-id=161-17398) —
// khác SimpleSelectModal (chọn 1 tiêu chí, áp dụng ngay) ở chỗ gộp CẢ tiêu
// chí lẫn chiều sắp xếp trong 1 sheet, chỉ áp dụng khi bấm "Hoàn thành" —
// nên cần state nháp riêng, reset lại đúng giá trị đang áp dụng mỗi lần mở.
// Nhãn chiều sắp xếp đổi theo tiêu chí đang chọn TRONG sheet (nháp, chưa cần
// bấm Hoàn thành): "Tên thành viên" -> A-Z/Z-A, còn lại (điểm số) -> cao-thấp.
export function TeamSortModal({
  visible,
  criteriaOptions,
  nameCriterionId,
  criterion,
  direction,
  onApply,
  onClose,
}: {
  visible: boolean;
  criteriaOptions: TeamSortCriterionOption[];
  nameCriterionId: string;
  criterion: string;
  direction: 'asc' | 'desc';
  onApply: (criterion: string, direction: 'asc' | 'desc') => void;
  onClose: () => void;
}) {
  const [draftCriterion, setDraftCriterion] = useState(criterion);
  const [draftDirection, setDraftDirection] = useState(direction);

  useEffect(() => {
    if (visible) {
      setDraftCriterion(criterion);
      setDraftDirection(direction);
    }
  }, [visible, criterion, direction]);

  const isName = draftCriterion === nameCriterionId;
  const directionOptions: TeamSortCriterionOption[] = isName
    ? [
        { id: 'asc', label: 'Từ A đến Z' },
        { id: 'desc', label: 'Từ Z đến A' },
      ]
    : [
        { id: 'desc', label: 'Từ cao đến thấp' },
        { id: 'asc', label: 'Từ thấp đến cao' },
      ];

  const handleApply = () => {
    onApply(draftCriterion, draftDirection);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropDismiss} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.topBar}>
            <Text style={styles.title}>Sắp xếp</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={24} color={colors2.white} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tiêu chí</Text>
              {criteriaOptions.map((opt) => {
                const selected = opt.id === draftCriterion;
                return (
                  <Pressable key={opt.id} style={styles.option} onPress={() => setDraftCriterion(opt.id)}>
                    <Ionicons
                      name={selected ? 'radio-button-on' : 'radio-button-off'}
                      size={24}
                      color={selected ? colors2.orange : colors2.whiteMuted}
                    />
                    <Text style={styles.optionText}>{opt.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sắp xếp theo</Text>
              {directionOptions.map((opt) => {
                const selected = opt.id === draftDirection;
                return (
                  <Pressable
                    key={opt.id}
                    style={styles.option}
                    onPress={() => setDraftDirection(opt.id as 'asc' | 'desc')}
                  >
                    <Ionicons
                      name={selected ? 'radio-button-on' : 'radio-button-off'}
                      size={24}
                      color={selected ? colors2.orange : colors2.whiteMuted}
                    />
                    <Text style={styles.optionText}>{opt.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.bottomBar}>
            <Pressable style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyText}>Hoàn thành</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end', alignItems: 'center' },
  backdropDismiss: { ...StyleSheet.absoluteFill },
  sheet: {
    width: '100%',
    maxWidth: webPhoneFrameMaxWidth,
    maxHeight: '85%',
    backgroundColor: colors2.cardOptionIdle,
    borderTopLeftRadius: radii2.navTop,
    borderTopRightRadius: radii2.navTop,
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing2.md,
  },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 24, lineHeight: 32, color: colors2.white },
  body: { backgroundColor: colors2.black },
  bodyContent: { padding: spacing2.md, gap: spacing2.md },
  section: {
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    padding: spacing2.md,
    gap: spacing2.md,
  },
  sectionTitle: { fontFamily: fontFamily2.semiBold, fontSize: 16, lineHeight: 24, color: colors2.white },
  option: { flexDirection: 'row', alignItems: 'center', gap: spacing2.xs },
  optionText: { flex: 1, fontFamily: fontFamily2.regular, fontSize: 14, lineHeight: 20, color: colors2.white },
  bottomBar: { backgroundColor: colors2.cardOptionIdle, padding: spacing2.md },
  applyBtn: {
    backgroundColor: colors2.yellow,
    borderRadius: radii2.button,
    paddingVertical: spacing2.xs,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors2.shadowOrange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  applyText: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.black },
});
