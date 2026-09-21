import type { LevelStatus } from '../data/types';

// Nguồn toạ độ duy nhất cho path màn Map — khớp Figma "Hackathon"
// (node-id=30:1819, Bản đồ): 2 làn trái/phải cố định (không phải wiggle
// nhỏ như bản cũ), khoảng cách Y đều nhau giữa các node bất kể trạng thái
// khoá/mở (Figma không có kiểu dáng riêng cho "đã hoàn thành" — locked dùng
// 1 kiểu, unlocked (current/completed) dùng chung 1 kiểu, xem MapLevelNode).

// Tâm node lấy đúng tỉ lệ Figma (canvas gốc 390px): trái ở x=89, phải ở
// x=302 — quy về tỉ lệ % để co giãn theo laneWidth thực tế trên máy.
export const MAP_LEFT_X_RATIO = 89 / 390;
export const MAP_RIGHT_X_RATIO = 302 / 390;

export const MAP_NODE_COL_WIDTH = 80;
export const MAP_NODE_LABEL_HEIGHT = 24;
export const MAP_NODE_LABEL_GAP = 8;
// Vòng tròn "thật" (không tính phần bóng đổ tràn dưới trong asset xuất
// 80x70 — ellipse rx=40 ry=32, tức cao 64).
export const MAP_NODE_CIRCLE_HEIGHT = 64;
export const MAP_NODE_COL_HEIGHT = MAP_NODE_LABEL_HEIGHT + MAP_NODE_LABEL_GAP + MAP_NODE_CIRCLE_HEIGHT; // 96, khớp Figma

// Khoảng cách đều giữa TÂM 2 node liên tiếp — 4 node trong Figma cách đều
// nhau đúng 146px (72, 218, 364, 510).
export const MAP_ROW_PITCH = 146;

// Đường nối (road) — xem MapPathLine.tsx. Độ dày + bán kính bo góc lấy từ
// asset road-corner.svg (100x100, dải dày 25px), bo góc dựng bằng quadratic
// bezier (không phải cung tròn tuyệt đối) nên đặt "bán kính" xấp xỉ thay vì
// chép nguyên số Figma.
export const MAP_ROAD_THICKNESS = 25;
export const MAP_ROAD_CORNER_RADIUS = 44;

export function getMapNodeCenterX(offsetIndex: number, laneWidth: number) {
  // offsetIndex=0 là node TRÊN CÙNG đang hiển thị (level số cao nhất trong
  // chặng) — Figma đặt node này ở làn PHẢI, rồi so le dần xuống dưới.
  const isRight = offsetIndex % 2 === 0;
  return laneWidth * (isRight ? MAP_RIGHT_X_RATIO : MAP_LEFT_X_RATIO);
}

export interface MapPoint {
  x: number;
  y: number;
}

export function computeMapNodeCenters(
  statuses: LevelStatus[],
  laneWidth: number,
  /** Khoảng trống (px) chèn TRƯỚC mỗi hàng — dùng cho banner chặng khi map
   * nối liền nhiều chặng (MapScreen). Cùng độ dài với `statuses`. */
  extraSpaceBeforeRow?: number[]
): { points: MapPoint[]; totalHeight: number } {
  const points: MapPoint[] = [];
  let colTopY = 0;

  statuses.forEach((_, i) => {
    colTopY += extraSpaceBeforeRow?.[i] ?? 0;

    points.push({
      x: getMapNodeCenterX(i, laneWidth),
      y: colTopY + MAP_NODE_LABEL_HEIGHT + MAP_NODE_LABEL_GAP + MAP_NODE_CIRCLE_HEIGHT / 2,
    });

    const isLast = i === statuses.length - 1;
    colTopY += MAP_NODE_COL_HEIGHT + (isLast ? 0 : MAP_ROW_PITCH - MAP_NODE_COL_HEIGHT);
  });

  return { points, totalHeight: colTopY };
}
