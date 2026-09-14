import { useRef } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StarFillIcon } from './icons2';
import { badgeTiers, getBadgeTierProgress } from '../data';
import { colors2, fontFamily2, radii2, spacing2 } from './theme';
import type { BadgeTierId } from '../data/types';

// Dải cúp thành tích (node-id=36:3088, "Trophy") — 5 biến thể ứng đúng thứ
// tự 5 hạng trong app/data/badgeTiers.ts (dong→Bronze, bac→Silver,
// vang→Gold, bachkim→Platinum, kimcuong→Diamond). Ảnh xuất theo đúng tỉ lệ/
// canh lề của từng biến thể trong Figma (Bronze canh đáy, Silver/Gold hụt
// 22.9px trên đỉnh, Platinum/Diamond cao đầy đủ) — xem TROPHY_SPECS.
const TROPHY_SOURCES: Record<BadgeTierId, unknown> = {
  dong: require('../assets/v2/leaderboard/trophy-bronze.png'),
  bac: require('../assets/v2/leaderboard/trophy-silver.png'),
  vang: require('../assets/v2/leaderboard/trophy-gold.png'),
  bachkim: require('../assets/v2/leaderboard/trophy-platinum.png'),
  kimcuong: require('../assets/v2/leaderboard/trophy-diamond.png'),
};

const COLUMN_HEIGHT = 120;
const COLUMN_GAP = 24;

const TROPHY_SPECS: Record<BadgeTierId, { width: number; height: number; marginTop: number }> = {
  dong: { width: 94, height: 80, marginTop: COLUMN_HEIGHT - 80 },
  bac: { width: 120, height: 97, marginTop: 23 },
  vang: { width: 121, height: 97, marginTop: 23 },
  bachkim: { width: 120, height: 120, marginTop: 0 },
  kimcuong: { width: 145, height: 120, marginTop: 0 },
};

function formatXp(xp: number): string {
  return xp.toLocaleString('vi-VN');
}

/** Dải trạng thái hạng + cúp thành tích trên nền cam đặc (phần đầu cố định
 * màn Xếp hạng, node-id=67-1049) — không còn là 1 Card trắng độc lập như
 * bản cũ, cũng không còn gradient (nền cam giờ là màu đặc như các màn khác). */
export function BadgeTierCard({ xp }: { xp: number }) {
  const { current } = getBadgeTierProgress(xp);
  const currentIndex = badgeTiers.findIndex((t) => t.id === current.id);
  const scrollRef = useRef<ScrollView>(null);
  const hasCenteredRef = useRef(false);

  // Tự cuộn để cúp hạng hiện tại nằm giữa màn — dải cúp cố tình tràn 2 bên
  // (giống Figma, các hạng lân cận "ló" ra ở mép) thay vì ép vừa khung.
  const handleLayout = (viewportWidth: number) => {
    if (hasCenteredRef.current || viewportWidth <= 0) return;
    hasCenteredRef.current = true;
    let x = 0;
    for (let i = 0; i < currentIndex; i++) {
      x += TROPHY_SPECS[badgeTiers[i].id].width + COLUMN_GAP;
    }
    const currentWidth = TROPHY_SPECS[badgeTiers[currentIndex].id].width;
    const targetX = x + currentWidth / 2 - viewportWidth / 2;
    scrollRef.current?.scrollTo({ x: Math.max(0, targetX), animated: false });
  };

  return (
    <View>
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>Bạn đang ở hạng {current.label}</Text>
        <View style={styles.statusPill}>
          <StarFillIcon size={16} />
          <Text style={styles.statusPillText}>{formatXp(xp)} XP</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onLayout={(e) => handleLayout(e.nativeEvent.layout.width)}
        contentContainerStyle={styles.trophyRow}
      >
        {badgeTiers.map((tier) => {
          const spec = TROPHY_SPECS[tier.id];
          const isCurrent = tier.id === current.id;
          return (
            <View key={tier.id} style={[styles.trophyCol, { width: spec.width }]}>
              <View style={[styles.trophyBox, !isCurrent && styles.trophyBoxDimmed]}>
                <Image
                  source={TROPHY_SOURCES[tier.id] as never}
                  style={{ width: spec.width, height: spec.height, marginTop: spec.marginTop }}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.tierXp}>{formatXp(tier.minXp)} XP</Text>
              <Text style={styles.tierLabel}>{tier.label}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing2.md },
  statusText: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors2.black,
    borderRadius: radii2.pill,
    paddingHorizontal: spacing2.xs,
    paddingVertical: 4,
  },
  statusPillText: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
  // Khớp đúng Figma: khoảng cách hàng trạng thái -> dải cúp = 16px
  // (top-111+cao~28=139 -> top trophy 155).
  trophyRow: { alignItems: 'flex-end', gap: COLUMN_GAP, paddingTop: spacing2.md },
  trophyCol: { alignItems: 'center' },
  trophyBox: { height: COLUMN_HEIGHT, width: '100%', alignItems: 'center' },
  trophyBoxDimmed: { opacity: 0.5 },
  tierXp: { fontFamily: fontFamily2.display, fontSize: 24, lineHeight: 36, color: colors2.white, marginTop: spacing2.xs },
  tierLabel: { fontFamily: fontFamily2.semiBold, fontSize: 14, lineHeight: 20, color: colors2.white },
});
