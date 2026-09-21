import Svg, { Path } from 'react-native-svg';
import { colors2 } from './theme';
import { MAP_ROAD_CORNER_RADIUS, MAP_ROAD_THICKNESS, type MapPoint } from './mapLayout';

/** Nối các điểm bằng "đường ống" vuông góc bo tròn (dọc → ngang → dọc) —
 * đúng kiểu ghép Road/Road Corner trong Figma (node-id=30:1819), nhưng dựng
 * bằng path SVG tổng quát (quadratic bezier tại góc bo) thay vì ghép ảnh
 * cố định pixel, để co giãn đúng theo laneWidth thực tế trên từng máy. */
function buildRoadPath(points: MapPoint[]) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midY = (p0.y + p1.y) / 2;
    const dir = p1.x > p0.x ? 1 : p1.x < p0.x ? -1 : 0;

    if (dir === 0) {
      d += ` L ${p0.x} ${p1.y}`;
      continue;
    }

    const r = Math.min(MAP_ROAD_CORNER_RADIUS, Math.abs(p1.x - p0.x) / 2, Math.abs(midY - p0.y));
    d += ` L ${p0.x} ${midY - r}`;
    d += ` Q ${p0.x} ${midY} ${p0.x + dir * r} ${midY}`;
    d += ` L ${p1.x - dir * r} ${midY}`;
    d += ` Q ${p1.x} ${midY} ${p1.x} ${midY + r}`;
    d += ` L ${p1.x} ${p1.y}`;
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

  const d = buildRoadPath(points);

  return (
    <Svg
      width={width}
      height={height}
      style={{ position: 'absolute', left: 0, top: 0 }}
      pointerEvents="none"
    >
      <Path d={d} stroke={colors2.roadGray} strokeWidth={MAP_ROAD_THICKNESS} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path
        d={d}
        stroke={colors2.white}
        strokeOpacity={0.25}
        strokeWidth={1}
        strokeDasharray="8 8"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
