import type { BadgeTier, BadgeTierId } from './types';

// Nguồn: ui-draft/man-xephang.png — 5 hạng huy hiệu kinh nghiệm theo mốc XP.
export const badgeTiers: BadgeTier[] = [
  { id: 'dong', label: 'Đồng', minXp: 0 },
  { id: 'bac', label: 'Bạc', minXp: 500 },
  { id: 'vang', label: 'Vàng', minXp: 1500 },
  { id: 'bachkim', label: 'Bạch kim', minXp: 3000 },
  { id: 'kimcuong', label: 'Kim cương', minXp: 5000 },
];

// Cắt sẵn từ assets/cup.png (1 sprite ngang 5 cúp) thành 5 file riêng —
// xem scripts note trong PR: cắt bằng Pillow theo vùng alpha > 0 của từng
// cúp, không méo/lệch so với ảnh gốc.
export const badgeTierIcons = {
  dong: require('../assets/cup-bronze.png'),
  bac: require('../assets/cup-silver.png'),
  vang: require('../assets/cup-gold.png'),
  bachkim: require('../assets/cup-platinum.png'),
  kimcuong: require('../assets/cup-diamond.png'),
} as const satisfies Record<BadgeTierId, unknown>;

/** Hạng hiện tại + hạng kế tiếp (null nếu đã ở hạng cao nhất) theo XP. */
export function getBadgeTierProgress(xp: number): { current: BadgeTier; next: BadgeTier | null } {
  let current = badgeTiers[0];
  for (const tier of badgeTiers) {
    if (xp >= tier.minXp) current = tier;
  }
  const currentIndex = badgeTiers.findIndex((t) => t.id === current.id);
  const next = currentIndex < badgeTiers.length - 1 ? badgeTiers[currentIndex + 1] : null;
  return { current, next };
}
