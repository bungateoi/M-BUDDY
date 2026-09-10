import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  QuizHeader,
  SimpleSelectModal,
  BottomNavBar,
  cardShadow,
  colors,
  fontFamily,
  radii,
  spacing,
  webPhoneFrameMaxWidth,
  type SimpleSelectOption,
} from '../components';
import { fetchAllProfiles, setMemberManager, setMemberProfile, setMemberRole } from '../lib/authData';
import { useAuth } from '../lib/AuthContext';
import type { AdminMemberRow, UserRole } from '../data/types';
import { useAppNavigation } from '../navigation/NavigationContext';

const ROLE_LABEL: Record<UserRole, string> = { employee: 'Nhân viên', manager: 'Trưởng nhóm', admin: 'Admin' };
const ROLE_COLOR: Record<UserRole, string> = { employee: colors.textMuted, manager: colors.primary, admin: '#7C4DFF' };
const ROLE_OPTIONS: SimpleSelectOption[] = [
  { id: 'employee', label: 'Nhân viên' },
  { id: 'manager', label: 'Trưởng nhóm' },
  { id: 'admin', label: 'Admin' },
];
const NO_MANAGER_ID = '__none__';

export function AdminScreen() {
  const { navigate } = useAppNavigation();
  const { profile } = useAuth();
  const [members, setMembers] = useState<AdminMemberRow[] | null>(null);
  const [query, setQuery] = useState('');
  const [roleEditId, setRoleEditId] = useState<string | null>(null);
  const [managerEditId, setManagerEditId] = useState<string | null>(null);
  const [profileEditId, setProfileEditId] = useState<string | null>(null);
  const [draftFullName, setDraftFullName] = useState('');
  const [draftJobTitle, setDraftJobTitle] = useState('');
  const [draftBranch, setDraftBranch] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadMembers = useCallback(() => {
    fetchAllProfiles()
      .then(setMembers)
      .catch(() => setMembers([]));
  }, []);

  useEffect(loadMembers, [loadMembers]);

  const managerOptions: SimpleSelectOption[] = useMemo(() => {
    const managers = (members ?? []).filter((m) => m.role === 'manager');
    return [{ id: NO_MANAGER_ID, label: 'Không có' }, ...managers.map((m) => ({ id: m.id, label: m.fullName }))];
  }, [members]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members ?? [];
    return (members ?? []).filter((m) => m.fullName.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
  }, [members, query]);

  const managerNameById = useMemo(() => {
    const map = new Map<string, string>();
    (members ?? []).forEach((m) => map.set(m.id, m.fullName));
    return map;
  }, [members]);

  const handleSetRole = async (userId: string, role: string) => {
    setSavingId(userId);
    try {
      await setMemberRole(userId, role as UserRole);
      loadMembers();
    } finally {
      setSavingId(null);
    }
  };

  const handleSetManager = async (userId: string, managerId: string) => {
    setSavingId(userId);
    try {
      await setMemberManager(userId, managerId === NO_MANAGER_ID ? null : managerId);
      loadMembers();
    } finally {
      setSavingId(null);
    }
  };

  const openProfileEdit = (member: AdminMemberRow) => {
    setProfileEditId(member.id);
    setDraftFullName(member.fullName.startsWith('(') ? '' : member.fullName);
    setDraftJobTitle(member.jobTitle);
    setDraftBranch(member.branch);
  };

  const handleSaveProfile = async () => {
    if (!profileEditId) return;
    setSavingId(profileEditId);
    try {
      await setMemberProfile(profileEditId, { fullName: draftFullName.trim(), jobTitle: draftJobTitle.trim(), branch: draftBranch.trim() });
      setProfileEditId(null);
      loadMembers();
    } finally {
      setSavingId(null);
    }
  };

  if (!profile) return null;

  const roleEditMember = filtered.find((m) => m.id === roleEditId) ?? (members ?? []).find((m) => m.id === roleEditId);
  const managerEditMember = filtered.find((m) => m.id === managerEditId) ?? (members ?? []).find((m) => m.id === managerEditId);

  return (
    <SafeAreaView style={styles.safe}>
      <QuizHeader
        title="Quản trị hệ thống"
        subtitle={`${members?.length ?? 0} tài khoản`}
        streakDays={profile.currentStreak}
        onBack={() => navigate('profile')}
      />

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={17} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm theo tên hoặc email..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      {!members ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <Text style={styles.emptyText}>Không tìm thấy tài khoản phù hợp.</Text>
          ) : (
            filtered.map((member) => (
              <View key={member.id} style={styles.row}>
                <View style={styles.rowTop}>
                  <Text style={styles.name} numberOfLines={1}>
                    {member.fullName}
                  </Text>
                  {savingId === member.id && <ActivityIndicator size="small" color={colors.primary} />}
                  <Pressable onPress={() => openProfileEdit(member)} hitSlop={8}>
                    <Ionicons name="create-outline" size={18} color={colors.textMuted} />
                  </Pressable>
                </View>
                <Text style={styles.email} numberOfLines={1}>
                  {member.email}
                </Text>
                {(member.jobTitle || member.branch) && (
                  <Text style={styles.email} numberOfLines={1}>
                    {[member.jobTitle, member.branch].filter(Boolean).join(' · ')}
                  </Text>
                )}

                <View style={styles.pillRow}>
                  <Pressable style={[styles.pill, { borderColor: ROLE_COLOR[member.role] }]} onPress={() => setRoleEditId(member.id)}>
                    <Text style={[styles.pillText, { color: ROLE_COLOR[member.role] }]}>{ROLE_LABEL[member.role]}</Text>
                    <Ionicons name="chevron-down" size={12} color={ROLE_COLOR[member.role]} />
                  </Pressable>

                  <Pressable style={styles.pill} onPress={() => setManagerEditId(member.id)}>
                    <Ionicons name="people-outline" size={12} color={colors.textPrimary} />
                    <Text style={styles.pillText}>
                      {member.managerId ? (managerNameById.get(member.managerId) ?? 'Đã gán') : 'Chưa có quản lý'}
                    </Text>
                    <Ionicons name="chevron-down" size={12} color={colors.textPrimary} />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

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

      <SimpleSelectModal
        visible={!!roleEditId}
        title={roleEditMember ? `Vai trò của ${roleEditMember.fullName}` : 'Đổi vai trò'}
        options={ROLE_OPTIONS}
        selectedId={roleEditMember?.role ?? 'employee'}
        onSelect={(id) => roleEditId && handleSetRole(roleEditId, id)}
        onClose={() => setRoleEditId(null)}
      />

      <SimpleSelectModal
        visible={!!managerEditId}
        title={managerEditMember ? `Quản lý của ${managerEditMember.fullName}` : 'Gán quản lý'}
        options={managerOptions.filter((o) => o.id !== managerEditId)}
        selectedId={managerEditMember?.managerId ?? NO_MANAGER_ID}
        onSelect={(id) => managerEditId && handleSetManager(managerEditId, id)}
        onClose={() => setManagerEditId(null)}
      />

      <Modal visible={!!profileEditId} animationType="slide" transparent onRequestClose={() => setProfileEditId(null)}>
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.modalBackdropDismiss} onPress={() => setProfileEditId(null)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sửa thông tin</Text>
              <Pressable onPress={() => setProfileEditId(null)} hitSlop={8} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </Pressable>
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Họ và tên</Text>
              <TextInput value={draftFullName} onChangeText={setDraftFullName} placeholder="Nguyễn Thị Thảo Hương" placeholderTextColor={colors.textMuted} style={styles.modalInput} />
            </View>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Chức danh</Text>
              <TextInput value={draftJobTitle} onChangeText={setDraftJobTitle} placeholder="Chuyên viên khách hàng cá nhân" placeholderTextColor={colors.textMuted} style={styles.modalInput} />
            </View>
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Chi nhánh</Text>
              <TextInput value={draftBranch} onChangeText={setDraftBranch} placeholder="Hội sở chính" placeholderTextColor={colors.textMuted} style={styles.modalInput} />
            </View>

            <Pressable onPress={handleSaveProfile} disabled={savingId === profileEditId} style={styles.modalSaveBtn}>
              {savingId === profileEditId ? <ActivityIndicator color={colors.white} /> : <Text style={styles.modalSaveText}>Lưu</Text>}
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    ...cardShadow,
  },
  searchInput: { flex: 1, fontFamily: fontFamily.semiBold, fontSize: 13, color: colors.textPrimary, padding: 0 },
  content: { padding: spacing.xl, gap: spacing.sm, paddingBottom: spacing.xxl },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
  row: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 4,
    ...cardShadow,
  },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  name: { flex: 1, fontFamily: fontFamily.extraBold, fontSize: 14, color: colors.textPrimary },
  email: { fontFamily: fontFamily.semiBold, fontSize: 11.5, color: colors.textMuted },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: 6 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: '#F1E7E0',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  pillText: { fontFamily: fontFamily.bold, fontSize: 11.5, color: colors.textPrimary },

  // alignItems:'center' + modalSheet có width/maxWidth — trên web, Modal
  // portal thẳng ra document.body (ngoài khung "phản chiếu điện thoại" bọc
  // quanh phần còn lại của app, xem App.tsx#WebPhoneFrame) nên nếu không
  // giới hạn, sheet sẽ kéo giãn full chiều rộng desktop.
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end', alignItems: 'center' },
  modalBackdropDismiss: { ...StyleSheet.absoluteFill },
  modalSheet: {
    width: '100%',
    maxWidth: webPhoneFrameMaxWidth,
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontFamily: fontFamily.extraBold, fontSize: 16, color: colors.textPrimary },
  modalCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  modalField: { gap: 6 },
  modalLabel: { fontFamily: fontFamily.bold, fontSize: 12.5, color: colors.textPrimary },
  modalInput: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: '#F1E7E0',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  modalSaveBtn: { backgroundColor: colors.primary, borderRadius: radii.pill, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  modalSaveText: { fontFamily: fontFamily.extraBold, fontSize: 14, color: colors.white },
});
