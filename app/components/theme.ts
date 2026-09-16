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

// ============================================================================
// V2 — token đọc trực tiếp từ Figma "Hackathon" (node-id=23-305, Homepage).
// Bộ nhận diện mới (nền xanh dương) khác hẳn "colors" cam phía trên — đặt
// tên riêng (hậu tố "2") thay vì ghi đè "colors"/"fontFamily" cũ, vì các màn
// chưa được redesign (Map, Practice, Xếp hạng...) vẫn đang dùng "colors" cũ
// cho đúng giao diện cam của chúng. Màn nào được redesign theo Figma mới thì
// chuyển sang dùng bộ token này; khi tất cả màn đã xong có thể dọn "colors"
// cũ đi. KHÔNG hardcode màu/số lẻ trong component — mọi giá trị mới phải lấy
// từ đây.
export const colors2 = {
  blue: '#2F5FFF', // Primary/Blue — nền màn hình
  blueDark: '#2050D6', // Primary/Dark Blue — nền các card
  orange: '#FB6616', // Primary/Orange
  yellow: '#FEBC1D', // Primary/Yellow
  white: '#FFFFFF', // Text/White, Base/$white
  whiteMuted: 'rgba(255,255,255,0.6)', // Text/White 60
  navBorder: '#41D4FE', // viền trên cùng của thanh menu dưới
  shadowOrange: '#CD5500', // Shadow/Orange — drop-shadow "sticker" của nút CTA
  shadowGray: '#8C8C8C', // Shadow/Gray — drop-shadow "sticker" của node bản đồ đang khoá (Bản đồ, node-id=76-5842)
  lockedGray: '#C1C1C1', // màu nền vòng tròn node bản đồ khi đang khoá (đọc từ asset Level, node-id=76-5842 — trước là xanh #4E8FFF ở bản Figma cũ 30:1819, nay đổi xám)
  roadGray: '#4D4D4D', // màu đường nối giữa các node (trước là colors2.blueDark, nay đổi xám cho khớp nền đen mới)
  textDark: '#333333', // Text/Black — chữ trên nền tag màu sáng (Mass/Affluent...), node-id=35:2188
  tagGreen: '#B5F00A', // Secondary/Green — tag "Mass"
  tagYellow: '#FEBC1D', // Secondary/Yellow — tag "Affluent" (trùng giá trị "yellow" ở trên, đặt tên riêng cho đúng ngữ cảnh tag)
  black: '#222222', // Primary/Black — nền card tối trên nền cam đua xe (Home, node-id=58-317)
  blackMuted: 'rgba(34,34,34,0.6)', // Text/Black 60 — icon/label không active trên nền trắng (thanh menu Home)
  cardOutline: '#000000', // viền 1px đen của card tối (Figma "border-black", khác màu nền #222 của card)
  cardOptionIdle: '#2E2E2E', // Primary/Black 2 — nền đáp án chưa chọn trong QuizOptionRow (Ôn tập, node-id=69-1392)
  green500: '#12B76A', // global/green/500 — vòng tròn đáp án đúng
  green800: '#07492A', // global/green/800 — nền đáp án đúng
  red500: '#F04438', // global/red/500 — vòng tròn đáp án sai
  red600: '#C0362D', // global/red/600 — chữ nút "Đăng xuất" (Tôi, node-id=118-12753)
  red800: '#601B16', // global/red/800 — nền đáp án đã chọn sai
  overlayDark: 'rgba(0,0,0,0.25)', // lớp phủ tối sau modal "Lịch sử hội thoại" (node-id=76-5140)
} as const;

// Primary/Orange Gradient — dùng cho nút CTA "Tham gia" (Daily Challenge).
export const orangeGradient2 = {
  colors: [colors2.yellow, colors2.orange] as [string, string],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
} as const;

export const fontFamily2 = {
  regular: 'Inter_400Regular', // 12/Regular, ...
  semiBold: 'Inter_600SemiBold', // 14/Semi, 16/Semi, 18/Semi
  // Font "A4 SPEED" (file .ttf do người dùng cung cấp, đã license — xem
  // app/assets/fonts/) — dùng cho số/điểm nổi bật xuyên suốt app (Home, Map,
  // Xếp hạng: MapLevelRow, LeaderboardSection, BadgeTierCard...). Trước đây
  // Map/Xếp hạng còn dùng Darumadrop One (font cũ, chưa redesign) — đã đổi
  // hết sang A4 Speed để đồng bộ 1 font duy nhất cho số nổi bật toàn app.
  display: 'A4Speed-Bold',
  displaySpeed: 'A4Speed-Bold',
} as const;

export const radii2 = {
  card: 16,
  button: 4, // nút "Tham gia"
  pill: 999,
  navTop: 24, // 2 góc trên của thanh menu dưới
} as const;

// Giá trị spacing/gap thực tế đọc được trong frame Homepage (px).
export const spacing2 = {
  xxs: 4,
  xs: 8,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
