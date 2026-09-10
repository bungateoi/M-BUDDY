import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavBar, ConfirmModal, QuizHeader, cardShadow, colors, fontFamily, radii, spacing } from '../components';
import { personas, products } from '../data';
import type { ProductObjection } from '../data/types';
import { saveProduct } from '../lib/contentData';
import { useAuth } from '../lib/AuthContext';
import { showAlert } from '../lib/platformAlert';
import { useAppNavigation } from '../navigation/NavigationContext';

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function ListEditor({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {values.map((v, i) => (
        <View key={i} style={styles.listRow}>
          <TextInput
            value={v}
            onChangeText={(text) => onChange(values.map((x, idx) => (idx === i ? text : x)))}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.listInput]}
            multiline
          />
          <Pressable onPress={() => onChange(values.filter((_, idx) => idx !== i))} hitSlop={8}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </Pressable>
        </View>
      ))}
      <Pressable style={styles.addLineBtn} onPress={() => onChange([...values, ''])}>
        <Ionicons name="add" size={16} color={colors.primary} />
        <Text style={styles.addLineText}>Thêm dòng</Text>
      </Pressable>
    </View>
  );
}

function ObjectionBankEditor({ value, onChange }: { value: ProductObjection[]; onChange: (next: ProductObjection[]) => void }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>Objection bank</Text>
      {value.map((o, i) => (
        <View key={i} style={styles.objectionCard}>
          <View style={styles.listRow}>
            <TextInput
              value={o.question}
              onChangeText={(text) => onChange(value.map((x, idx) => (idx === i ? { ...x, question: text } : x)))}
              placeholder="Câu hỏi/phản đối thường gặp"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, styles.listInput]}
              multiline
            />
            <Pressable onPress={() => onChange(value.filter((_, idx) => idx !== i))} hitSlop={8}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </Pressable>
          </View>
          <TextInput
            value={o.sampleAnswer}
            onChangeText={(text) => onChange(value.map((x, idx) => (idx === i ? { ...x, sampleAnswer: text } : x)))}
            placeholder="Câu trả lời mẫu"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.listInput]}
            multiline
          />
        </View>
      ))}
      <Pressable style={styles.addLineBtn} onPress={() => onChange([...value, { question: '', sampleAnswer: '' }])}>
        <Ionicons name="add" size={16} color={colors.primary} />
        <Text style={styles.addLineText}>Thêm phản đối</Text>
      </Pressable>
    </View>
  );
}

export function ProductEditScreen({ productId }: { productId?: string }) {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  const existing = useMemo(() => (productId ? products.find((p) => p.id === productId) : undefined), [productId]);
  const isNew = !productId;

  const [name, setName] = useState(existing?.name ?? '');
  const [shortName, setShortName] = useState(existing?.shortName ?? '');
  const [shortDescription, setShortDescription] = useState(existing?.shortDescription ?? '');
  const [targetAudience, setTargetAudience] = useState(existing?.targetAudience ?? '');
  const [benefits, setBenefits] = useState<string[]>(existing?.benefits ?? []);
  const [basicConditions, setBasicConditions] = useState(existing?.basicConditions ?? '');
  const [keySellingPoints, setKeySellingPoints] = useState<string[]>(existing?.keySellingPoints ?? []);
  const [objectionBank, setObjectionBank] = useState<ProductObjection[]>(existing?.objectionBank ?? []);
  const [complianceNote, setComplianceNote] = useState(existing?.complianceNote ?? '');
  const [hideAll, setHideAll] = useState(existing?.isHidden ?? false);
  const [hiddenChapters, setHiddenChapters] = useState<number[]>(existing?.hiddenChapterNumbers ?? []);
  const [applyToChapters, setApplyToChapters] = useState<number[]>([]);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleHiddenChapter = (chapterNumber: number) => {
    setHiddenChapters((prev) => (prev.includes(chapterNumber) ? prev.filter((n) => n !== chapterNumber) : [...prev, chapterNumber]));
  };
  const toggleApplyChapter = (chapterNumber: number) => {
    setApplyToChapters((prev) => (prev.includes(chapterNumber) ? prev.filter((n) => n !== chapterNumber) : [...prev, chapterNumber]));
  };

  const validate = (): string | null => {
    if (!name.trim()) return 'Thiếu tên sản phẩm.';
    if (!shortDescription.trim()) return 'Thiếu mô tả.';
    if (!targetAudience.trim()) return 'Thiếu đối tượng phù hợp.';
    if (!basicConditions.trim()) return 'Thiếu điều kiện cơ bản.';
    if (isNew && applyToChapters.length === 0) return 'Chọn ít nhất 1 chặng để áp dụng sản phẩm mới.';
    return null;
  };

  const handlePressSave = () => {
    const error = validate();
    if (error) {
      showAlert('Thiếu thông tin', error);
      return;
    }
    setConfirmVisible(true);
  };

  const handleConfirmSave = async () => {
    setSaving(true);
    try {
      await saveProduct({
        id: existing?.id ?? (slugify(name) || `sp-${Date.now()}`),
        isNew,
        name: name.trim(),
        shortName: shortName.trim() || undefined,
        shortDescription: shortDescription.trim(),
        targetAudience: targetAudience.trim(),
        benefits: benefits.map((b) => b.trim()).filter(Boolean),
        basicConditions: basicConditions.trim(),
        keySellingPoints: keySellingPoints.map((k) => k.trim()).filter(Boolean),
        objectionBank: objectionBank.filter((o) => o.question.trim() && o.sampleAnswer.trim()),
        complianceNote: complianceNote.trim() || undefined,
        isHidden: hideAll,
        hiddenChapterNumbers: hiddenChapters,
        applyToChapterNumbers: isNew ? applyToChapters : undefined,
      });
      setConfirmVisible(false);
      showAlert('Đã lưu', 'Đã sinh lại câu hỏi trắc nghiệm + kịch bản role-play cho các bài liên quan.');
      navigate('contentManagement');
    } catch (e) {
      setConfirmVisible(false);
      showAlert('Lỗi', e instanceof Error ? e.message : 'Không lưu được, thử lại nhé.');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <QuizHeader
        title={isNew ? 'Thêm sản phẩm mới' : 'Sửa sản phẩm'}
        subtitle={isNew ? 'Sinh sẵn quiz + kịch bản cho chặng đã chọn' : `Sinh lại quiz + kịch bản khi lưu`}
        streakDays={profile.currentStreak}
        onBack={() => navigate('contentManagement')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.field}>
          <Text style={styles.label}>Tên sản phẩm</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Tiết kiệm online" placeholderTextColor={colors.textMuted} style={styles.input} />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Tên rút gọn (tuỳ chọn)</Text>
          <TextInput value={shortName} onChangeText={setShortName} placeholder="Dùng cho node trên Map" placeholderTextColor={colors.textMuted} style={styles.input} />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Mô tả</Text>
          <TextInput value={shortDescription} onChangeText={setShortDescription} placeholderTextColor={colors.textMuted} style={[styles.input, styles.multiline]} multiline />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Đối tượng phù hợp</Text>
          <TextInput value={targetAudience} onChangeText={setTargetAudience} placeholderTextColor={colors.textMuted} style={[styles.input, styles.multiline]} multiline />
        </View>

        <ListEditor label="Lợi ích chính" values={benefits} onChange={setBenefits} placeholder="Lợi ích..." />

        <View style={styles.field}>
          <Text style={styles.label}>Điều kiện cơ bản</Text>
          <TextInput value={basicConditions} onChangeText={setBasicConditions} placeholderTextColor={colors.textMuted} style={[styles.input, styles.multiline]} multiline />
        </View>

        <ListEditor label="Key selling points" values={keySellingPoints} onChange={setKeySellingPoints} placeholder="Điểm bán chính..." />

        <ObjectionBankEditor value={objectionBank} onChange={setObjectionBank} />

        <View style={styles.field}>
          <Text style={styles.label}>Ghi chú compliance (tuỳ chọn)</Text>
          <TextInput value={complianceNote} onChangeText={setComplianceNote} placeholderTextColor={colors.textMuted} style={[styles.input, styles.multiline]} multiline />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Ẩn sản phẩm</Text>
          <Pressable style={styles.checkRow} onPress={() => setHideAll((v) => !v)}>
            <Ionicons name={hideAll ? 'checkbox' : 'square-outline'} size={20} color={colors.primary} />
            <Text style={styles.checkLabel}>Ẩn toàn bộ (mọi chặng)</Text>
          </Pressable>
          {!hideAll && (
            <>
              <Text style={styles.helperText}>Hoặc ẩn riêng 1 số chặng:</Text>
              <View style={styles.chipWrap}>
                {[...personas]
                  .sort((a, b) => a.chapterNumber - b.chapterNumber)
                  .map((p) => {
                    const checked = hiddenChapters.includes(p.chapterNumber);
                    return (
                      <Pressable key={p.id} style={[styles.chip, checked && styles.chipChecked]} onPress={() => toggleHiddenChapter(p.chapterNumber)}>
                        <Text style={[styles.chipText, checked && styles.chipTextChecked]}>Chặng {p.chapterNumber}</Text>
                      </Pressable>
                    );
                  })}
              </View>
            </>
          )}
        </View>

        {isNew && (
          <View style={styles.field}>
            <Text style={styles.label}>Áp dụng cho chặng nào</Text>
            <Text style={styles.helperText}>Chọn chặng sẽ có bài học (level) cho sản phẩm mới này.</Text>
            <View style={styles.chipWrap}>
              {[...personas]
                .sort((a, b) => a.chapterNumber - b.chapterNumber)
                .map((p) => {
                  const checked = applyToChapters.includes(p.chapterNumber);
                  return (
                    <Pressable key={p.id} style={[styles.chip, checked && styles.chipChecked]} onPress={() => toggleApplyChapter(p.chapterNumber)}>
                      <Text style={[styles.chipText, checked && styles.chipTextChecked]}>Chặng {p.chapterNumber} — {p.name}</Text>
                    </Pressable>
                  );
                })}
            </View>
          </View>
        )}

        <Pressable style={styles.saveBtn} onPress={handlePressSave}>
          <Text style={styles.saveBtnText}>Lưu</Text>
        </Pressable>
      </ScrollView>

      <BottomNavBar
        active="toi"
        onPressItem={(key) => {
          if (key === 'home') navigate('home');
          if (key === 'map') navigate('map');
          if (key === 'practice') navigate('practice');
          if (key === 'xephang') navigate('leaderboard');
          if (key === 'ontap') navigate('practiceHistory');
        }}
      />

      <ConfirmModal
        visible={confirmVisible}
        title="Xác nhận thông tin"
        message="Xác nhận thông tin đã chính xác? Hệ thống sẽ sinh lại câu hỏi trắc nghiệm + kịch bản role-play cho các bài liên quan — có thể mất chút thời gian."
        loading={saving}
        onConfirm={handleConfirmSave}
        onCancel={() => setConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxl },
  field: { gap: spacing.sm },
  label: { fontFamily: fontFamily.bold, fontSize: 13, color: colors.textPrimary },
  helperText: { fontFamily: fontFamily.semiBold, fontSize: 11.5, color: colors.textMuted },
  input: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: '#F1E7E0',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  multiline: { minHeight: 70, textAlignVertical: 'top' },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  listInput: { flex: 1 },
  addLineBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingVertical: 4 },
  addLineText: { fontFamily: fontFamily.bold, fontSize: 12.5, color: colors.primary },
  objectionCard: { backgroundColor: colors.white, borderRadius: radii.md, padding: spacing.sm, gap: spacing.sm, ...cardShadow },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  checkLabel: { fontFamily: fontFamily.semiBold, fontSize: 13.5, color: colors.textPrimary },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    borderWidth: 1.5,
    borderColor: '#F1E7E0',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  chipChecked: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  chipText: { fontFamily: fontFamily.semiBold, fontSize: 12, color: colors.textPrimary },
  chipTextChecked: { color: colors.primary, fontFamily: fontFamily.extraBold },
  saveBtn: { backgroundColor: colors.primary, borderRadius: radii.pill, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  saveBtnText: { fontFamily: fontFamily.extraBold, fontSize: 14.5, color: colors.white },
});
