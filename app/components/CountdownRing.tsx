import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors2, fontFamily2 } from './theme';

// Kích thước + màu khớp Figma (node-id=76:3536, "Clock") — nền tối #2E2E2E
// thay cho track cam nhạt cũ, viền tiến độ vẫn cam (colors2.orange, đúng màu
// "Time" asset gốc). Kỹ thuật vẽ (stroke + dasharray/dashoffset, xoay -90°)
// giữ nguyên như bản cũ — asset SVG gốc của Figma là 1 path tĩnh ứng đúng 1
// mốc thời gian cụ thể (2:15), không tái dùng được cho giá trị động.
const SIZE = 64;
const STROKE = 6.4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return `${m}:${rest.toString().padStart(2, '0')}`;
}

export function CountdownRing({ secondsLeft, totalSeconds }: { secondsLeft: number; totalSeconds: number }) {
  const progress = totalSeconds > 0 ? Math.max(0, Math.min(1, secondsLeft / totalSeconds)) : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE} style={styles.svgRotated}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors2.cardOptionIdle}
          strokeWidth={STROKE}
          fill="none"
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors2.orange}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={dashOffset}
          fill="none"
        />
      </Svg>
      <Text style={styles.text}>{formatTime(secondsLeft)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  text: { position: 'absolute', fontFamily: fontFamily2.semiBold, fontSize: 14, color: colors2.white },
  svgRotated: { transform: [{ rotate: '-90deg' }] },
});
