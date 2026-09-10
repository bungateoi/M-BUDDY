import Svg, { Path } from 'react-native-svg';
import { colors } from './theme';
import type { MapPoint } from './mapLayout';

/** Nối các điểm bằng cubic bezier mượt, tangent dọc tại mỗi điểm — cho
 * cảm giác đường lượn sóng tự nhiên thay vì các đoạn thẳng gãy khúc. */
function buildSmoothPath(points: MapPoint[]) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midY = (p1.y - p0.y) / 2;
    d += ` C ${p0.x} ${p0.y + midY}, ${p1.x} ${p1.y - midY}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export function MapPathLine({
  points,
  height,
  width,
}: {
  points: MapPoint[];
  height: number;
  width: number;
}) {
  if (points.length < 2 || height <= 0 || width <= 0) return null;

  return (
    <Svg
      width={width}
      height={height}
      style={{ position: 'absolute', left: 0, top: 0 }}
      pointerEvents="none"
    >
      <Path
        d={buildSmoothPath(points)}
        stroke={colors.pathLine}
        strokeWidth={3}
        strokeDasharray="2, 10"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
