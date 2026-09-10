// Design tokens — nguồn: /docs/design-system.md
// Mã màu là ước lượng bằng mắt từ ui-draft/man-home.png (chưa có color
// picker chạy trên PDF gốc). Cần đối chiếu lại khi có mã hex chính xác.

export const colors = {
  primary: '#FF671F',
  primarySoft: '#FF9A56',
  primaryLight: '#FFE4D1',
  headerGradientStart: '#FFF2E9',
  headerGradientEnd: '#FFE1CE',
  success: '#2ECC71',
  successLight: '#E7F8ED',
  error: '#E63946',
  errorLight: '#FDEAEA',
  warning: '#F5A623',
  textPrimary: '#2D2D2D',
  textMuted: '#8A8A8A',
  background: '#FFFBF8',
  white: '#FFFFFF',
  chipTrack: '#FFE4D1',
  gridLine: '#F6D9C9',
  shadow: '#E8703A',
  lockedBg: '#E7DED2',
  lockedIcon: '#A99C8C',
  pathLine: '#F0C9AE',
  mapBackgroundStart: '#FFF1E7',
  mapBackgroundEnd: '#FFFBF8',
  cloudTint: '#FBD9C4',
} as const;

// Gradient thương hiệu chính — thay cho mọi bề mặt cam đơn sắc trước đây.
// Linear, góc 45° (từ góc dưới-trái sang góc trên-phải theo quy ước CSS),
// Đỏ #FF0000 tại 0% → Cam #FF671F tại 100%.
export const primaryGradient = {
  colors: ['#FF0000', '#FF671F'] as [string, string],
  start: { x: 0, y: 1 },
  end: { x: 1, y: 0 },
} as const;

export const radii = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 26,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const fontFamily = {
  regular: 'Nunito_400Regular',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

export const cardShadow = {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 14,
  elevation: 3,
} as const;

// Chiều rộng tối đa của "khung điện thoại" trên web desktop (xem
// App.tsx#WebPhoneFrame) — dùng lại đúng số này cho các Modal (chúng portal
// thẳng ra document.body, RA NGOÀI khung đó) để sheet của modal không bị kéo
// giãn full màn hình desktop, trông như lệch khỏi khung app phía sau.
export const webPhoneFrameMaxWidth = 480;
