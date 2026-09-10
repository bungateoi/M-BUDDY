import { spacing } from './theme';
import type { LevelStatus } from '../data/types';

// Nguồn toạ độ duy nhất cho path màn Map. Đường đi nằm giữa `laneWidth`
// (đo thực tế từ layout, responsive theo màn hình), node lệch nhẹ quanh
// tâm để tạo cảm giác ngoằn ngoèo, card nội dung nằm luân phiên trái/phải
// quanh node. MapLevelRow dùng đúng các hằng số này để tự đặt kích thước
// cố định, MapPathLine dùng đúng công thức tương tự để vẽ đường cong đi
// qua chính xác từng node — không đo layout động, tránh lệch điểm.

// Độ lệch của tâm node so với tâm `laneWidth`, theo vị trí dòng (0 = ải
// trên cùng đang hiển thị). Âm = lệch trái, dương = lệch phải.
export const MAP_NODE_WIGGLE = [-10, 8, -12, 10, -8];

export const MAP_NODE_GAP = 10; // khoảng cách giữa node và card 2 bên
// Giãn rõ rệt so với spacing.xxl (28) gốc — người dùng phản hồi bản trước
// (28, rồi 36) vẫn còn chật.
export const MAP_ROW_SPACING = spacing.xxl * 2;

// 'current' dùng CHUNG kích thước với 'completed' — trước đây to hơn hẳn
// (84px, ngôi sao + gradient cam cố định) gây lệch thiết kế so với các
// level khác trong cùng chặng. Giờ ngôi sao + gradient chỉ còn là hiệu ứng
// hover (xem MapLevelNode), không gắn với status nữa, nên node cần đồng
// nhất kích thước ở mọi trạng thái đã mở khoá.
export const MAP_NODE_SIZE: Record<LevelStatus, number> = {
  locked: 62,
  completed: 62,
  current: 62,
};

// Chiều cao cố định phần "node + card" (trước accessory). Card giờ chỉ
// còn 1 dòng "Level N • Tên sản phẩm" nên chiều cao do node quyết định.
export const MAP_ROW_TOP_HEIGHT: Record<LevelStatus, number> = {
  locked: 66,
  completed: 62,
  current: 62,
};

// Không còn nút "Bắt đầu học" riêng — bấm thẳng vào node (ngôi sao/tick)
// để vào học, nên không còn phần phụ bên dưới card nữa.
export const MAP_ACCESSORY_HEIGHT: Record<LevelStatus, number> = {
  locked: 0,
  completed: 0,
  current: 0,
};
// Khoảng cách giữa card và phần phụ bên dưới nó (chỉ áp dụng khi có phụ).
export const MAP_ACCESSORY_GAP = 6;

export interface MapPoint {
  x: number;
  y: number;
}

export function getMapNodeCenterX(offsetIndex: number, laneWidth: number) {
  return laneWidth / 2 + MAP_NODE_WIGGLE[offsetIndex % MAP_NODE_WIGGLE.length];
}

export function computeMapNodeCenters(
  statuses: LevelStatus[],
  laneWidth: number,
  /** Khoảng trống (px) chèn TRƯỚC mỗi hàng — dùng cho banner chặng khi map
   * nối liền nhiều chặng (MapScreen). Cùng độ dài với `statuses`. */
  extraSpaceBeforeRow?: number[]
): { points: MapPoint[]; totalHeight: number } {
  let cumulativeY = 0;
  const points: MapPoint[] = [];

  statuses.forEach((status, i) => {
    cumulativeY += extraSpaceBeforeRow?.[i] ?? 0;
    const topHeight = MAP_ROW_TOP_HEIGHT[status];

    points.push({
      x: getMapNodeCenterX(i, laneWidth),
      y: cumulativeY + topHeight / 2,
    });

    const accessoryHeight = MAP_ACCESSORY_HEIGHT[status];
    const accessoryBlock = accessoryHeight > 0 ? accessoryHeight + MAP_ACCESSORY_GAP : 0;
    const isLast = i === statuses.length - 1;
    cumulativeY += topHeight + accessoryBlock + (isLast ? 0 : MAP_ROW_SPACING);
  });

  return { points, totalHeight: cumulativeY };
}
