import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors2, fontFamily2, radii2, spacing2, webPhoneFrameMaxWidth } from './theme';
import type { PersonaBuilderField } from '../data/personaBuilderOptions';
import type { PersonaFieldAnswer } from '../data/types';

export const CUSTOM_CHIP_LABEL = 'Khác — tự nhập';

function OptionChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function FieldPicker({
  field,
  answer,
  onChange,
}: {
  field: PersonaBuilderField;
  answer: PersonaFieldAnswer;
  onChange: (answer: PersonaFieldAnswer) => void;
}) {
  const isCustomActive = answer.custom.trim().length > 0 || answer.selected.includes(CUSTOM_CHIP_LABEL);

  const toggleOption = (option: string) => {
    if (field.selectionType === 'single') {
      onChange({ selected: [option], custom: '' });
      return;
    }
    const selected = answer.selected.includes(option)
      ? answer.selected.filter((o) => o !== option)
      : [...answer.selected, option];
    onChange({ ...answer, selected });
  };

  const toggleCustom = () => {
    if (isCustomActive) {
      onChange(field.selectionType === 'single' ? { selected: [], custom: '' } : { ...answer, custom: '' });
    } else {
      onChange(
        field.selectionType === 'single' ? { selected: [CUSTOM_CHIP_LABEL], custom: answer.custom } : { ...answer, custom: answer.custom || ' ' }
      );
    }
  };

  return (
    <View style={styles.fieldWrap}>
      {field.fieldLabel && <Text style={styles.fieldLabel}>{field.fieldLabel}</Text>}
      {field.groups.map((group, gi) => (
        <View key={gi} style={styles.group}>
          {group.heading && <Text style={styles.groupHeading}>{group.heading}</Text>}
          <View style={styles.chipRow}>
            {group.options.map((option) => (
              <OptionChip
                key={option}
                label={option}
                selected={answer.selected.includes(option)}
                onPress={() => toggleOption(option)}
              />
            ))}
          </View>
        </View>
      ))}
      {field.allowCustom && (
        <View style={styles.group}>
          <View style={styles.chipRow}>
            <OptionChip label={CUSTOM_CHIP_LABEL} selected={isCustomActive} onPress={toggleCustom} />
          </View>
          {isCustomActive && (
            <TextInput
              value={answer.custom.trim()}
              onChangeText={(text) => onChange({ selected: field.selectionType === 'single' ? [] : answer.selected, custom: text })}
              placeholder="Nhập nội dung..."
              placeholderTextColor={colors2.whiteMuted}
              style={styles.customInput}
              multiline
            />
          )}
        </View>
      )}
    </View>
  );
}

export function CriterionPickerModal({
  visible,
  title,
  fields,
  answers,
  onChangeField,
  onClose,
}: {
  visible: boolean;
  title: string;
  fields: PersonaBuilderField[];
  answers: Record<string, PersonaFieldAnswer>;
  onChangeField: (fieldKey: string, answer: PersonaFieldAnswer) => void;
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
              <Ionicons name="close" size={20} color={colors2.white} />
            </Pressable>
          </View>
          <ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            {fields.map((field) => (
              <FieldPicker
                key={field.key}
                field={field}
                answer={answers[field.key] ?? { selected: [], custom: '' }}
                onChange={(answer) => onChangeField(field.key, answer)}
              />
            ))}
          </ScrollView>
          <Pressable onPress={onClose} style={styles.doneButton}>
            <Text style={styles.doneButtonText}>Xong</Text>
          </Pressable>
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
    backgroundColor: colors2.black,
    borderTopLeftRadius: radii2.navTop,
    borderTopRightRadius: radii2.navTop,
    maxHeight: '82%',
    paddingBottom: spacing2.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing2.md,
    paddingTop: spacing2.lg,
    paddingBottom: spacing2.md,
  },
  sheetTitle: { fontFamily: fontFamily2.semiBold, fontSize: 16, color: colors2.white },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors2.cardOptionIdle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetScroll: { paddingHorizontal: spacing2.md },
  sheetContent: { paddingTop: spacing2.md, paddingBottom: spacing2.md, gap: spacing2.lg },
  fieldWrap: { gap: spacing2.xs },
  fieldLabel: { fontFamily: fontFamily2.semiBold, fontSize: 13.5, color: colors2.orange },
  group: { gap: 6 },
  groupHeading: { fontFamily: fontFamily2.semiBold, fontSize: 11.5, color: colors2.whiteMuted, marginTop: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: radii2.pill,
    backgroundColor: colors2.cardOptionIdle,
    paddingHorizontal: spacing2.md,
    paddingVertical: 8,
  },
  chipSelected: { backgroundColor: colors2.orange },
  chipText: { fontFamily: fontFamily2.semiBold, fontSize: 12.5, color: colors2.white },
  chipTextSelected: { color: colors2.white, fontFamily: fontFamily2.semiBold },
  customInput: {
    borderRadius: radii2.card,
    backgroundColor: colors2.cardOptionIdle,
    padding: spacing2.xs,
    fontFamily: fontFamily2.semiBold,
    fontSize: 13,
    color: colors2.white,
    minHeight: 40,
  },
  doneButton: {
    marginHorizontal: spacing2.md,
    marginTop: spacing2.xs,
    backgroundColor: colors2.orange,
    borderRadius: radii2.pill,
    paddingVertical: spacing2.md,
    alignItems: 'center',
  },
  doneButtonText: { fontFamily: fontFamily2.semiBold, fontSize: 14, color: colors2.white },
});
