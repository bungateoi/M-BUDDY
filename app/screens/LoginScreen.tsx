import { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors2, fontFamily2, radii2, spacing2 } from '../components';
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
    <View style={styles.gradient}>
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
                  placeholderTextColor={colors2.whiteMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
                {email.length > 0 && (
                  <Pressable onPress={() => setEmail('')} hitSlop={8}>
                    <Ionicons name="close-circle" size={18} color={colors2.whiteMuted} />
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
                  placeholderTextColor={colors2.whiteMuted}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
                <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={8}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={19} color={colors2.whiteMuted} />
                </Pressable>
              </View>
            </View>

            {errorText && <Text style={styles.errorText}>{errorText}</Text>}

            <Pressable onPress={handleSubmit} disabled={submitting} style={[styles.loginButton, submitting && styles.loginButtonDisabled]}>
              {submitting ? <ActivityIndicator color={colors2.white} /> : <Text style={styles.loginButtonText}>Đăng nhập</Text>}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, backgroundColor: colors2.orange },
  safe: { flex: 1 },
  flex: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing2.md },
  header: { alignItems: 'center', paddingBottom: spacing2.md, gap: spacing2.xs },
  mascot: { width: 128, height: 128 },
  wordmark: { fontFamily: fontFamily2.semiBold, fontSize: 30, color: colors2.white, letterSpacing: 1 },
  card: {
    backgroundColor: colors2.black,
    borderRadius: radii2.card,
    padding: spacing2.md,
    gap: spacing2.md,
  },
  title: { fontFamily: fontFamily2.semiBold, fontSize: 17, color: colors2.white, textAlign: 'center' },
  subtitle: { fontFamily: fontFamily2.regular, fontSize: 11.5, color: colors2.whiteMuted, textAlign: 'center', marginTop: -spacing2.xs },
  field: { gap: 6 },
  label: { fontFamily: fontFamily2.semiBold, fontSize: 12.5, color: colors2.white },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing2.xs,
    backgroundColor: colors2.cardOptionIdle,
    borderRadius: radii2.card,
    paddingHorizontal: spacing2.md,
    paddingVertical: 12,
  },
  input: { flex: 1, fontFamily: fontFamily2.regular, fontSize: 14, color: colors2.white, padding: 0 },
  errorText: { fontFamily: fontFamily2.semiBold, fontSize: 12.5, color: colors2.red500 },
  loginButton: {
    backgroundColor: colors2.orange,
    borderRadius: radii2.pill,
    paddingVertical: spacing2.md,
    alignItems: 'center',
    marginTop: spacing2.xs,
  },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { fontFamily: fontFamily2.semiBold, fontSize: 15, color: colors2.white },
});
