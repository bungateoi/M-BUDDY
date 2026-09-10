import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, spacing } from './theme';

const AVATAR_SIZE = 168;

export function RolePlayCustomerAvatar({
  avatarSource,
  name,
  personaLabel,
  statusText,
  statusIcon = 'mic',
}: {
  avatarSource: number;
  name: string;
  personaLabel: string;
  statusText: string;
  /** Tên icon Ionicons hiển thị cạnh statusText — đổi theo phase (mic khi khách đang nói, hourglass khi đang xử lý...). */
  statusIcon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.glowOuter} />
      <View style={styles.glowInner} />
      <View style={styles.avatarRing}>
        <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
      </View>

      <Text style={styles.name}>
        {name} • {personaLabel}
      </Text>
      <View style={styles.statusRow}>
        <Ionicons name={statusIcon} size={14} color={colors.primary} />
        <Text style={styles.status}>{statusText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  glowOuter: {
    position: 'absolute',
    top: AVATAR_SIZE / 2 - (AVATAR_SIZE + 76) / 2,
    width: AVATAR_SIZE + 76,
    height: AVATAR_SIZE + 76,
    borderRadius: (AVATAR_SIZE + 76) / 2,
    backgroundColor: colors.primaryLight,
    opacity: 0.35,
  },
  glowInner: {
    position: 'absolute',
    top: AVATAR_SIZE / 2 - (AVATAR_SIZE + 32) / 2,
    width: AVATAR_SIZE + 32,
    height: AVATAR_SIZE + 32,
    borderRadius: (AVATAR_SIZE + 32) / 2,
    backgroundColor: colors.primaryLight,
    opacity: 0.55,
  },
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.white,
    padding: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  avatar: { width: '100%', height: '100%', borderRadius: (AVATAR_SIZE - 10) / 2 },
  name: { marginTop: spacing.lg, fontFamily: fontFamily.extraBold, fontSize: 18, color: colors.textPrimary },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  status: { fontFamily: fontFamily.bold, fontSize: 13.5, color: colors.primary },
});
