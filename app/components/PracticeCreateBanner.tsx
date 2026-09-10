import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, primaryGradient, radii, spacing } from './theme';

const illustrationSource = require('../assets/hosoKH.png');

export function PracticeCreateBanner({ onPress }: { onPress?: () => void }) {
  return (
    <LinearGradient colors={primaryGradient.colors} start={primaryGradient.start} end={primaryGradient.end} style={styles.banner}>
      <View style={styles.textCol}>
        <Text style={styles.title}>Tạo khách hàng của bạn</Text>
        <Text style={styles.desc}>Xây dựng chân dung khách hàng theo nhu cầu để luyện tập role-play</Text>
        <Pressable onPress={onPress} style={styles.button}>
          <Text style={styles.buttonText}>Tạo ngay</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.primary} />
        </Pressable>
      </View>
      <Image source={illustrationSource} style={styles.illustration} resizeMode="contain" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  textCol: { flex: 1, flexShrink: 1, gap: 4 },
  title: { fontFamily: fontFamily.extraBold, fontSize: 16.5, color: colors.white },
  desc: { fontFamily: fontFamily.semiBold, fontSize: 11.5, color: 'rgba(255,255,255,0.9)', lineHeight: 15.5 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    marginTop: 4,
  },
  buttonText: { fontFamily: fontFamily.extraBold, fontSize: 12.5, color: colors.primary },
  illustration: { width: 104, height: 75, flexShrink: 0 },
});
