import { useEffect, useState } from 'react';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  AvatarPickerModal,
  HomeBottomNavBar,
  ProfileStatCard,
  colors2,
  fontFamily2,
  radii2,
  spacing2,
  type AvatarOption,
} from '../components';
import { getBadgeTierProgress, getRoleplayAvatarSource, roleplayAvatarSources } from '../data';
import type { RoleplayAvatarKey } from '../data';
import { fetchMyLeaderboardRank, updateMyAvatar } from '../lib/authData';
import { useAuth } from '../lib/AuthContext';
import { showAlert } from '../lib/platformAlert';
import { useAppNavigation } from '../navigation/NavigationContext';

const AVATAR_OPTIONS: AvatarOption[] = (Object.keys(roleplayAvatarSources) as RoleplayAvatarKey[]).map((key) => ({
  key,
  source: roleplayAvatarSources[key],
}));

export function ProfileScreen() {
  const { navigate } = useAppNavigation();
  const { profile, refreshProfile, signOut } = useAuth();
  const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  useEffect(() => {
    fetchMyLeaderboardRank()
      .then(setLeaderboardRank)
      .catch(() => setLeaderboardRank(null));
  }, []);

  if (!profile) return null;
  const user = profile;
  const badgeTier = getBadgeTierProgress(user.xp).current;

  const handleSelectAvatar = async (key: string) => {
    if (key === user.avatarKey) {
      setAvatarModalVisible(false);
      return;
    }
    setSavingAvatar(true);
    try {
      await updateMyAvatar(key as RoleplayAvatarKey);
      await refreshProfile();
      setAvatarModalVisible(false);
    } catch (e) {
      showAlert('Lỗi', e instanceof Error ? e.message : 'Không đổi được ảnh đại diện, thử lại nhé.');
    } finally {
      setSavingAvatar(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tôi</Text>
      </View>

      <View style={styles.content}>
        <Pressable style={styles.identityCard} onPress={() => setAvatarModalVisible(true)}>
          <View style={styles.avatarRing}>
            <Image source={getRoleplayAvatarSource(user.avatarKey as any)} style={styles.avatar} />
            <View style={styles.avatarEditBadge}>
              <Ionicons name="pencil" size={10} color={colors2.white} />
            </View>
          </View>
          <View style={styles.identityText}>
            <Text style={styles.name} numberOfLines={2}>
              {user.fullName}
            </Text>
            <Text style={styles.jobTitle} numberOfLines={1}>
              {user.jobTitle}
            </Text>
            <Text style={styles.branch} numberOfLines={1}>
              {user.branch}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors2.orange} />
        </Pressable>

        <View style={styles.statsRow}>
          <ProfileStatCard
            icon="🔥"
            label="Streak"
            value={`${user.currentStreak} ngày`}
            sublabel="Chuỗi học liên tiếp"
            bg={colors2.cardOptionIdle}
            valueColor={colors2.orange}
          />
          <ProfileStatCard
            icon="⏱️"
            label="Kinh nghiệm"
            value={`${user.xp.toLocaleString('vi-VN')} XP`}
            sublabel={`Cấp độ: Lv.${user.level}`}
            bg={colors2.cardOptionIdle}
            valueColor={colors2.green500}
          />
          <ProfileStatCard
            icon="🏆"
            label="Ranking"
            value={badgeTier.label}
            sublabel={leaderboardRank ? `Top ${leaderboardRank} BXH` : '—'}
            bg={colors2.cardOptionIdle}
            valueColor="#B98CFF"
          />
        </View>

        {user.role === 'manager' && (
          <Pressable style={styles.teamCard} onPress={() => navigate('teamManagement')}>
            <View style={styles.teamIcon}>
              <Ionicons name="people" size={20} color={colors2.orange} />
            </View>
            <View style={styles.teamText}>
              <Text style={styles.teamTitle}>Nhóm của tôi</Text>
              <Text style={styles.teamSubtitle}>Theo dõi tiến độ và hỗ trợ thành viên</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors2.orange} />
          </Pressable>
        )}

        {user.role === 'admin' && (
          <Pressable style={styles.teamCard} onPress={() => navigate('admin')}>
            <View style={styles.teamIcon}>
              <Ionicons name="shield-checkmark" size={20} color={colors2.orange} />
            </View>
            <View style={styles.teamText}>
              <Text style={styles.teamTitle}>Quản trị hệ thống</Text>
              <Text style={styles.teamSubtitle}>Phong trưởng nhóm, gán thành viên vào team</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors2.orange} />
          </Pressable>
        )}

        {user.role === 'admin' && (
          <Pressable style={styles.teamCard} onPress={() => navigate('contentManagement')}>
            <View style={styles.teamIcon}>
              <Ionicons name="book-outline" size={20} color={colors2.orange} />
            </View>
            <View style={styles.teamText}>
              <Text style={styles.teamTitle}>Quản trị hành trình & tri thức</Text>
              <Text style={styles.teamSubtitle}>Ẩn/sửa/thêm sản phẩm, chặng — tự sinh lại nội dung</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors2.orange} />
          </Pressable>
        )}

        <View style={styles.spacer} />

        <Pressable style={styles.logoutButton} onPress={signOut}>
          <Ionicons name="log-out-outline" size={18} color={colors2.red500} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </Pressable>
      </View>

      <HomeBottomNavBar
        active="toi"
        onPressItem={(key) => {
          if (key === 'home') navigate('home');
          if (key === 'map') navigate('map');
          if (key === 'practice') navigate('practice');
          if (key === 'xephang') navigate('leaderboard');
          if (key === 'ontap') navigate('practiceHistory');
        }}
      />

      <AvatarPickerModal
        visible={avatarModalVisible}
        options={AVATAR_OPTIONS}
        selectedKey={user.avatarKey}
        saving={savingAvatar}
        onSelect={handleSelectAvatar}
        onClose={() => setAvatarModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors2.black },
  header: { paddingHorizontal: spacing2.md, paddingTop: spacing2.md, paddingBottom: spacing2.xs },
  headerTitle: { fontFamily: fontFamily2.semiBold, fontSize: 26, color: colors2.white },
  content: { flex: 1, paddingHorizontal: spacing2.md, gap: spacing2.md },
  identityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.md,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    padding: spacing2.md,
  },
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors2.orange,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarEditBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors2.orange,
    borderWidth: 1.5,
    borderColor: colors2.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: '100%', height: '100%', borderRadius: 27 },
  identityText: { flex: 1, gap: 1, minWidth: 0 },
  name: { fontFamily: fontFamily2.semiBold, fontSize: 16, color: colors2.white },
  jobTitle: { fontFamily: fontFamily2.regular, fontSize: 12, color: colors2.whiteMuted },
  branch: { fontFamily: fontFamily2.regular, fontSize: 12, color: colors2.whiteMuted },
  statsRow: { flexDirection: 'row', gap: spacing2.xs },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.xs,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    padding: spacing2.md,
  },
  teamIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors2.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamText: { flex: 1, gap: 1 },
  teamTitle: { fontFamily: fontFamily2.semiBold, fontSize: 13.5, color: colors2.white },
  teamSubtitle: { fontFamily: fontFamily2.regular, fontSize: 11, color: colors2.whiteMuted },
  spacer: { flex: 1, minHeight: spacing2.md },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.pill,
    paddingVertical: spacing2.md,
    marginBottom: spacing2.lg,
  },
  logoutText: { fontFamily: fontFamily2.semiBold, fontSize: 14.5, color: colors2.red500 },
});
