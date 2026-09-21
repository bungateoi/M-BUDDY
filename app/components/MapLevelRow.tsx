import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MapLevelNode } from './MapLevelNode';
import { MAP_NODE_COL_HEIGHT, MAP_NODE_COL_WIDTH, MAP_ROW_PITCH, getMapNodeCenterX } from './mapLayout';
import { colors2, fontFamily2 } from './theme';
import type { LevelStatus } from '../data/types';

// Mỗi node CHỈ còn nhãn "Level N" phía trên + vòng tròn trạng thái, canh
// giữa theo 1 cột — không còn thẻ tên sản phẩm bên cạnh như bản cũ (Figma
// node-id=30:1819 không có thẻ này, bấm thẳng vào node để vào học).
export function MapLevelRow({
  status,
  positionInChapter,
  offsetIndex,
  laneWidth,
  onPressStart,
  isLast,
}: {
  status: LevelStatus;
  positionInChapter: number;
  offsetIndex: number;
  laneWidth: number;
  onPressStart?: () => void;
  isLast?: boolean;
}) {
  const centerX = getMapNodeCenterX(offsetIndex, laneWidth);

  return (
    <View style={[styles.row, { height: MAP_NODE_COL_HEIGHT }, !isLast && { marginBottom: MAP_ROW_PITCH - MAP_NODE_COL_HEIGHT }]}>
      <Pressable
        style={[styles.col, { left: centerX - MAP_NODE_COL_WIDTH / 2, width: MAP_NODE_COL_WIDTH }]}
        onPress={onPressStart}
      >
        <Text style={styles.label}>Level {positionInChapter}</Text>
        <MapLevelNode status={status} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { position: 'relative' },
  col: { position: 'absolute', top: 0, alignItems: 'center', gap: 8 },
  label: { fontFamily: fontFamily2.display, fontSize: 16, lineHeight: 24, color: colors2.white, textAlign: 'center' },
});
