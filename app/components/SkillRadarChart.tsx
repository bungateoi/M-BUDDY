import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily } from './theme';
import type { SkillScore } from '../data/types';

const SIZE = 288;
const CENTER = SIZE / 2;
const MAX_RADIUS = 64;
const LABEL_RADIUS = 80;
const LABEL_BOX = 74;
const RING_RATIOS = [1, 0.66, 0.33];

function pointAt(index: number, total: number, radius: number) {
  // Lệch 180/total độ so với "12 giờ" để lục giác có cạnh phẳng ở trên/dưới
  // (giống ui-draft/man-home.png) thay vì đỉnh nhọn ở trên.
  const angle = -90 + 180 / total + index * (360 / total);
  const rad = (angle * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function ringPoints(total: number, ratio: number) {
  return Array.from({ length: total }, (_, i) => {
    const p = pointAt(i, total, MAX_RADIUS * ratio);
    return `${p.x},${p.y}`;
  }).join(' ');
}

export function SkillRadarChart({
  skills,
  centerLabel,
}: {
  skills: SkillScore[];
  /** Hiện 1 badge tròn ở tâm chart, vd tổng điểm năng lực — xem
   * PersonalAnalysisScreen. Bỏ qua để giữ chart trơn như ở màn Home. */
  centerLabel?: { value: number; caption: string };
}) {
  const total = skills.length;
  const dataPoints = skills
    .map((s, i) => {
      const p = pointAt(i, total, MAX_RADIUS * Math.max(0.1, s.value / 100));
      return `${p.x},${p.y}`;
    })
    .join(' ');

  return (
    <View style={styles.wrap}>
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE}>
          {RING_RATIOS.map((ratio) => (
            <Polygon
              key={ratio}
              points={ringPoints(total, ratio)}
              fill="none"
              stroke={colors.gridLine}
              strokeWidth={1}
            />
          ))}
          {skills.map((s, i) => {
            const p = pointAt(i, total, MAX_RADIUS);
            return (
              <Line key={s.key} x1={CENTER} y1={CENTER} x2={p.x} y2={p.y} stroke={colors.gridLine} strokeWidth={1} />
            );
          })}
          <Polygon points={dataPoints} fill={colors.primary} fillOpacity={0.28} stroke={colors.primary} strokeWidth={2.5} />
          {skills.map((s, i) => {
            const p = pointAt(i, total, MAX_RADIUS * Math.max(0.1, s.value / 100));
            return <Circle key={s.key} cx={p.x} cy={p.y} r={4} fill={colors.primary} />;
          })}
          <Circle cx={CENTER} cy={CENTER} r={3} fill={colors.gridLine} />
        </Svg>

        {skills.map((s, i) => {
          // Neo icon vào đúng đỉnh (gần hexagon), chữ toả ra phía ngoài.
          const p = pointAt(i, total, LABEL_RADIUS);
          const isLeftHalf = p.x < CENTER;
          return (
            <View
              key={s.key}
              style={[
                styles.labelItem,
                {
                  top: p.y - 22,
                  width: LABEL_BOX,
                  ...(isLeftHalf ? { right: SIZE - p.x, flexDirection: 'row-reverse' } : { left: p.x, flexDirection: 'row' }),
                },
              ]}
              pointerEvents="none"
            >
              <View style={styles.iconBadge}>
                <Ionicons name={s.icon as any} size={13} color={colors.primary} />
              </View>
              <View style={{ flexShrink: 1, alignItems: isLeftHalf ? 'flex-end' : 'flex-start' }}>
                <Text style={[styles.labelText, isLeftHalf && styles.textRight]} numberOfLines={2}>
                  {s.shortLabel}
                </Text>
                <Text style={styles.labelValue}>{s.value}%</Text>
              </View>
            </View>
          );
        })}
      </View>

      {centerLabel && (
        <View style={styles.totalBadge}>
          <Text style={styles.totalValue}>{centerLabel.value}%</Text>
          <Text style={styles.totalCaption}>{centerLabel.caption}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  totalBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: -8,
  },
  totalValue: { fontFamily: fontFamily.black, fontSize: 20, color: colors.primary },
  totalCaption: { fontFamily: fontFamily.bold, fontSize: 11.5, color: colors.textMuted },
  labelItem: {
    position: 'absolute',
    alignItems: 'flex-start',
    gap: 5,
  },
  iconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 11,
    lineHeight: 13.5,
    color: colors.textPrimary,
  },
  textRight: { textAlign: 'right' },
  labelValue: {
    fontFamily: fontFamily.extraBold,
    fontSize: 12.5,
    color: colors.textPrimary,
  },
});
