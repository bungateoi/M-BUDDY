import { ImageBackground, StyleSheet, View } from 'react-native';
import { colors2, radii2, spacing2 } from './theme';
import { WeekDayChip } from './WeekDayChip';
import type { WeekDayProgress } from '../data/types';

const cardBg = require('../assets/v2/home2/streak-card-bg.png');

// Thiết kế mới chỉ hiện hàng 7 ngày trong tuần (không còn ô "Kỷ lục") — số
// ngày chuỗi hiện tại (currentStreak) đã chuyển lên hiện to trong Banner của
// HomeHeader. Vẫn nhận đủ props để không đổi cách HomeScreen gọi component.
export function StreakCard({
  currentStreak,
  longestStreak,
  weekProgress,
}: {
  currentStreak?: number;
  longestStreak?: number;
  weekProgress: WeekDayProgress[];
}) {
  return (
    // "Sticker shadow" trắng đặc 4px, không blur (Figma:
    // shadow-[0px_4px_0px_0px_white]) — khối trắng phía dưới hiện đúng 4px.
    <View style={styles.shadowWrap}>
      <ImageBackground source={cardBg} style={styles.card} imageStyle={styles.cardImage} resizeMode="cover">
        <View style={[StyleSheet.absoluteFill, styles.overlay]} />
        <View style={styles.row}>
          {weekProgress.map((day) => (
            <WeekDayChip key={day.label} day={day} />
          ))}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    backgroundColor: colors2.white,
    borderRadius: radii2.card,
    paddingBottom: 4,
  },
  card: {
    borderRadius: radii2.card,
    borderWidth: 1,
    borderColor: colors2.white,
    overflow: 'hidden',
    paddingTop: spacing2.xl,
    paddingBottom: spacing2.md,
    paddingHorizontal: spacing2.md,
  },
  cardImage: { borderRadius: radii2.card },
  // Lớp phủ tối rgba(34,34,34,0.64) đè lên ảnh cờ caro (Figma) để chữ/icon
  // trắng bên trên luôn đọc rõ.
  overlay: { backgroundColor: 'rgba(34,34,34,0.64)' },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing2.sm },
});
