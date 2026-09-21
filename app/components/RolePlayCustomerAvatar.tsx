import { Image, StyleSheet, Text, View } from 'react-native';
import { colors2, fontFamily2, spacing2 } from './theme';

const AVATAR_SIZE = 160;
const GLOW_INNER_SIZE = 200;
const GLOW_OUTER_SIZE = 250;

export function RolePlayCustomerAvatar({
  avatarSource,
  name,
  personaLabel,
  statusText,
}: {
  avatarSource: number;
  name: string;
  personaLabel: string;
  statusText: string;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.glowOuter} />
      <View style={styles.glowInner} />
      <View style={styles.avatarRing}>
        <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
      </View>

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.persona}>{personaLabel}</Text>
      <Text style={styles.status}>{statusText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  // 2 vòng hào quang màu xám đặc (không mờ/trong suốt như bản cũ) — đúng
  // Figma (node-id=76:3536: fill #262626/#2E2E2E, không có opacity).
  glowOuter: {
    position: 'absolute',
    top: AVATAR_SIZE / 2 - GLOW_OUTER_SIZE / 2,
    width: GLOW_OUTER_SIZE,
    height: GLOW_OUTER_SIZE,
    borderRadius: GLOW_OUTER_SIZE / 2,
    backgroundColor: '#262626',
  },
  glowInner: {
    position: 'absolute',
    top: AVATAR_SIZE / 2 - GLOW_INNER_SIZE / 2,
    width: GLOW_INNER_SIZE,
    height: GLOW_INNER_SIZE,
    borderRadius: GLOW_INNER_SIZE / 2,
    backgroundColor: colors2.cardOptionIdle,
  },
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors2.white,
    padding: 5,
  },
  avatar: { width: '100%', height: '100%', borderRadius: (AVATAR_SIZE - 10) / 2 },
  // marginTop tăng hẳn từ spacing2.lg (24) lên 90 — theo phản hồi người dùng
  // (chữ nằm đè lên hoạ tiết cờ đua ở nền, nền bận rộn làm khó đọc chữ),
  // đẩy khối tên/persona/status xuống dưới hẳn hoạ tiết (hoạ tiết kết thúc ở
  // y=406, xem RolePlayScreen.tsx#flagBg) thay vì chỉ cách đều avatar.
  name: { marginTop: 90, fontFamily: fontFamily2.semiBold, fontSize: 24, lineHeight: 36, color: colors2.white },
  persona: { fontFamily: fontFamily2.regular, fontSize: 14, lineHeight: 20, color: colors2.whiteMuted },
  status: { marginTop: spacing2.md, fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.orange },
});
