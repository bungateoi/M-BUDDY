import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomNavBar, ConfirmModal, QuizHeader, colors, fontFamily, radii, spacing } from '../components';
import { personas, products } from '../data';
import type { PersonaCriteria } from '../data/types';
import { savePersona } from '../lib/contentData';
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

const EMPTY_CRITERIA: PersonaCriteria = {
  age: '',
  occupation: '',
  incomeLevel: '',
  needs: '',
  painPoints: '',
  expectations: '',
  barriers: '',
};

const CRITERIA_FIELDS: { key: keyof PersonaCriteria; label: string }[] = [
  { key: 'age', label: 'Độ tuổi' },
  { key: 'occupation', label: 'Nghề nghiệp' },
  { key: 'incomeLevel', label: 'Mức thu nhập' },
  { key: 'needs', label: 'Nhu cầu chính' },
  { key: 'painPoints', label: 'Pain points' },
  { key: 'expectations', label: 'Kỳ vọng khi được tư vấn' },
  { key: 'barriers', label: 'Rào cản khi quyết định' },
];

export function PersonaEditScreen({ personaId }: { personaId?: string }) {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  const existing = useMemo(() => (personaId ? personas.find((p) => p.id === personaId) : undefined), [personaId]);
  const isNew = !personaId;

  const [name, setName] = useState(existing?.name ?? '');
  const [starRating, setStarRating] = useState(String(existing?.starRating ?? 1));
  const [criteria, setCriteria] = useState<PersonaCriteria>(existing?.criteria ?? EMPTY_CRITERIA);
  const [behaviorNote, setBehaviorNote] = useState(existing?.behaviorNote ?? '');
  const [generalTactic, setGeneralTactic] = useState(existing?.generalTactic ?? '');
  const [winCondition, setWinCondition] = useState(existing?.winCondition ?? '');
  const [recommendedProductId, setRecommendedProductId] = useState(existing?.recommendedProductId ?? '');
  const [isHidden, setIsHidden] = useState(existing?.isHidden ?? false);
  const [applyToProducts, setApplyToProducts] = useState<string[]>([]);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const setCriteriaField = (key: keyof PersonaCriteria, value: string) => setCriteria((prev) => ({ ...prev, [key]: value }));

  const toggleApplyProduct = (productId: string) => {
    setApplyToProducts((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };

  const validate = (): string | null => {
    if (!name.trim()) return 'Thiếu tên chặng.';
    if (!behaviorNote.trim()) return 'Thiếu "Cách phản ứng trong role-play".';
    if (!generalTactic.trim()) return 'Thiếu chiến thuật chung.';
    if (!winCondition.trim()) return 'Thiếu "Chiến thắng của nhân viên sales".';
    if (isNew && applyToProducts.length === 0) return 'Chọn ít nhất 1 sản phẩm để áp dụng chặng mới.';
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
      await savePersona({
        id: existing?.id ?? (slugify(name) || `chang-${Date.now()}`),
        isNew,
        name: name.trim(),
        starRating: Number(starRating) || 1,
        criteria,
        behaviorNote: behaviorNote.trim(),
        generalTactic: generalTactic.trim(),
        winCondition: winCondition.trim(),
        recommendedProductId: recommendedProductId || undefined,
        isHidden,
        applyToProductIds: isNew ? applyToProducts : undefined,
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
        title={isNew ? 'Thêm chặng mới' : 'Sửa chặng'}
        subtitle={isNew ? 'Sinh sẵn quiz + kịch bản cho sản phẩm đã chọn' : 'Sinh lại kịch bản khi lưu'}
        streakDays={profile.currentStreak}
        onBack={() => navigate('contentManagement')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.field}>
          <Text style={styles.label}>Tên chặng</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Nội trợ tiết kiệm" placeholderTextColor={colors.textMuted} style={styles.input} />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Số sao (độ khó, 1-5)</Text>
          <TextInput value={starRating} onChangeText={setStarRating} keyboardType="number-pad" placeholderTextColor={colors.textMuted} style={styles.input} />
        </View>

        {CRITERIA_FIELDS.map((f) => (
          <View key={f.key} style={styles.field}>
            <Text style={styles.label}>{f.label}</Text>
            <TextInput
              value={criteria[f.key]}
              onChangeText={(text) => setCriteriaField(f.key, text)}
              placeholderTextColor={colors.textMuted}
              style={[styles.input, styles.multiline]}
              multiline
            />
          </View>
        ))}

        <View style={styles.field}>
          <Text style={styles.label}>Cách phản ứng trong role-play</Text>
          <TextInput value={behaviorNote} onChangeText={setBehaviorNote} placeholderTextColor={colors.textMuted} style={[styles.input, styles.multiline]} multiline />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Chiến thuật chung nên dùng</Text>
          <TextInput value={generalTactic} onChangeText={setGeneralTactic} placeholderTextColor={colors.textMuted} style={[styles.input, styles.multiline]} multiline />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>"Chiến thắng" của nhân viên sales</Text>
          <TextInput value={winCondition} onChangeText={setWinCondition} placeholderTextColor={colors.textMuted} style={[styles.input, styles.multiline]} multiline />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Sản phẩm gợi ý phù hợp nhất</Text>
          <View style={styles.chipWrap}>
            {products.map((p) => {
              const checked = recommendedProductId === p.id;
              return (
                <Pressable key={p.id} style={[styles.chip, checked && styles.chipChecked]} onPress={() => setRecommendedProductId(p.id)}>
                  <Text style={[styles.chipText, checked && styles.chipTextChecked]}>{p.shortName ?? p.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <Pressable style={styles.checkRow} onPress={() => setIsHidden((v) => !v)}>
            <Ionicons name={isHidden ? 'checkbox' : 'square-outline'} size={20} color={colors.primary} />
            <Text style={styles.checkLabel}>Ẩn chặng này khỏi màn Map</Text>
          </Pressable>
        </View>

        {isNew && (
          <View style={styles.field}>
            <Text style={styles.label}>Áp dụng cho sản phẩm nào</Text>
            <Text style={styles.helperText}>Chọn sản phẩm sẽ có bài học (level) cho chặng mới này.</Text>
            <View style={styles.chipWrap}>
              {products.map((p) => {
                const checked = applyToProducts.includes(p.id);
                return (
                  <Pressable key={p.id} style={[styles.chip, checked && styles.chipChecked]} onPress={() => toggleApplyProduct(p.id)}>
                    <Text style={[styles.chipText, checked && styles.chipTextChecked]}>{p.shortName ?? p.name}</Text>
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
  multiline: { minHeight: 56, textAlignVertical: 'top' },
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
