import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from './Avatar';
import { StreakBadge } from './StreakBadge';
import { NotificationBell } from './NotificationBell';
import { XPLevelRow } from './XPLevelRow';
import { colors, fontFamily, spacing } from './theme';

const mascotSource = require('../assets/mascot.png');

export function HomeHeader({
  avatarInitials,
  avatarSource,
  streakDays,
  hasUnreadNotification,
  xp,
  level,
  levelProgress,
}: {
  avatarInitials: string;
  avatarSource?: ImageSourcePropType;
  streakDays: number;
  hasUnreadNotification: boolean;
  xp: number;
  level: number;
  levelProgress: number;
}) {
  return (
    <LinearGradient
      colors={[colors.headerGradientStart, colors.headerGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.wrap}
    >
      <View style={styles.topRow}>
        <View style={styles.identity}>
          <Avatar initials={avatarInitials} avatarSource={avatarSource} />
          <View style={styles.textCol}>
            <Text style={styles.hello}>Xin chào,</Text>
            <Text style={styles.name}>cùng M-BUDDY luyện tập nhé! 👋</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <StreakBadge days={streakDays} />
          <NotificationBell hasUnread={hasUnreadNotification} />
        </View>
      </View>

      <View style={styles.xpRow}>
        <XPLevelRow xp={xp} level={level} levelProgress={levelProgress} />
      </View>

      <Text style={[styles.sparkle, styles.sparkleA]}>✨</Text>
      <Text style={[styles.sparkle, styles.sparkleB]}>✨</Text>
      <Image source={mascotSource} style={styles.mascot} resizeMode="contain" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexShrink: 1,
  },
  // flexShrink + minWidth:0 — không có minWidth:0 thì trên web, Text con bên
  // trong flex row có thể tràn ra ngoài thay vì tự xuống dòng (mặc định
  // min-width:auto của flexbox web tính theo độ dài nội dung).
  textCol: { gap: 1, flexShrink: 1, minWidth: 0 },
  hello: { fontFamily: fontFamily.semiBold, fontSize: 13, color: colors.textMuted },
  name: { fontFamily: fontFamily.extraBold, fontSize: 16, color: colors.textPrimary },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  xpRow: {
    marginTop: spacing.sm,
    maxWidth: '68%',
  },
  mascot: {
    position: 'absolute',
    right: 6,
    top: 22,
    width: 134,
    height: 156,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 15,
    color: colors.warning,
  },
  sparkleA: { right: 132, top: 36 },
  sparkleB: { right: 118, top: 56 },
});
