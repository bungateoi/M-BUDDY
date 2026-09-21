import { Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { Avatar } from './Avatar';
import { XPLevelRow } from './XPLevelRow';
import { BellIcon, StreakFlameVectorIcon } from './icons2';
import { colors2, fontFamily2, spacing2 } from './theme';

// Chấm đỏ báo thông báo chưa đọc — Figma không định nghĩa màu riêng cho
// trạng thái này (asset "notification on" chỉ có 1 biến thể), nên giữ lại
// màu đỏ cảnh báo cũ (theme.ts#colors.error) thay vì bịa số liệu mới.
const UNREAD_DOT_COLOR = '#E63946';

function NotificationButton({ hasUnread }: { hasUnread?: boolean }) {
  return (
    <View style={styles.notifBtn}>
      <BellIcon size={16} />
      {hasUnread && <View style={styles.notifDot} />}
    </View>
  );
}

export function HomeHeader({
  name,
  avatarInitials,
  avatarSource,
  streakDays,
  hasUnreadNotification,
  xp,
  level,
  levelProgress,
  onPressAvatar,
}: {
  name: string;
  avatarInitials: string;
  avatarSource?: ImageSourcePropType;
  streakDays: number;
  hasUnreadNotification: boolean;
  xp: number;
  level: number;
  levelProgress: number;
  /** Màn "Tôi" không còn nằm trên thanh menu dưới — vào bằng cách bấm avatar. */
  onPressAvatar?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.topBar}>
        <View style={styles.identity}>
          <Pressable onPress={onPressAvatar} hitSlop={8}>
            <Avatar initials={avatarInitials} avatarSource={avatarSource} size={36} />
          </Pressable>
          <View style={styles.textCol}>
            <Text style={styles.hello}>Xin chào,</Text>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <XPLevelRow xp={xp} level={level} levelProgress={levelProgress} />
          <NotificationButton hasUnread={hasUnreadNotification} />
        </View>
      </View>

      {/* Không còn linh vật/trang trí vẽ tay riêng — toàn bộ hình xe đua +
          cờ caro giờ nằm SẴN trong ảnh nền của HomeScreen.tsx (race-bg.png),
          nên banner ở đây CHỈ còn chữ (khớp đúng node-id=58:317, "Content"
          trong "Banner" chỉ có text, không có illustration riêng). */}
      <View style={styles.banner}>
        <Text style={styles.bannerCaption}>Chuỗi ngày bứt phá</Text>
        <View style={styles.streakRow}>
          <Text style={styles.streakNumber}>{streakDays}</Text>
          <StreakFlameVectorIcon width={17} height={25} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing2.md,
    paddingVertical: spacing2.xs,
    gap: spacing2.md,
  },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing2.xs, flexShrink: 1, minWidth: 0 },
  textCol: { flexShrink: 1, minWidth: 0 },
  hello: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.white },
  name: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing2.xs, flexShrink: 0 },
  notifBtn: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: colors2.black,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  notifDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: UNREAD_DOT_COLOR,
    borderWidth: 1,
    borderColor: colors2.white,
  },
  // Khớp đúng Figma: khối chữ ("Content") cách Top Bar 24px (spacing2.lg),
  // cách đều 2 bên 16px; khoảng thở 8px dưới cùng trước khi vào "List" card
  // đầu tiên (StreakCard) — bù lại phần chiều cao dôi ra do line-height chữ
  // thật lớn hơn hộp chữ trong ảnh gốc Figma.
  banner: { paddingHorizontal: spacing2.md, paddingTop: spacing2.lg, paddingBottom: spacing2.xs, gap: spacing2.xs },
  bannerCaption: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.white },
  // minHeight = đúng line-height 60px của streakNumber (khớp Figma) — chặn
  // trường hợp hàng số bị "co" thấp hơn 60px do font A4 Speed (font ngoài,
  // không phải Google Font) render lineHeight khác nhau giữa các máy/nền
  // tảng, làm card chuỗi ngày bị đẩy lên che gần hết mascot phía sau.
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: spacing2.xs, minHeight: 60 },
  streakNumber: { fontFamily: fontFamily2.displaySpeed, fontSize: 40, lineHeight: 60, color: colors2.white },
});
