import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';
import { colors2, fontFamily2 } from './theme';
import { SkillHexRings } from './icons2';
import type { SkillScore } from '../data/types';

// Biểu đồ lục giác cho màn Home (thiết kế mới, node-id=23-305) — CHỈ dùng
// trong SkillRadarCard.tsx. KHÔNG dùng chung với components/SkillRadarChart.tsx
// (bản cũ, nền trắng) vì component đó còn được PersonalAnalysisScreen và
// TeamSkillGapCard dùng nguyên trạng — sửa nó sẽ làm hỏng 2 màn đó trước khi
// tới lượt chúng được redesign.

const RING_SIZE = 120;
const CONTAINER_W = 320;
const CONTAINER_H = 210;
const CX = CONTAINER_W / 2;
const CY = 95;
const LABEL_R = 80;
const LABEL_W = 84;
const SIN60 = 0.866;

// Chữ hiển thị đúng theo Figma — CHỈ override cách hiển thị ở màn Home
// (component này không dùng chung với ai khác), KHÔNG đổi
// app/data/scoreCriteriaMeta.ts#RADAR_DISPLAY vì shortLabel viết tắt ở đó
// còn được dùng cho biểu đồ compact ở PersonalAnalysisScreen/TeamSkillGapCard
// (đổi chung sẽ làm dài chữ tràn layout ở 2 màn đó, chưa tới lượt redesign).
// "\n" ở 2 nhãn dưới là NGẮT DÒNG THẬT trong Figma gốc (2 thẻ <p> riêng —
// "Kiến thức"/"sản phẩm", "Khai thác"/"nhu cầu"), không phải do tràn chữ.
const FIGMA_LABEL_OVERRIDES: Record<string, string> = {
  customer_understanding: 'Hiểu Khách hàng',
  knowledge: 'Kiến thức\nsản phẩm',
  communication: 'Giao tiếp',
  objection_handling: 'Xử lý từ chối',
  insight_discovery: 'Khai thác\nnhu cầu',
  closing: 'Chốt Sale',
};

// Mỗi nhãn neo theo TÂM khối chữ tại đúng đỉnh lục giác của nó (thay vì
// theo mép trên) — 2 nhãn 2 dòng (khối chữ cao hơn) trước chỉ neo theo tâm
// riêng chúng làm lệch so với 4 nhãn 1 dòng còn lại (vẫn neo theo mép trên,
// tức thấp hơn) — giờ ÁP DỤNG CHUNG 1 quy tắc cho cả 6 nhãn để đều nằm cân
// đối quanh chart, 4 nhãn 1 dòng cũng dịch lên theo đúng tỉ lệ chiều cao
// khối chữ của chúng.
const LINE_H = 16;
const VALUE_H = 20 + 2;
const BLOCK_H_1LINE = LINE_H + VALUE_H;
const BLOCK_H_2LINE = LINE_H * 2 + VALUE_H;

// Bán kính đỉnh của vòng NGOÀI CÙNG trong SkillHexRings (node-id=118:13334
// vùng) — suy từ path gốc Figma của HEX_RING_PATHS.outer trong icons2.tsx:
// đỉnh trên ở y=0.576, đỉnh dưới ở y=149.423 (viewBox cao 150) -> tâm
// y=75, bán kính gốc = 75 - 0.576 = 74.42, nhân với scale = RING_SIZE/150
// (xem SkillHexRings) = 0.8 -> 74.42*0.8 ≈ 59.5. Đây là bán kính ứng với
// 100% trên biểu đồ dữ liệu (Polygon118:13334-13346 trong Figma), để hình
// dữ liệu khớp đúng cỡ 3 vòng lưới nền.
const DATA_MAX_RADIUS = 59.5;
// Sàn tối thiểu để 0% vẫn hiện 1 chấm nhỏ cạnh tâm thay vì biến mất hẳn
// (dễ đọc hơn là 1 điểm trùng tâm không phân biệt được góc trục nào).
const MIN_VALUE_RATIO = 0.08;

/** Toạ độ 1 đỉnh của hình dữ liệu/lưới nền — cùng hệ góc với SLOTS bên dưới
 * (thứ tự xuôi kim đồng hồ bắt đầu từ trục trên-phải, xem app/data/types.ts). */
function hexPointAt(index: number, radius: number) {
  const angleDeg = -60 + index * 60;
  const angleRad = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(angleRad), y: CY + radius * Math.sin(angleRad) };
}

// Đúng 6 vị trí đỉnh lục giác (nhọn trái/phải, phẳng trên/dưới) — thứ tự
// khớp UserProgress.skills: "xuôi theo chiều kim đồng hồ bắt đầu từ trục
// trên-phải" (xem app/data/types.ts).
const SLOTS = [
  { x: CX + LABEL_R * 0.5, y: CY - LABEL_R * SIN60, align: 'left' as const, width: 112 }, // trên-phải: "Hiểu Khách hàng" — 1 dòng, cần rộng hơn
  { x: CX + LABEL_R, y: CY, align: 'left' as const, width: LABEL_W }, // phải: "Kiến thức sản phẩm"
  { x: CX + LABEL_R * 0.5, y: CY + LABEL_R * SIN60, align: 'left' as const, width: LABEL_W }, // dưới-phải
  { x: CX - LABEL_R * 0.5, y: CY + LABEL_R * SIN60, align: 'right' as const, width: LABEL_W }, // dưới-trái
  { x: CX - LABEL_R, y: CY, align: 'right' as const, width: LABEL_W }, // trái: "Khai thác nhu cầu"
  { x: CX - LABEL_R * 0.5, y: CY - LABEL_R * SIN60, align: 'right' as const, width: LABEL_W }, // trên-trái
];

export function SkillHexChart({ skills }: { skills: SkillScore[] }) {
  const shownSkills = skills.slice(0, 6);
  const dataPoints = shownSkills
    .map((s, i) => {
      const p = hexPointAt(i, DATA_MAX_RADIUS * Math.max(MIN_VALUE_RATIO, s.value / 100));
      return `${p.x},${p.y}`;
    })
    .join(' ');

  return (
    <View style={styles.wrap}>
      <View style={styles.rings}>
        <SkillHexRings size={RING_SIZE} />
      </View>

      {/* 6 trục từ tâm ra đỉnh lục giác ngoài cùng (node-id=118:13334-13337
          trong Figma — 3 "Vector" vẽ 3 đường thẳng, mỗi đường xuyên tâm nối
          2 đỉnh đối nhau, tức đủ 6 trục) + hình dữ liệu thật (điểm user) +
          chấm ở mỗi đỉnh (node-id=118:13340-13346). Trước đây chart chỉ vẽ 3
          vòng lưới nền cố định, thiếu cả 2 phần này nên luôn trông như "0%"
          dù skills có điểm thật. */}
      <Svg width={CONTAINER_W} height={CONTAINER_H} style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: 6 }, (_, i) => {
          const p = hexPointAt(i, DATA_MAX_RADIUS);
          return <Line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={colors2.white} strokeOpacity={0.6} strokeWidth={1.2} />;
        })}
        <Polygon points={dataPoints} fill={colors2.orange} fillOpacity={0.85} stroke={colors2.orange} strokeWidth={1.5} strokeLinejoin="round" />
        {shownSkills.map((s, i) => {
          const p = hexPointAt(i, DATA_MAX_RADIUS * Math.max(MIN_VALUE_RATIO, s.value / 100));
          return <Circle key={s.key} cx={p.x} cy={p.y} r={2} fill={colors2.orange} />;
        })}
      </Svg>

      {skills.slice(0, 6).map((skill, i) => {
        const slot = SLOTS[i];
        const isLeft = slot.align === 'right';
        const caption = FIGMA_LABEL_OVERRIDES[skill.key] ?? skill.shortLabel;
        const isTwoLines = caption.includes('\n');
        const blockH = isTwoLines ? BLOCK_H_2LINE : BLOCK_H_1LINE;
        return (
          <View
            key={skill.key}
            style={[
              styles.label,
              {
                top: slot.y - blockH / 2,
                width: slot.width,
                alignItems: isLeft ? 'flex-end' : 'flex-start',
                ...(isLeft ? { right: CONTAINER_W - slot.x } : { left: slot.x }),
              },
            ]}
          >
            <Text style={[styles.caption, isLeft && styles.textRight]}>{caption}</Text>
            <Text style={styles.value}>{skill.value}%</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: CONTAINER_W, height: CONTAINER_H, alignSelf: 'center' },
  rings: { position: 'absolute', left: CX - RING_SIZE / 2, top: CY - RING_SIZE / 2 },
  label: { position: 'absolute' },
  caption: { fontFamily: fontFamily2.regular, fontSize: 12, lineHeight: 16, color: colors2.whiteMuted },
  textRight: { textAlign: 'right' },
  value: { fontFamily: fontFamily2.displaySpeed, fontSize: 20, lineHeight: 20, color: colors2.white, marginTop: 2 },
});
