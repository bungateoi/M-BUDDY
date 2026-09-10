import { Pressable, StyleSheet, View } from 'react-native';
import { MapLevelNode } from './MapLevelNode';
import { MapLevelCard } from './MapLevelCard';
import {
  MAP_NODE_GAP,
  MAP_NODE_SIZE,
  MAP_ROW_SPACING,
  MAP_ROW_TOP_HEIGHT,
  getMapNodeCenterX,
} from './mapLayout';
import { spacing } from './theme';
import type { LevelStatus } from '../data/types';

export function MapLevelRow({
  status,
  positionInChapter,
  productName,
  offsetIndex,
  laneWidth,
  alignLeft,
  onPressStart,
  isLast,
}: {
  status: LevelStatus;
  positionInChapter: number;
  productName: string;
  offsetIndex: number;
  laneWidth: number;
  alignLeft: boolean;
  onPressStart?: () => void;
  isLast?: boolean;
}) {
  const nodeSize = MAP_NODE_SIZE[status];
  const topHeight = MAP_ROW_TOP_HEIGHT[status];
  const rowHeight = topHeight;

  const nodeCenterX = getMapNodeCenterX(offsetIndex, laneWidth);
  const nodeLeft = nodeCenterX - nodeSize / 2;
  const leftWidth = Math.max(nodeLeft - MAP_NODE_GAP, 0);
  const rightLeft = nodeLeft + nodeSize + MAP_NODE_GAP;
  const rightWidth = Math.max(laneWidth - rightLeft, 0);

  const sideAlign = alignLeft ? 'flex-end' : 'flex-start';
  const cardMaxWidth = (alignLeft ? leftWidth : rightWidth) - spacing.xs;

  // Card chỉ để hiển thị tên level/sản phẩm — bấm để vào học giờ nằm ở
  // node (ngôi sao/tick), không còn nút "Bắt đầu học" riêng nữa.
  const content = (
    <View style={[styles.cardWrap, { height: topHeight, alignItems: sideAlign }]}>
      <MapLevelCard
        status={status}
        positionInChapter={positionInChapter}
        productName={productName}
        maxWidth={cardMaxWidth}
      />
    </View>
  );

  return (
    <View style={[styles.row, { height: rowHeight }, !isLast && { marginBottom: MAP_ROW_SPACING }]}>
      <View style={[styles.slot, { left: 0, width: leftWidth }]}>{alignLeft && content}</View>

      <Pressable
        style={[styles.nodeSlot, { left: nodeLeft, width: nodeSize, height: topHeight }]}
        onPress={onPressStart}
      >
        <MapLevelNode status={status} size={nodeSize} />
      </Pressable>

      <View style={[styles.slot, { left: rightLeft, width: rightWidth }]}>{!alignLeft && content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { position: 'relative' },
  slot: { position: 'absolute', top: 0 },
  cardWrap: { justifyContent: 'center' },
  nodeSlot: { position: 'absolute', top: 0, alignItems: 'center', justifyContent: 'center' },
});
