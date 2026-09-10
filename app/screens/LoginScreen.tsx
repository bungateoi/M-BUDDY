import { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, primaryGradient, radii, spacing } from '../components';
import { signIn } from '../lib/authData';

const mascotSource = require('../assets/mascot-border.png');

// Tài khoản do admin tạo sẵn (Supabase Dashboard > Authentication > Users)
// rồi gửi email/mật khẩu cho nhân viên — KHÔNG tự đăng ký trong app nữa (đã
// bỏ, vì cần cấu hình email xác nhận khá rắc rối cho người mới dùng
// Supabase). Xem hướng dẫn tạo tài khoản trong hội thoại/README.
export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Đăng nhập thành công -> session đổi -> AuthProvider tự cập nhật,
  // App.tsx tự chuyển sang màn Home. Không cần tự navigate('home') ở đây.
  const handleSubmit = async () => {
    setErrorText(null);
    if (!email.trim() || !password.trim()) {
      setErrorText('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch (e) {
      setErrorText(e instanceof Error ? e.message : 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={primaryGradient.colors} start={primaryGradient.start} end={primaryGradient.end} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.header}>
            <Image source={mascotSource} style={styles.mascot} resizeMode="contain" />
            <Text style={styles.wordmark}>M-BUDDY</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Đăng nhập</Text>
            <Text style={styles.subtitle}>Dùng email và mật khẩu do quản trị viên cấp cho bạn.</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@msb.com.vn"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
                {email.length > 0 && (
                  <Pressable onPress={() => setEmail('')} hitSlop={8}>
                    <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                  </Pressable>
                )}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mật khẩu</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
                <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={8}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={19} color={colors.textMuted} />
                </Pressable>
              </View>
            </View>

            {errorText && <Text style={styles.errorText}>{errorText}</Text>}

            <Pressable onPress={handleSubmit} disabled={submitting} style={[styles.loginButton, submitting && styles.loginButtonDisabled]}>
              {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.loginButtonText}>Đăng nhập</Text>}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl },
  header: { alignItems: 'center', paddingBottom: spacing.xl, gap: spacing.sm },
  mascot: { width: 128, height: 128 },
  wordmark: { fontFamily: fontFamily.black, fontSize: 30, color: colors.white, letterSpacing: 1 },
  card: {
    backgroundColor: colors.background,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: { fontFamily: fontFamily.extraBold, fontSize: 17, color: colors.textPrimary, textAlign: 'center' },
  subtitle: { fontFamily: fontFamily.semiBold, fontSize: 11.5, color: colors.textMuted, textAlign: 'center', marginTop: -spacing.sm },
  field: { gap: 6 },
  label: { fontFamily: fontFamily.bold, fontSize: 12.5, color: colors.textPrimary },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: '#F1E7E0',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  input: { flex: 1, fontFamily: fontFamily.semiBold, fontSize: 14, color: colors.textPrimary, padding: 0 },
  errorText: { fontFamily: fontFamily.semiBold, fontSize: 12.5, color: colors.error },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { fontFamily: fontFamily.extraBold, fontSize: 15, color: colors.white },
});
