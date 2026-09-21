import { useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  AvatarPickerModal,
  HomeBottomNavBar,
  colors2,
  fontFamily2,
  radii2,
  spacing2,
  type AvatarOption,
} from '../components';
import { TROPHY_SOURCES, TROPHY_SPECS } from '../components/BadgeTierCard';
import { CheckerStrip, StarFillIcon, StreakFlameVectorIcon } from '../components/icons2';
import { getBadgeTierProgress, getRoleplayAvatarSource, roleplayAvatarSources } from '../data';
import type { RoleplayAvatarKey } from '../data';
import { updateMyAvatar } from '../lib/authData';
import { useAuth } from '../lib/AuthContext';
import { showAlert } from '../lib/platformAlert';
import { useAppNavigation } from '../navigation/NavigationContext';

const AVATAR_OPTIONS: AvatarOption[] = (Object.keys(roleplayAvatarSources) as RoleplayAvatarKey[]).map((key) => ({
  key,
  source: roleplayAvatarSources[key],
}));

// Redesign theo Figma node-id=118-12753 ("Tôi"). Khác bản cũ (thẻ trắng nhỏ
// + 3 ô stat chi tiết): giờ có dải caro trang trí quanh khối tên, khối cúp
// thành tích to (dùng lại đúng TROPHY_SOURCES/SPECS của BadgeTierCard —
// Xếp hạng), 2 ô stat lớn (Chuỗi học/XP), nút Đăng xuất viền đỏ nổi bật.
// leaderboardRank không còn dùng nên bỏ luôn field/state đó (Figma không có
// chỗ hiển thị "Top X BXH" trong bản này).
export function ProfileScreen() {
  const { navigate } = useAppNavigation();
  const { profile, refreshProfile, signOut } = useAuth();
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  if (!profile) return null;
  const user = profile;
  const { current: badgeTier } = getBadgeTierProgress(user.xp);
  const trophySpec = TROPHY_SPECS[badgeTier.id];

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
        <Pressable onPress={() => navigate('home')} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors2.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Hồ sơ tay đua</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.checkerClip}>
          <CheckerStrip />
        </View>
        <Pressable style={styles.nameCard} onPress={() => setAvatarModalVisible(true)}>
          <View style={styles.avatarWrap}>
            <Image source={getRoleplayAvatarSource(user.avatarKey as any)} style={styles.avatar} />
          </View>
          <Text style={styles.nameLabel}>Họ và tên</Text>
          <Text style={styles.nameValue} numberOfLines={1}>
            {user.fullName}
          </Text>
        </Pressable>
        <View style={styles.checkerClip}>
          <CheckerStrip />
        </View>

        <View style={styles.box}>
          <View style={styles.trophyBlock}>
            <Image
              source={TROPHY_SOURCES[badgeTier.id] as never}
              style={{ width: trophySpec.width, height: trophySpec.height }}
              resizeMode="contain"
            />
            <Text style={styles.trophyLabel}>Hạng {badgeTier.label}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statText}>
                <Text style={styles.statLabel}>Chuỗi học</Text>
                <Text style={styles.statValue}>{user.currentStreak}</Text>
              </View>
              <StreakFlameVectorIcon width={30} height={44} />
            </View>
            <View style={styles.statCard}>
              <View style={styles.statText}>
                <Text style={styles.statLabel}>XP</Text>
                <Text style={styles.statValue}>{user.xp.toLocaleString('vi-VN')}</Text>
              </View>
              <StarFillIcon size={44} />
            </View>
          </View>

          {user.role === 'admin' && (
            <Pressable style={styles.teamCard} onPress={() => navigate('admin')}>
              <Ionicons name="shield-checkmark" size={26} color={colors2.yellow} />
              <View style={styles.teamText}>
                <Text style={styles.teamTitle}>Quản trị hệ thống</Text>
                <Text style={styles.teamSubtitle}>Phong trưởng nhóm, gán thành viên vào team</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors2.white} />
            </Pressable>
          )}

          {user.role === 'admin' && (
            <Pressable style={styles.teamCard} onPress={() => navigate('contentManagement')}>
              <Ionicons name="book-outline" size={26} color={colors2.yellow} />
              <View style={styles.teamText}>
                <Text style={styles.teamTitle}>Quản trị hành trình & tri thức</Text>
                <Text style={styles.teamSubtitle}>Ẩn/sửa/thêm sản phẩm, chặng — tự sinh lại nội dung</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors2.orange} />
            </Pressable>
          )}

          <Pressable style={styles.logoutButton} onPress={signOut}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
            <Ionicons name="log-out-outline" size={22} color={colors2.red600} />
          </Pressable>
        </View>
      </ScrollView>

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
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing2.md, padding: spacing2.md },
  headerTitle: { flex: 1, textAlign: 'center', fontFamily: fontFamily2.semiBold, fontSize: 24, color: colors2.white },
  headerSpacer: { width: 24 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing2.xl },
  // Dải caro tràn hết bề ngang, cắt gọn bởi overflow:hidden — xem CheckerStrip
  // (icons2.tsx), tự render dư số ô để không lộ hụt ở màn rộng.
  checkerClip: { width: '100%', overflow: 'hidden' },
  nameCard: {
    alignItems: 'center',
    gap: spacing2.sm,
    backgroundColor: colors2.orange,
    borderBottomWidth: 4,
    borderBottomColor: colors2.white,
    paddingVertical: spacing2.md,
    paddingHorizontal: spacing2.md,
  },
  avatarWrap: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', backgroundColor: colors2.black },
  avatar: { width: '100%', height: '100%' },
  nameLabel: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
  nameValue: { fontFamily: fontFamily2.displaySpeed, fontSize: 32, color: colors2.white, textTransform: 'uppercase' },
  box: { padding: spacing2.md, gap: spacing2.xl, alignItems: 'center' },
  trophyBlock: { alignItems: 'center', gap: spacing2.xs },
  trophyLabel: { fontFamily: fontFamily2.semiBold, fontSize: 16, lineHeight: 24, color: colors2.white },
  statsRow: { flexDirection: 'row', gap: spacing2.sm, width: '100%' },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing2.xs,
    backgroundColor: colors2.cardOptionIdle,
    borderWidth: 1,
    borderColor: colors2.white,
    borderBottomWidth: 4,
    borderRadius: radii2.card,
    padding: spacing2.md,
  },
  statText: { gap: spacing2.xs },
  statLabel: { fontFamily: fontFamily2.semiBold, fontSize: 16, lineHeight: 24, color: colors2.white },
  statValue: { fontFamily: fontFamily2.displaySpeed, fontSize: 20, color: colors2.white },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.xs,
    backgroundColor: colors2.cardOptionIdle,
    borderWidth: 1,
    borderColor: colors2.white,
    borderBottomWidth: 4,
    borderRadius: radii2.card,
    padding: spacing2.md,
    width: '100%',
  },
  teamText: { flex: 1, gap: 1 },
  teamTitle: { fontFamily: fontFamily2.semiBold, fontSize: 13.5, color: colors2.white },
  teamSubtitle: { fontFamily: fontFamily2.regular, fontSize: 11, color: colors2.whiteMuted },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing2.xs,
    backgroundColor: colors2.cardOptionIdle,
    borderWidth: 1,
    borderColor: colors2.red500,
    borderBottomWidth: 4,
    borderRadius: 8,
    paddingHorizontal: spacing2.md,
    paddingVertical: spacing2.sm,
  },
  logoutText: { fontFamily: fontFamily2.semiBold, fontSize: 16, lineHeight: 24, color: colors2.red600 },
});
