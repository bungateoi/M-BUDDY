import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, radii, spacing, webPhoneFrameMaxWidth } from './theme';
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
              placeholderTextColor={colors.textMuted}
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
              <Ionicons name="close" size={20} color={colors.textPrimary} />
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
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    maxHeight: '82%',
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
  sheetScroll: { paddingHorizontal: spacing.xl },
  sheetContent: { paddingTop: spacing.md, paddingBottom: spacing.md, gap: spacing.lg },
  fieldWrap: { gap: spacing.sm },
  fieldLabel: { fontFamily: fontFamily.extraBold, fontSize: 13.5, color: colors.primary },
  group: { gap: 6 },
  groupHeading: { fontFamily: fontFamily.bold, fontSize: 11.5, color: colors.textMuted, marginTop: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: '#F1E7E0',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.textPrimary },
  chipTextSelected: { color: colors.white, fontFamily: fontFamily.bold },
  customInput: {
    borderWidth: 1.5,
    borderColor: '#F1E7E0',
    borderRadius: radii.md,
    padding: spacing.sm,
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
    color: colors.textPrimary,
    minHeight: 40,
  },
  doneButton: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  doneButtonText: { fontFamily: fontFamily.extraBold, fontSize: 14, color: colors.white },
});
