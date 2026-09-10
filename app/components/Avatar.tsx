import { Image, StyleSheet, Text, type ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontFamily, primaryGradient } from './theme';

// Có avatarSource (ảnh nhân vật thật, người dùng chọn ở màn Tôi) thì ưu
// tiên hiển thị ảnh đó — đồng nhất với avatar dùng ở màn Tôi/role-play thay
// vì luôn hiện chữ cái đầu tên. Không có (vd. khách hàng luyện tập chưa gán
// avatarKey) thì fallback về vòng tròn gradient + chữ cái đầu như trước.
export function Avatar({
  initials,
  avatarSource,
  size = 56,
}: {
  initials: string;
  avatarSource?: ImageSourcePropType;
  size?: number;
}) {
  if (avatarSource) {
    return <Image source={avatarSource} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  return (
    <LinearGradient
      colors={primaryGradient.colors}
      start={primaryGradient.start}
      end={primaryGradient.end}
      style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <Text style={[styles.text, { fontSize: size * 0.34 }]}>{initials}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
  text: { color: colors.white, fontFamily: fontFamily.extraBold },
});
